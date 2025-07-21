"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { firestore, storage } from "../../firebase.config";
import {
  addDoc,
  collection as firestoreCollection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const bgMain =
  "bg-gradient-to-b from-green-900 via-black to-black min-h-screen";
const cardBg = "bg-gray-900";
const textMain = "text-white";
const textSecondary = "text-gray-300";

export default function AddCollectionPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch all collections from the 'collections' table
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      const snapshot = await getDocs(
        firestoreCollection(firestore, "collections")
      );
      setCollections(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    };
    fetchCollections();
  }, []);

  // Check for duplicate name
  const isDuplicateName = collections.some(
    (col) => col.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !description) {
      setError("Please fill all fields.");
      return;
    }
    if (isDuplicateName) {
      setError("Collection name already exists.");
      return;
    }
    try {
      await addDoc(firestoreCollection(firestore, "collections"), {
        name,
        description,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setDescription("");
      // Refresh collections
      const snapshot = await getDocs(
        firestoreCollection(firestore, "collections")
      );
      setCollections(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setError("");
    } catch (err) {
      setError("Failed to add collection. Check console for details.");
      console.error(err);
    }
  };

  // Remove all products in a collection and remove the collection doc if it exists
  const handleDelete = async (colName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete all products in the '${colName}' collection?`
      )
    )
      return;
    setError("");
    try {
      // Delete all products in this collection
      const q = query(
        firestoreCollection(firestore, "products"),
        where("collection", "==", colName)
      );
      const snapshot = await getDocs(q);
      const batch = (await import("firebase/firestore")).writeBatch(firestore);
      snapshot.forEach((docSnap) => {
        batch.delete(doc(firestore, "products", docSnap.id));
      });
      await batch.commit();
      // Remove from collections collection if exists
      const colSnapshot = await getDocs(
        query(
          firestoreCollection(firestore, "collections"),
          where("name", "==", colName)
        )
      );
      colSnapshot.forEach((docSnap) => {
        deleteDoc(doc(firestore, "collections", docSnap.id));
      });
      // Refresh collections
      const allCollections = await getDocs(
        firestoreCollection(firestore, "collections")
      );
      setCollections(
        allCollections.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err) {
      setError("Failed to delete collection. Check console for details.");
      console.error(err);
    }
  };

  return (
    <div
      className={`${bgMain} p-8 flex flex-col items-center justify-center min-h-screen`}
    >
      <div className={`${cardBg} rounded shadow p-8 w-full max-w-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textMain}`}>
            Add New Collection
          </h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow ml-4"
            onClick={() => router.push("/admin")}
          >
            ← Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className={`block mb-2 ${textMain}`}>Collection Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="e.g. Streetwear"
            />
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Describe this collection..."
              rows={3}
            />
          </div>
          {error && <div className="text-red-400 font-semibold">{error}</div>}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow mt-4"
            disabled={isDuplicateName}
          >
            Add Collection
          </button>
        </form>
      </div>
      <div className={`${cardBg} rounded shadow p-8 w-full max-w-lg mt-8`}>
        <h3 className={`text-xl font-bold mb-4 ${textMain}`}>
          All Collections
        </h3>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : collections.length === 0 ? (
          <div className="text-gray-400">No collections found.</div>
        ) : (
          <ul className="space-y-4">
            {collections.map((col) => (
              <li
                key={col.id}
                className="flex justify-between items-center bg-gray-800 rounded px-4 py-2 cursor-pointer hover:bg-green-900 transition"
                onClick={() =>
                  router.push(
                    `/products?collection=${encodeURIComponent(col.name)}`
                  )
                }
              >
                <div>
                  <div className="text-white font-semibold">{col.name}</div>
                  <div className="text-gray-400 text-sm">{col.description}</div>
                </div>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded shadow ml-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(col.name);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
