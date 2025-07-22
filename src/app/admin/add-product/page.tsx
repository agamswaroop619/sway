"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firestore, storage } from "../../firebase.config";
import {
  addDoc,
  collection as firestoreCollection,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const bgMain =
  "bg-gradient-to-b from-green-900 via-black to-black min-h-screen";
const cardBg = "bg-gray-900";
const textMain = "text-white";

// Helper function for uploading an image via the server-side API
async function uploadImageViaApi(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload-product", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to upload image");
  }
  const data = await res.json();
  return data.url;
}

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [collections, setCollections] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch collections from Firestore
    const fetchCollections = async () => {
      const snapshot = await getDocs(
        firestoreCollection(firestore, "collections")
      );
      setCollections(
        snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }))
      );
    };
    fetchCollections();
  }, []);

  const handleImageUrlChange = (idx: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[idx] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => setImageUrls([...imageUrls, ""]);
  const removeImageUrlField = (idx: number) =>
    setImageUrls(imageUrls.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (
      !name ||
      !description ||
      !price ||
      !selectedCollection ||
      imageUrls.filter((url) => url.trim() !== "").length === 0
    ) {
      setError("Please fill all fields and enter at least one image URL.");
      setLoading(false);
      return;
    }
    try {
      const imageObjs = imageUrls
        .filter((url) => url.trim() !== "")
        .map((url, idx) => ({ url, imgId: idx + 1 }));
      await addDoc(firestoreCollection(firestore, "products"), {
        title: name,
        description,
        price: parseInt(price, 10),
        images: imageObjs,
        descImg: imageObjs[0]?.url || "",
        collection: selectedCollection,
        category: [selectedCollection],
        review: 0,
        userReview: [],
        quantity: [8, 8, 8, 4, 4], // default stock for sizes
        color: "Black", // default color, can be updated to a field
        createdAt: new Date().toISOString(),
      });
      alert("Product added successfully!");
      setLoading(false);
      router.push("/admin");
    } catch (err) {
      setError("Failed to add Product. Check console for details.");
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div
      className={`${bgMain} p-8 flex flex-col items-center justify-center min-h-screen`}
    >
      <div className={`${cardBg} rounded shadow p-8 w-full max-w-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textMain}`}>Add New Product</h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow ml-4"
            onClick={() => router.push("/admin")}
          >
            ← Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className={`block mb-2 ${textMain}`}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="e.g. Brainfood"
            />
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Describe this product..."
              rows={3}
            />
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>Price (INR)</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => {
                // Only allow numbers (no decimals, no negative)
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setPrice(value);
                }
              }}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="e.g. 499"
            />
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>Collection</label>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select a collection</option>
              {collections.map((col) => (
                <option key={col.id} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
            {selectedCollection && (
              <div className="mt-2 text-green-400 font-semibold">
                Current Collection: {selectedCollection}
              </div>
            )}
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>
              Product Image URLs
            </label>
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  placeholder="https://your-cdn.com/image.jpg"
                  className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageUrlField(idx)}
                    className="text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageUrlField}
              className="mt-2 text-green-400"
            >
              Add another image
            </button>
          </div>
          {error && <div className="text-red-400 font-semibold">{error}</div>}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow mt-4"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
