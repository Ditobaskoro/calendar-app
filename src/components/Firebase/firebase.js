import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCglYh20kUUIQZBIJ8PJSQwKboc1r7j9yc",
  authDomain: "calendar-app-52e1d.firebaseapp.com",
  databaseURL: "https://calendar-app-52e1d.firebaseio.com",
  projectId: "calendar-app-52e1d",
  storageBucket: "calendar-app-52e1d.appspot.com",
  messagingSenderId: "52433816892"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }
}

export default Firebase;