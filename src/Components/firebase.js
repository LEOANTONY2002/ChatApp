import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC7vA-X5vzg5Fe2TlEzUKhByb56HlXtU34",
  authDomain: "tiktok-clone-13354.firebaseapp.com",
  databaseURL: "https://tiktok-clone-13354.firebaseio.com",
  projectId: "tiktok-clone-13354",
  storageBucket: "tiktok-clone-13354.appspot.com",
  messagingSenderId: "818877100537",
  appId: "1:818877100537:web:d27ff15456939b45324d28",
  measurementId: "G-SXTT1J5EP3",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
