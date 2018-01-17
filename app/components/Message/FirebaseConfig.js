import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAY7NqvrzautVSaa2zYB6RT6JqInW6cjes",
  authDomain: "angularjs-chat-3c276.firebaseapp.com",
  databaseURL: "https://angularjs-chat-3c276.firebaseio.com",
  storageBucket: 'angularjs-chat-3c276.appspot.com',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;