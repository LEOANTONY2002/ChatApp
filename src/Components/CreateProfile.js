import React, { useEffect, useState } from "react";
import { useStateValue } from "../StateProvider";
import { db, storage } from "./firebase";
import load from "./Eclipse-1s-200px.svg";
import { useHistory } from "react-router-dom";

function CreateProfile() {
  const [photo, setPhoto] = useState(
    "https://img.icons8.com/pastel-glyph/96/006eff/person-male--v2.png"
  );
  const [img, setImg] = useState(null);
  const [{ email }, dispatch] = useStateValue();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const showImage = (photo) => {
    var fr = new FileReader();
    fr.readAsDataURL(photo);
    fr.onload = () => {
      setPhoto(fr.result);
    };
  };

  const upload = () => {
    setLoading(true);
    const up = storage.ref(`/users/${email}/profile/${img.name}`);
    up.put(img).then((snap) => {
      up.getDownloadURL().then((url) => {
        db.collection("users")
          .doc(email)
          .set({
            name,
            email,
            bio,
            photo: url,
          })
          .then(() => {
            db.collection("users")
              .doc(email)
              .get()
              .then((d) => {
                dispatch({
                  type: "SET_USER",
                  user: d.data(),
                });
              });
            setLoading(false);
            history.push("/chat");
          });
      });
    });
  };

  return (
    <div className="create">
      <div id="con">
        <div id="imgCon" style={{ backgroundImage: `url("${photo}")` }}>
          <img src="https://img.icons8.com/material-outlined/48/006eff/camera--v2.png" />
          <input
            id="photo"
            type="file"
            onChange={(e) => {
              setImg(e.target.files[0]);
              showImage(e.target.files[0]);
            }}
          />
        </div>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Bio" onChange={(e) => setBio(e.target.value)} />
        {loading && <img src={load} className="loading" />}
        <button onClick={() => upload()}>Upload</button>
      </div>
    </div>
  );
}

export default CreateProfile;
