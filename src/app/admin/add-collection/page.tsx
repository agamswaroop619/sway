"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { firestore, storage } from "../../firebase.config";
import { addDoc, collection as firestoreCollection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const bgMain =
  "bg-gradient-to-b from-green-900 via-black to-black min-h-screen";
const cardBg = "bg-gray-900";
const textMain = "text-white";
const textSecondary = "text-gray-300";

export default function AddCollectionPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || images.length === 0) {
      alert("Please fill all fields and select at least one image.");
      return;
    }
    try {
      // 1. Upload images to Firebase Storage
      const imageUrls: string[] = [];
      for (const file of images) {
        const storageRef = ref(
          storage,
          `collections/${name}/${file.name}_${Date.now()}`
        );
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      // 2. Add collection to Firestore
      await addDoc(firestoreCollection(firestore, "collections"), {
        name,
        description,
        images: imageUrls,
        createdAt: new Date().toISOString(),
      });
      alert("Collection added successfully!");
      router.push("/admin");
    } catch (err) {
      alert("Failed to add collection. Check console for details.");
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
          <div>
            <label className={`block mb-2 ${textMain}`}>
              Collection Images
            </label>
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
            Add Collection
          </button>
        </form>
      </div>
    </div>
  );
}
