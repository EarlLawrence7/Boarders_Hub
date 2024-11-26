// Import the functions you need from the SDKs you need
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
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
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app);

// For Logout or Signing out locally (token) and from Firebase
const handleLogout = async (navigate) => {
  try {
    await signOut(auth); // Sign out from Firebase
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to login page
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// To check if currently logged in and trying to access login/signup: 
//    true->redirect to home, false->stay on login/signup
const redirectToHomeIfLoggedIn = (navigate) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      } 
    });

    return () => unsubscribe();
  }, [navigate]);
};

// To check if user is logged out and trying to access pages other than login/signup:
//    true->stay on the current page, false->redirect to login/signup
const redirectToLoginIfLoggedOut = (navigate) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login page if no user is logged in
        navigate("/login"); // Or navigate("/") if you prefer to use the root route
      }
    });

    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, [navigate]);
};

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

// Export in other files
export { auth, db, 
  handleLogout, 
  redirectToHomeIfLoggedIn, 
  redirectToLoginIfLoggedOut,
  uploadProfilePicture, 
  getUserProfile 
};
