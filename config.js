import firebase from 'firebase'
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyDLOHCz6p2j_K7zCSrISzrLMNIqpYXsgPU",
    authDomain: "barter-system-540c6.firebaseapp.com",
    projectId: "barter-system-540c6",
    storageBucket: "barter-system-540c6.appspot.com",
    messagingSenderId: "329132836203",
    appId: "1:329132836203:web:cfdf65a5d728d2f576382e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();