import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Loader, FileText, Plus, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  isPublic: boolean;
  userId: string;
  createdAt: any;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", folderId: "", isPublic: false });
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const foldersQuery = query(
        collection(db, "folders"),
        where("userId", "==", user.uid)
      );

      const unsubscribeNotes = onSnapshot(notesQuery, 
        (snapshot) => {
          const newNotes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Note[];
          setNotes(newNotes);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching notes:", error);
          setError("Failed to load notes. Please try again later.");
          setLoading(false);
        }
      );

      const unsubscribeFolders = onSnapshot(foldersQuery,
        (snapshot) => {
          const newFolders = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));
          setFolders(newFolders);
        },
        (error) => {
          console.error("Error fetching folders:", error);
          setError("Failed to load folders. Please try again later.");
        }
      );

      return () => {
        unsubscribeNotes();
        unsubscribeFolders();
      };
    }
  }, []);

  const handleAddNote = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "notes"), {
          ...newNote,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        setNewNote({ title: "", content: "", folderId: "", isPublic: false });
      }
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again.");
    }
  };

  const handleUpdateNote = async (noteId: string, isPublic: boolean) => {
    try {
      await updateDoc(doc(db, "notes", noteId), { isPublic });
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const noteRef = doc(db, "notes", noteId);
      const noteSnap = await getDoc(noteRef);
      if (!noteSnap.exists()) {
        throw new Error("Note not found");
      }
      const noteData = noteSnap.data();
      if (noteData?.userId !== user.uid) {
        throw new Error("You don't have permission to delete this note");
      }
      await deleteDoc(noteRef);
    } catch (error) {
      console.error("Error deleting note:", error);
      setError(`Failed to delete note: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="notes p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Notes</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          placeholder="Note Title"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          placeholder="Note Content"
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          value={newNote.folderId}
          onChange={(e) => setNewNote({ ...newNote, folderId: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select Folder</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddNote}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Note
        </button>
      </div>
      <div>
        {notes.map((note) => (
          <div key={note.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FileText size={24} className="text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold">{note.title}</h2>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-2">{note.content}</p>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={note.isPublic}
                onChange={(e) => handleUpdateNote(note.id, e.target.checked)}
                className="mr-2"
              />
              <span>Public</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;