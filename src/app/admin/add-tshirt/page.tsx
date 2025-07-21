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
const textSecondary = "text-gray-300";

export default function AddTShirtPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
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

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "__add_new__") {
      // This state is no longer needed for the dropdown, but keeping it for now
      // as it might be used elsewhere or for future features.
      // setAddingNewCollection(true);
      setSelectedCollection("");
    } else {
      // setAddingNewCollection(false); // This state is no longer needed
      setSelectedCollection(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !price ||
      !selectedCollection ||
      images.length === 0
    ) {
      alert("Please fill all fields and select at least one image.");
      return;
    }
    try {
      const imageUrls: string[] = [];
      for (const file of images) {
        const storageRef = ref(
          storage,
          `tshirts/${name}/${file.name}_${Date.now()}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      await addDoc(firestoreCollection(firestore, "products"), {
        name,
        description,
        price: parseFloat(price),
        images: imageUrls,
        collection:
          collections.find((col) => col.id === selectedCollection)?.name || "",
        collectionId: selectedCollection,
        createdAt: new Date().toISOString(),
      });
      alert("Product added successfully!");
      router.push("/admin");
    } catch (err) {
      alert("Failed to add Product. Check console for details.");
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
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
            {selectedCollection && (
              <div className="mt-2 text-green-400 font-semibold">
                Current Collection:{" "}
                {collections.find((col) => col.id === selectedCollection)?.name}
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
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow mt-4"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
