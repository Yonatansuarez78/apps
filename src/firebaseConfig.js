// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUX1NRWngTwYELe28J4Rq9jeIXBtEfGgg",
    authDomain: "apps-bf0d8.firebaseapp.com",
    projectId: "apps-bf0d8",
    storageBucket: "apps-bf0d8.appspot.com",
    messagingSenderId: "320086164044",
    appId: "1:320086164044:web:b6c6ba673035acda7eeae9",
    measurementId: "G-KH5SC46449"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; // Exporta lo que necesites
