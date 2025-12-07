import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCaEH4E4IufRCunPehBqYZm619JBZ_pEiE",
    authDomain: "localbazaar-pro.firebaseapp.com",
    projectId: "localbazaar-pro",
    storageBucket: "localbazaar-pro.firebasestorage.app",
    messagingSenderId: "1052145790840",
    appId: "1:1052145790840:web:f26e1bb99c6c5b29af228d",
    measurementId: "G-0CPFNRDL4P"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
} else {
    console.log('✅ Firebase already initialized');
}

export const auth = firebase.auth();
console.log('✅ Auth instance created');

export default firebase.app();
