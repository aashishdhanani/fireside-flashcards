// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkg7le0c4XwXTIhM7keKFUFgzq7nV1Iv0",
  authDomain: "fireside-flashcards.firebaseapp.com",
  projectId: "fireside-flashcards",
  storageBucket: "fireside-flashcards.appspot.com",
  messagingSenderId: "261446624654",
  appId: "1:261446624654:web:718eefe720e5649e1d30df",
  measurementId: "G-XCZPES22HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);