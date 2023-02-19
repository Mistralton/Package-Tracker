import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDeBTPJ3fxu-I0p6yP3zs8okTPgKGfr0g4",
  authDomain: "pack-track-e8cf0.firebaseapp.com",
  projectId: "pack-track-e8cf0",
  storageBucket: "pack-track-e8cf0.appspot.com",
  messagingSenderId: "44907698940",
  appId: "1:44907698940:web:6d2e453b9376736b679579"
};


export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
export const labelsRef = collection(db, 'labels');