
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDL0vVpTvwFZHN39ZyyPfK7TfpshRDT9r4",
    authDomain: "future-79d95.firebaseapp.com",
    projectId: "future-79d95",
    storageBucket: "future-79d95.appspot.com",
    messagingSenderId: "767294776102",
    appId: "1:767294776102:web:0c2c33bb2b245dfc33d7e7",
    measurementId: "G-42B48ZGYVG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, analytics, auth };