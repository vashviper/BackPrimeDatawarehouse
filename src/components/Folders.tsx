import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Loader, Folder, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Folder {
  id: string;
  name: string;
  description: string;
  userId: string;
}

const Folders: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolder, setNewFolder] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const foldersQuery = query(
        collection(db, "folders"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(foldersQuery,
        (snapshot) => {
          const newFolders = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Folder[];
          setFolders(newFolders);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching folders:", error);
          setError("Failed to load folders. Please try again later.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, []);

  const handleAddFolder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      if (!newFolder.name.trim()) {
        throw new Error("Folder name cannot be empty");
      }
      await addDoc(collection(db, "folders"), {
        ...newFolder,
        userId: user.uid,
      });
      setNewFolder({ name: "", description: "" });
    } catch (error) {
      console.error("Error adding folder:", error);
      setError(`Failed to add folder: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleUpdateFolder = async (folderId: string, name: string, description: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      await updateDoc(doc(db, "folders", folderId), { name, description });
    } catch (error) {
      console.error("Error updating folder:", error);
      setError(`Failed to update folder: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      await deleteDoc(doc(db, "folders", folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
      setError(`Failed to delete folder: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div className="folders p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Folders</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <input
          type="text"
          value={newFolder.name}
          onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
          placeholder="Folder Name"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={newFolder.description}
          onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
          placeholder="Folder Description"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddFolder}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Folder
        </button>
      </div>
      <div>
        {folders.map((folder) => (
          <div key={folder.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <Link to={`/folders/${folder.id}`} className="flex items-center">
                <Folder size={24} className="text-purple-600 mr-2" />
                <input
                  type="text"
                  value={folder.name}
                  onChange={(e) => handleUpdateFolder(folder.id, e.target.value, folder.description)}
                  className="text-xl font-semibold w-full p-2 border rounded"
                />
              </Link>
              <button
                onClick={() => handleDeleteFolder(folder.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <textarea
              value={folder.description}
              onChange={(e) => handleUpdateFolder(folder.id, folder.name, e.target.value)}
              className="text-gray-600 w-full p-2 border rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Folders;