import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, orderBy, onSnapshot, limit, startAfter, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Loader } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
}

const NOTES_PER_PAGE = 10;

const FolderNotes: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && folderId) {
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        where("folderId", "==", folderId),
        orderBy("createdAt", "desc"),
        limit(NOTES_PER_PAGE)
      );

      const unsubscribe = onSnapshot(
        notesQuery,
        (snapshot) => {
          const newNotes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Note[];
          setNotes(newNotes);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching notes:", error);
          setError("Failed to load notes. Please try again later.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [folderId]);

  const loadMoreNotes = async () => {
    if (!lastVisible || !folderId) return;

    setLoadingMore(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const nextQuery = query(
          collection(db, "notes"),
          where("userId", "==", user.uid),
          where("folderId", "==", folderId),
          orderBy("createdAt", "desc"),
          startAfter(lastVisible),
          limit(NOTES_PER_PAGE)
        );

        const snapshot = await getDocs(nextQuery);
        const newNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];

        setNotes((prevNotes) => [...prevNotes, ...newNotes]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error loading more notes:", error);
      setError("Failed to load more notes. Please try again.");
    } finally {
      setLoadingMore(false);
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
    <div className="folder-notes p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-800">Folder Notes</h1>
      <div>
        {notes.map((note) => (
          <div key={note.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
            <p className="text-gray-600 mb-2">{note.content}</p>
            <div className="flex items-center">
              <span className={`text-sm ${note.isPublic ? "text-green-600" : "text-red-600"}`}>
                {note.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
        ))}
      </div>
      {lastVisible && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreNotes}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FolderNotes;