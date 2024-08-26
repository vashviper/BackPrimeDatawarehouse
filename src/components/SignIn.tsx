import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const createDefaultFolders = async (userId: string) => {
    const defaultFolders = [
      { name: "Ideas", description: "Store your creative ideas here" },
      { name: "Tasks", description: "Keep track of your to-do list" },
      { name: "Journal", description: "Write your daily thoughts and reflections" },
    ];

    for (const folder of defaultFolders) {
      await addDoc(collection(db, "folders"), {
        ...folder,
        userId,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user is new
      const userFoldersQuery = query(
        collection(db, "folders"),
        where("userId", "==", user.uid)
      );
      const userFoldersSnapshot = await getDocs(userFoldersQuery);

      if (userFoldersSnapshot.empty) {
        await createDefaultFolders(user.uid);
      }

      navigate("/notes");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="sign-in p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Sign In</h2>
      <button
        onClick={handleGoogleSignIn}
        className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow flex items-center hover:bg-gray-100"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
          className="w-6 h-6 mr-2"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;