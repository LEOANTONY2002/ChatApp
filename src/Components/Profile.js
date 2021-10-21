import React, { useEffect, useState } from "react";
import { useStateValue } from "../StateProvider";
import { auth, db, storage } from "./firebase";
import load from "./Eclipse-1s-200px.svg";
import { useHistory } from "react-router-dom";

function Profile() {
  const [{ user, email }, dispatch] = useStateValue();
  const [imgData, setImgData] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState(
    "https://img.icons8.com/pastel-glyph/96/006eff/person-male--v2.png"
  );
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [ustatus, setUStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [zoom, setZoom] = useState(false);
  const [fullImg, setFullImg] = useState("");

  const zoomImage = (imgUrl) => {
    if (!zoom) {
      setFullImg(imgUrl);
      setZoom(true);
    } else {
      setFullImg("");
      setZoom(false);
    }
  };

  const showImage = (photo) => {
    var fr = new FileReader();
    fr.readAsDataURL(photo);
    fr.onload = () => {
      setPhoto(fr.result);
    };
  };

  console.log(data);

  useEffect(() => {
    if (user?.email == email) {
      db.collection("users")
        .doc(email)
        .get()
        .then((d) => {
          dispatch({
            type: "SET_USER",
            user: d.data(),
          });
        });
      setName(user?.name);
      setBio(user?.bio);
      setPhoto(user?.photo);
    }
  }, [email, open]);

  useEffect(() => {
    db.collection("users")
      .doc(email)
      .get()
      .then((d) => {
        setData(d.data());
      });

    db.collection("users")
      .doc(email)
      .collection("posts")
      .orderBy("time", "desc")
      .onSnapshot((snap) => {
        setImgData(
          snap?.docs.map((doc) => ({
            data: doc.data(),
          }))
        );
      });

    setUStatus("");
  }, [email, open]);

  const upload = () => {
    setLoading(true);
    if (img) {
      const up = storage.ref(`/users/${user?.email}/profile/${img.name}`);

      up.put(img).then((snap) => {
        up.getDownloadURL().then((url) => {
          db.collection("users")
            .doc(user?.email)
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
                .then((u) => {
                  dispatch({
                    type: "SET_USER",
                    user: u.data(),
                  });
                  setLoading(false);
                  setUStatus("Profile Updated...!");
                });
            });
        });
      });
    } else {
      db.collection("users")
        .doc(user?.email)
        .set({
          name,
          email,
          bio,
          photo,
        })
        .then(() => {
          db.collection("users")
            .doc(email)
            .get()
            .then((u) =>
              dispatch({
                type: "SET_USER",
                user: u.data(),
              })
            );
          setLoading(false);
          setUStatus("Profile Updated...!");
        });
    }
  };

  return (
    <div className="profile">
      {zoom && (
        <div onClick={() => zoomImage()} className="zoom">
          <img src={fullImg} alt={fullImg} />
        </div>
      )}
      <div className="p-head">
        {data?.photo ? (
          <img
            onClick={() => zoomImage(data?.photo)}
            src={data?.photo}
            alt={data.photo}
          />
        ) : (
          <img src="https://img.icons8.com/pastel-glyph/96/ffffff/person-male--v2.png" />
        )}

        <p>{data?.name}</p>
        <span>{data?.bio}</span>
        <div className="line"></div>
      </div>
      {email == user?.email && (
        <div className="p-btns">
          <button onClick={() => setOpen(true)} className="editBtn">
            Edit Profile
          </button>
          <button
            className="logout"
            onClick={() => auth.signOut().then(() => history.push("/"))}
          >
            Logout
          </button>
        </div>
      )}

      <div className="p-body">
        {imgData && (
          <div className="p-imgs">
            {imgData.map((i) => (
              <img onClick={() => zoomImage(i?.data.img)} src={i?.data.img} />
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="modal">
          <div id="con">
            <img
              onClick={() => setOpen(false)}
              src="https://img.icons8.com/ios-glyphs/60/ffffff/macos-close.png"
            />
            <div id="imgCon" style={{ backgroundImage: `url("${photo}")` }}>
              <img src="https://img.icons8.com/material-outlined/48/006eff/camera--v2.png" />
              <input
                id="photo"
                type="file"
                onChange={(e) => {
                  showImage(e.target.files[0]);
                  setImg(e.target.files[0]);
                }}
              />
            </div>
            <input
              value={name}
              contentEditable
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio}
              contentEditable
              placeholder="Bio"
              onChange={(e) => setBio(e.target.value)}
            />

            <p className="ustatus">{ustatus}</p>
            {loading && <img src={load} className="loading" />}
            <button onClick={() => upload()}>Upload</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
