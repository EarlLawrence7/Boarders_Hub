// Import the functions you need from the SDKs you need
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection } from "firebase/firestore";

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

// Fetch user data and handle authentication state
const useUserProfile = (setUserData, navigate) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userDetails = userDoc.data();
            setUserData({
              nickname: userDetails.username || "No Nickname",
              fullName: userDetails.fullName || "No Nickname",
              phone: userDetails.phone || "No Phone",
              email: userDetails.email || "No Email",
              birthday: userDetails.birthDate
                ? `${userDetails.birthDate.month}/${userDetails.birthDate.day}/${userDetails.birthDate.year}`
                : "No Birthday",
              profilePicture: userDetails.profilePicture || "", // Get profile picture from Firestore
            });
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        navigate("/"); // Navigate to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate, setUserData]);
};

// Function to upload profile picture and get its URL from Cloudinary
const uploadProfilePicture = async (file, uid) => {
  try {
    // Upload the file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "boarders_upload_preset"); // Replace with your Cloudinary preset

    // Make the API request to Cloudinary
    const response = await fetch("https://api.cloudinary.com/v1_1/dxbkzby8x/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // Check if the upload was successful and get the URL
    if (data.secure_url) {
      const imageUrl = data.secure_url;

      // Update Firestore with the new profile picture URL
      const userDocRef = doc(db, "users", uid);
      await setDoc(
        userDocRef, 
        { profilePicture: imageUrl },
        { merge: true } // Merge to avoid overwriting other fields
      );

      return imageUrl; // Return the URL to be used for updating user data
    } else {
      throw new Error("Cloudinary upload failed.");
    }
  } catch (error) {
    console.error("Error uploading profile picture to Cloudinary:", error);
    throw new Error("Failed to upload profile picture");
  }
};

// Function to upload multiple listing images to Cloudinary
const uploadListingImages = async (images) => {
  try {
    const cloudinaryUrls = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "boarders_upload_preset");

      const response = await fetch("https://api.cloudinary.com/v1_1/dxbkzby8x/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        cloudinaryUrls.push(data.secure_url);
      } else {
        console.error("Error uploading image:", data);
      }
    }
    return cloudinaryUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Image upload failed");
  }
};

// Function to save listing data to Firestore
const addListingToFirestore = async (listingData) => {
  try {
    // Save listing to Firestore
    const docRef = await addDoc(collection(db, "listings"), {
      ...listingData,
      createdAt: new Date(),
    });
    console.log("Listing added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding listing to Firestore: ", error);
    throw new Error("Failed to add listing");
  }
};

// Export in other files
export { auth, db, 
  handleLogout, 
  redirectToHomeIfLoggedIn, 
  redirectToLoginIfLoggedOut,
  uploadProfilePicture, 
  useUserProfile,
  uploadListingImages,
  addListingToFirestore
};
