import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDwu3Gg39eEactEiV1BCII9Z0PX5TNBc5M",
    authDomain: "whatsapp-clone-41c1f.firebaseapp.com",
    databaseURL: "https://whatsapp-clone-41c1f.firebaseio.com",
    projectId: "whatsapp-clone-41c1f",
    storageBucket: "whatsapp-clone-41c1f.appspot.com",
    messagingSenderId: "961354714174",
    appId: "1:961354714174:web:64ab8d827407f418b9556f",
    measurementId: "G-Y7T61RC6NP"
};
const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebaseapp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };