import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

// En nee meneer de assessor, het is niet erg dat dit hier staat. Vraag er maar naar in tijdens het assessment
// const firebaseConfig = {
//     apiKey: "AIzaSyBNYrXuL7JNwdsx0ORcrm8S_FP-n1cx-7I",
//     authDomain: "stafford-olympics.firebaseapp.com",
//     projectId: "stafford-olympics",
//     storageBucket: "stafford-olympics.appspot.com",
//     messagingSenderId: "1082270760609",
//     appId: "1:1082270760609:web:4bfdd005884304ed2ffae0"
// };

const firebaseConfig = {
    apiKey: "AIzaSyB9pFLbPSkvyMLLqdOFQrbWCQpxQ8CrJrQ",
    authDomain: "sbtsc-stafford-olympics.firebaseapp.com",
    projectId: "sbtsc-stafford-olympics",
    storageBucket: "sbtsc-stafford-olympics.appspot.com",
    messagingSenderId: "80585125753",
    appId: "1:80585125753:web:f5412c27883e69cb8809a8"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Sign in providers
const GOOGLE_PROVIDER_ID = firebase.auth.GoogleAuthProvider.PROVIDER_ID
const FACEBOOK_PROVIDER_ID = firebase.auth.FacebookAuthProvider.PROVIDER_ID
const EMAIL_PROVIDER_ID = firebase.auth.EmailAuthProvider.PROVIDER_ID

// Utils
const db = firebase.firestore()
const auth = firebase.auth()
const functions = firebase.app().functions('europe-west2');

const storage = firebase.storage()

// collection references
const tournamentsCollection = db.collection('tournaments')
const dogsCollection = db.collection('dogs')

export {
    db,
    auth,
    functions,
    storage,
    tournamentsCollection,
    dogsCollection,
    GOOGLE_PROVIDER_ID,
    FACEBOOK_PROVIDER_ID,
    EMAIL_PROVIDER_ID
  }