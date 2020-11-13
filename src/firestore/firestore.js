import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB4JhnltUUjcfFCXck8ef6jwWG1ahxxrH8",
    authDomain: "roomservice-20b7a.firebaseapp.com",
    databaseURL: "https://roomservice-20b7a.firebaseio.com",
    projectId: "roomservice-20b7a",
    storageBucket: "roomservice-20b7a.appspot.com",
    messagingSenderId: "261583790232",
    appId: "1:261583790232:web:dc72fe47b239a928b730ed",
    measurementId: "G-L836LGMZ68"
};

firebase.initializeApp(firebaseConfig);
export const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");

export const fstore = firebase.firestore();
export const fauth = firebase.auth();




