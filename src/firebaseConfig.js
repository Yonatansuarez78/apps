import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importa Firestore

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCUX1NRWngTwYELe28J4Rq9jeIXBtEfGgg",
    authDomain: "apps-bf0d8.firebaseapp.com",
    projectId: "apps-bf0d8",
    storageBucket: "apps-bf0d8.appspot.com",
    messagingSenderId: "320086164044",
    appId: "1:320086164044:web:b6c6ba673035acda7eeae9",
    measurementId: "G-KH5SC46449"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Inicializa Firestore

export { app, analytics, db }; // Exporta Firestore
