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

export default function AddTShirtPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (
      !name ||
      !description ||
      !price ||
      !selectedCollection ||
      images.length === 0
    ) {
      setError("Please fill all fields and select at least one image.");
      setLoading(false);
      return;
    }
    try {
      const imageObjs: { url: string; imgId: number }[] = [];
      let descImg = "";
      // Sanitize product name for storage path
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, "_");
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const storageRef = ref(
          storage,
          `tshirts/${safeName}/${file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
          )}_${Date.now()}`
        );
        try {
          console.log(
            "Uploading file:",
            file.name,
            "to path:",
            storageRef.fullPath
          );
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          console.log("Upload success. Download URL:", url);
          imageObjs.push({ url, imgId: i + 1 });
          if (i === 0) descImg = url;
        } catch (err) {
          console.error("Failed to upload or get URL for", file.name, err);
          setError(`Failed to upload image: ${file.name}`);
          setLoading(false);
          return;
        }
      }
      await addDoc(firestoreCollection(firestore, "products"), {
        title: name,
        description,
        price: parseInt(price, 10),
        images: imageObjs,
        descImg,
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
            <label className={`block mb-2 ${textMain}`}>Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-white"
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="rounded shadow max-h-32 border border-gray-700"
                />
              ))}
            </div>
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
