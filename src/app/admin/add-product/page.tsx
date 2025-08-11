"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "../../firebase.config";
import {
  addDoc,
  collection as firestoreCollection,
  getDocs,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot,
  doc as firestoreDoc,
} from "firebase/firestore";

const bgMain =
  "bg-gradient-to-b from-green-900 via-black to-black min-h-screen";
const cardBg = "bg-gray-900";
const textMain = "text-white";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("Black");
  const [quantity, setQuantity] = useState([8, 8, 8, 4, 4]);
  const [category, setCategory] = useState("");
  const [id, setId] = useState("");
  // Use unknown[] for userReview if type is not known
  const [userReview] = useState<unknown[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  // Removed unused: collections, setCollections, selectedCollection
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentProducts, setRecentProducts] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch collections from Firestore
    const fetchCollections = async () => {
      await getDocs(firestoreCollection(firestore, "collections"));
      // Removed unused: collections, setCollections, selectedCollection
    };
    fetchCollections();
    // Fetch recent products
    const fetchProducts = async () => {
      const snapshot = await getDocs(
        firestoreCollection(firestore, "products")
      );
      // Sort by createdAt descending, fallback to doc id if missing
      const sorted = snapshot.docs
        .sort((a, b) => {
          const aTime = new Date(a.data().createdAt || 0).getTime();
          const bTime = new Date(b.data().createdAt || 0).getTime();
          return bTime - aTime;
        })
        .slice(0, 10); // last 10
      setRecentProducts(sorted);
    };
    fetchProducts();
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
      // Removed unused: selectedCollection
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
        // Removed unused: collection
        collection: category.trim().toLowerCase() || "", // Assuming category is a string or derived
        userReview,
        quantity,
        color,
        createdAt: new Date().toISOString(),
        id: id || undefined,
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

  // Remove product by doc id
  const handleRemoveProduct = async (docId: string) => {
    setError("");
    setLoading(true);
    try {
      const docRef = firestoreDoc(firestore, "products", docId);
      await deleteDoc(docRef);
      setRecentProducts((prev) => prev.filter((doc) => doc.id !== docId));
      alert("Product removed successfully!");
      setLoading(false);
    } catch (err) {
      setError("Failed to remove product. Check console for details.");
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
            <label className={`block mb-2 ${textMain}`}>Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="e.g. Black"
            />
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>
              Quantity (comma separated for sizes)
            </label>
            <input
              type="text"
              value={quantity.join(",")}
              onChange={(e) =>
                setQuantity(
                  e.target.value.split(",").map((q) => parseInt(q, 10) || 0)
                )
              }
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="e.g. 8,8,8,4,4"
            />
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="e.g. streetwear"
            />
          </div>
          <div>
            <label className={`block mb-2 ${textMain}`}>
              Product ID (optional)
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="e.g. 14"
            />
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
      <div className={`${cardBg} rounded shadow p-8 w-full max-w-lg mt-8`}>
        <h3 className={`text-xl font-bold mb-4 ${textMain}`}>Remove Product</h3>
        <ul className="space-y-2">
          {recentProducts.length === 0 && (
            <li className="text-gray-400">No products found.</li>
          )}
          {recentProducts.map((doc) => {
            const data = doc.data();
            return (
              <li
                key={doc.id}
                className="flex justify-between items-center bg-gray-800 rounded px-4 py-2"
              >
                <div>
                  <div className="text-white font-semibold">
                    {data.title || doc.id}
                  </div>
                  <div className="text-gray-400 text-xs">ID: {doc.id}</div>
                  <div className="text-gray-400 text-xs">
                    Created:{" "}
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleString()
                      : ""}
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded shadow ml-4"
                  onClick={() => handleRemoveProduct(doc.id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
