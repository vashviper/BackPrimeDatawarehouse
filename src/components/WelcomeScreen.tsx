import React from "react";
import SignIn from "./SignIn";

const WelcomeScreen: React.FC = () => (
  <div className="welcome-screen p-8 max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold mb-4 text-purple-800">Welcome to SimpleNote</h1>
    <p className="mb-4 text-gray-700">
      SimpleNote is a simple note-taking app that allows you to organize your thoughts, ideas, and tasks into folders.
    </p>
    <h2 className="text-2xl font-semibold mb-2 text-purple-700">Features:</h2>
    <ul className="list-disc list-inside mb-4 text-gray-700">
      <li>Create and organize notes in folders</li>
      <li>Edit folder names and descriptions</li>
      <li>Make notes public or keep them private</li>
      <li>View a feed of public notes from all users</li>
    </ul>
    <div className="mb-4">
      <img
        src="/public/app.png"
        alt="NoteNest App Screenshot"
        className="rounded-lg shadow-md"
      />
    </div>
    <SignIn />
  </div>
);

export default WelcomeScreen;