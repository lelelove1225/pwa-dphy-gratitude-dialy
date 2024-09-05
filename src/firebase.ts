// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp8Pl9YSW8rAf_mNRsKG-FGYFN-anPSdg",
  authDomain: "gratitude-dialy-proto.firebaseapp.com",
  projectId: "gratitude-dialy-proto",
  storageBucket: "gratitude-dialy-proto.appspot.com",
  messagingSenderId: "559102192568",
  appId: "1:559102192568:web:7fcfc80f2ac056ef65bd4d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
