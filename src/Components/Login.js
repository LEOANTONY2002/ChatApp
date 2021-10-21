import React, { useState } from "react";
import firebase from "firebase";
import { auth, db } from "./firebase";
import { useStateValue } from "../StateProvider";
import "./Chat.css";
import { useHistory } from "react-router-dom";
import load from "./Eclipse-1s-200px.svg";

function Login() {
  const [log, setLog] = useState(true);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const login = () => {
    if (log) {
      setError(null);
      setLoading(true);
      auth
        .signInWithEmailAndPassword(email, pw)
        .then((user) => {
          db.collection("users")
            .doc(email)
            .get()
            .then((userFb) => {
              dispatch({
                type: "SET_EMAIL",
                email: email,
              });
              if (!userFb?.exists) {
                history.push("/createProfile");
              } else {
                db.collection("users")
                  .doc(email)
                  .get()
                  .then((d) => {
                    dispatch({
                      type: "SET_USER",
                      user: d.data(),
                    });
                    history.push("/chat");
                  });
              }
            });
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    } else {
      setError(null);
      setLoading(true);
      auth
        .createUserWithEmailAndPassword(email, pw)
        .then((user) => {
          db.collection("users")
            .doc(email)
            .get()
            .then((userFb) => {
              dispatch({
                type: "SET_EMAIL",
                email: email,
              });
              if (!userFb?.exists) {
                history.push("/createProfile");
              } else {
                dispatch({
                  type: "SET_USER",
                  user: userFb.data(),
                });
                history.push("/chat");
              }
            });
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    }
  };

  return (
    <div className="login">
      <div className="l-con">
        <img
          src="https://img.icons8.com/pastel-glyph/96/ffffff/person-male--v2.png"
          alt="user"
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPw(e.target.value)}
        />
        {loading && <img src={load} className="loading" />}
        <p className="l-err">{error}</p>
        <button onClick={() => login()}>{log ? "Login" : "Signup"}</button>
        {log ? (
          <p>
            Don't you have an account?{" "}
            <span onClick={() => setLog(false)}>Signup</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setLog(true)}>Login</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
