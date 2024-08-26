import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home as HomeIcon, FileText, Folder, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const BottomTabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bottom-nav bg-purple-800 text-white p-4 flex justify-around items-center">
      <Link
        to="/"
        className={`text-2xl ${location.pathname === "/" ? "text-purple-300" : ""}`}
      >
        <HomeIcon size={24} />
      </Link>
      <Link
        to="/notes"
        className={`text-2xl ${location.pathname === "/notes" ? "text-purple-300" : ""}`}
      >
        <FileText size={24} />
      </Link>
      <Link
        to="/folders"
        className={`text-2xl ${location.pathname === "/folders" ? "text-purple-300" : ""}`}
      >
        <Folder size={24} />
      </Link>
      <button
        onClick={handleSignOut}
        className="text-2xl text-white hover:text-purple-300"
      >
        <LogOut size={24} />
      </button>
    </nav>
  );
};

export default BottomTabBar;