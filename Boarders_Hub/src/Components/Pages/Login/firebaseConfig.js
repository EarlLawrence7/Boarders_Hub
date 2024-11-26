// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ5DJa9tbN8KhWcqlamEUdfMxV5CSOjDI",
  authDomain: "boarders-hub.firebaseapp.com",
  projectId: "boarders-hub",
  storageBucket: "boarders-hub.firebasestorage.app",
  messagingSenderId: "999698848137",
  appId: "1:999698848137:web:fb94b48b08b109db09a958",
  measurementId: "G-0R65WKBM4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app);

const getUserProfile = async (uid) => {
  const q = query(collection(db, 'users'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length ? querySnapshot.docs[0].data() : null;
};

const uploadProfilePicture = async (file, uid) => {
  const fileRef = ref(storage, `profilePictures/${uid}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

// Export auth and db for use in other files
export { auth, db, uploadProfilePicture, getUserProfile };
