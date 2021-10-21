import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import "./Chat.css";
import { db, storage } from "./firebase";
import logo from "./logo.png";
import firebase from "firebase";
import load from "./Eclipse-1s-200px.svg";

function Chat() {
  const history = useHistory();
  const [{ user, email }, dispatch] = useStateValue();
  const [msg, setMsg] = useState("");
  const [img, setImg] = useState(null);
  const [date, setDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [fullImg, setFullImg] = useState("");

  useEffect(() => {
    setLoading(true);
    db.collection("messages")
      .orderBy("time", "asc")
      .onSnapshot((snap) => {
        setData(
          snap?.docs.map((doc) => ({
            data: doc.data(),
          }))
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let main = document.getElementById("main");
    window.scrollBy(0, 90000000000);
  });

  const zoomImage = (imgUrl) => {
    if (!zoom) {
      setFullImg(imgUrl);
      setZoom(true);
    } else {
      setFullImg("");
      setZoom(false);
    }
  };

  const send = async () => {
    const dt = await new Date().toLocaleString();
    await setDate(dt);
    if (!img && msg == "") {
      console.log("");
    } else {
      if (img) {
        const up = storage.ref(`/users/${user?.email}/msg/${img.name}`);
        up.put(img).then((snap) => {
          up.getDownloadURL().then((url) => {
            db.collection("messages")
              .add({
                name: user?.name,
                email: user?.email,
                msg,
                img: url,
                date,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                photo: user?.photo,
              })
              .then(() => {
                db.collection("users")
                  .doc(user?.email)
                  .collection("posts")
                  .add({
                    img: url,
                    date,
                    time: firebase.firestore.FieldValue.serverTimestamp(),
                  });
                setMsg("");
                setImg(null);
              });
          });
        });
      } else {
        db.collection("messages")
          .add({
            name: user?.name,
            email: user?.email,
            msg,
            img: null,
            date,
            time: firebase.firestore.FieldValue.serverTimestamp(),
            photo: user?.photo,
          })
          .then(() => {
            setMsg("");
            setImg(null);
          });
      }
    }
  };

  const myProfile = () => {
    dispatch({
      type: "SET_EMAIL",
      email: user?.email,
    });
    history.push("/profile");
  };

  const userProfile = (em) => {
    dispatch({
      type: "SET_EMAIL",
      email: em,
    });
    history.push("/profile");
  };

  return (
    <div className="chat">
      {zoom && (
        <div onClick={() => zoomImage()} className="zoom">
          <img src={fullImg} alt={fullImg} />
        </div>
      )}
      <div className="c-header">
        <div>
          <img onClick={() => history.push("/src")} src={logo} />
          <p>
            chat<span>room</span>
          </p>
        </div>
        {user?.photo ? (
          <img onClick={() => myProfile()} src={user?.photo} />
        ) : (
          <img
            onClick={() => myProfile()}
            src="https://img.icons8.com/pastel-glyph/96/ffffff/person-male--v2.png"
          />
        )}
      </div>
      <div id="main" className="con">
        {data?.map((d) =>
          d?.data.img == null ? (
            <div className={d.data.email !== user?.email ? "msg left" : "msg"}>
              <div className="m-cont">
                <p
                  className={
                    d.data.email !== user?.email
                      ? "l-mc-name mc-name"
                      : "mc-name"
                  }
                >
                  {d.data.name}
                </p>
                <p
                  className={
                    d.data.email !== user?.email ? "l-msg mc-msg" : "mc-msg"
                  }
                >
                  {d.data.msg}
                </p>
                <p
                  className={
                    d.data.email !== user?.email
                      ? "l-mc-time mc-time"
                      : "mc-time"
                  }
                >
                  {d.data.date}
                </p>
              </div>
              <img
                onClick={() => userProfile(d.data.email)}
                src={d.data.photo}
              />
            </div>
          ) : (
            <div className={d.data.email !== user?.email ? "msg left" : "msg"}>
              <div className="m-cont">
                <p
                  className={
                    d.data.email !== user?.email
                      ? "l-mc-name mc-name"
                      : "mc-name"
                  }
                >
                  {d.data.name}
                </p>
                <div
                  className={
                    d.data.email !== user?.email
                      ? "mc-post l-mc-post"
                      : "mc-post"
                  }
                >
                  <img
                    onClick={() => zoomImage(d?.data.img)}
                    src={d?.data.img}
                  />
                  <p>{d?.data.msg}</p>
                </div>
                <p
                  className={
                    d.data.email !== user?.email
                      ? "l-mc-time mc-time"
                      : "mc-time"
                  }
                >
                  {d.data.date}
                </p>
              </div>
              <img
                onClick={() => userProfile(d.data.email)}
                src={d.data.photo}
              />
            </div>
          )
        )}
        {loading && <img className="loading" src={load} />}
      </div>
      <div className="footer">
        <div>
          <img src="https://img.icons8.com/material-outlined/48/0077ff/camera--v2.png" />
          <input
            id="img"
            type="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <input
            type="text"
            value={msg}
            placeholder="Type a message"
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>
        <img
          onClick={() => send()}
          src="https://img.icons8.com/small/64/ffffff/filled-sent.png"
        />
      </div>
    </div>
  );
}

export default Chat;
