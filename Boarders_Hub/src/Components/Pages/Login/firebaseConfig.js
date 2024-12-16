// Import the functions you need from the SDKs you need
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, query, where, doc, setDoc, updateDoc, getDoc, addDoc, collection, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";

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
              userID: user.uid,
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

// Fetch all listings from Firestore
const fetchListings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "listings"));
    const listings = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
      const roomData = docSnap.data();
      const ownerId = roomData.ownerId;

      // Check if ownerId exists
      if (!ownerId) {
        console.error("Owner ID is missing for listing:", docSnap.id);
        return null; // Skip this listing if ownerId is missing
      }

      // Fetch owner data
      const ownerRef = doc(db, "users", ownerId);
      const ownerDoc = await getDoc(ownerRef);

      // Safeguard in case owner document doesn't exist
      const ownerData = ownerDoc.exists() ? ownerDoc.data() : {};

      return {
        id: docSnap.id,
        ...roomData,
        owner: ownerData, // Include owner data in room
      };
    }));

    // Filter out any null listings (those that failed due to missing ownerId)
    return listings.filter((listing) => listing !== null);
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw new Error("Failed to fetch listings");
  }
};

const fetchSavedRooms = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const savedRoomRefs = userData.savedRooms || []; // Get saved room references

      // Fetch the actual listings based on the references
      const savedRooms = await Promise.all(
        savedRoomRefs.map(async (roomRef) => {
          const roomDocSnap = await getDoc(roomRef); // Resolve the reference
          if (roomDocSnap.exists()) {
            return {
              id: roomDocSnap.id,
              ...roomDocSnap.data(),
            };
          } else {
            return null; // Handle case where room reference doesn't exist
          }
        })
      );

      // Filter out null results (if any references were invalid or deleted)
      return savedRooms.filter((room) => room !== null);
    }
  } catch (error) {
    console.error("Error fetching saved rooms:", error);
    throw new Error("Failed to fetch saved rooms");
  }
};

const fetchSavedListings = async (savedRoomRefs) => {
  try {
    const matchingListings = await Promise.all(
      savedRoomRefs.map(async (roomRef) => {
        const roomDocSnap = await getDoc(roomRef); // Dereference and fetch room data
        if (roomDocSnap.exists()) {
          return {
            id: roomDocSnap.id,
            ...roomDocSnap.data(),
          };
        } else {
          return null; // Handle missing rooms
        }
      })
    );

    // Filter out null values (invalid or deleted rooms)
    return matchingListings.filter((room) => room !== null);
  } catch (error) {
    console.error("Error fetching saved listings:", error);
    throw new Error("Failed to fetch saved listings");
  }
};

// Function to remove a room from the savedRooms array in the user's document
const handleRemoveRoom = async (userId, roomId) => {
  try {
    // Get the path of the room listing in the "listings" collection
    const roomRef = doc(db, "listings", roomId);  // Path like /listings/{roomId}

    // Get the reference to the user's document
    const userDocRef = doc(db, "users", userId);

    // Remove the room reference from the savedRooms array in the user's document
    await setDoc(
      userDocRef,
      {
        savedRooms: arrayRemove(roomRef), // Remove the room reference from savedRooms
      },
      { merge: true } // Merge to avoid overwriting other fields
    );

    console.log("Room removed from saved rooms.");
  } catch (error) {
    console.error("Error removing room:", error);
    throw new Error("Failed to remove room from saved rooms");
  }
};

// Function to add a rent request to a listing (under an array in the listing document)
const addRentRequest = async (listingId, userId) => {
  try {
    // Reference the specific listing document in the Firestore "listings" collection
    const listingRef = doc(db, "listings", listingId);

    // Fetch the current listing document
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      throw new Error("Listing not found");
    }

    // Get the existing requests array from the listing document
    const listingData = listingSnap.data();
    const existingRequests = listingData.requests || [];

    // Check if the user has already made a request
    const userHasRequested = existingRequests.some(
      (request) => request.requestBy === userId
    );

    if (userHasRequested) {
      console.warn("User has already made a rent request for this listing.");
      throw new Error("You have already requested to rent this room.");
    }

    // Create a new rent request entry
    const newRequest = {
      requestBy: userId,
      requestDate: new Date().toISOString(),
      requestStatus: "Pending",
    };

    // Use arrayUnion to add the new request to the "requests" array in the listing document
    await updateDoc(listingRef, {
      requests: arrayUnion(newRequest), // Add the new request to the array
    });

    console.log("Rent request added successfully!");
  } catch (error) {
    console.error("Error adding rent request:", error);
    throw error; // Pass the error back for handling in the UI
  }
};

// Function to handle approval of a rent request for a listing
const handleApproveRequest = async (listingId, userId, requestId) => {
  try {
    const listingRef = doc(db, "listings", listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      throw new Error("Listing not found");
    }

    const listingData = listingSnap.data();
    const requests = listingData.requests || [];

    // Log the structure of the requests data
    console.log("Requests data structure:", requests);

    let requestFound = false;
    const updatedRequests = requests.map((request) => {
      // If this is the request we want to approve, set it to "Approved"
      if (request.requestBy === userId && request.requestDate === requestId) {
        requestFound = true;
        return { ...request, requestStatus: "Approved" };
      }
      // For all other requests, set the status to "Rejected"
      return { ...request, requestStatus: "Rejected" };
    });

    if (!requestFound) {
      throw new Error("Request not found in this room listing");
    }

    // Update the listing's tenantId and status to "Occupied"
    await updateDoc(listingRef, {
      requests: updatedRequests,  // Update the requests array
      tenantId: userId,          // Set tenantId to the userId of the approved request
      status: "Occupied",        // Set the listing status to "Occupied"
    });

    console.log("Request approved successfully, all other requests marked as Rejected.");
    alert("Request approved successfully.");
  } catch (error) {
    console.error("Error approving request:", error);
    throw error;
  }
};

// Export in other files
export { auth, db, query, where, doc, setDoc, updateDoc, getDoc, addDoc, collection, getDocs, arrayUnion,
  handleLogout, 
  redirectToHomeIfLoggedIn, 
  redirectToLoginIfLoggedOut,
  uploadProfilePicture, 
  useUserProfile,
  uploadListingImages,
  addListingToFirestore,
  fetchListings,
  fetchSavedRooms,
  fetchSavedListings,
  handleRemoveRoom,
  addRentRequest,
  handleApproveRequest
};
