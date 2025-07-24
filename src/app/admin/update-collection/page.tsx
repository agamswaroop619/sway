"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const bgMain =
  "bg-gradient-to-b from-green-900 via-black to-black min-h-screen";
const cardBg = "bg-gray-900";
const textMain = "text-white";

export default function UpdateCollectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an .xlsx file.");
      return;
    }
    setLoading(true);
    // TODO: Implement upload and processing logic
    setTimeout(() => {
      setLoading(false);
      alert("(Demo) File ready for processing: " + file.name);
    }, 1000);
  };

  return (
    <div
      className={`${bgMain} p-8 flex flex-col items-center justify-center min-h-screen`}
    >
      <div className={`${cardBg} rounded shadow p-8 w-full max-w-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textMain}`}>
            Update Product Collection
          </h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow ml-4"
            onClick={() => router.push("/admin/add-product")}
          >
            ← Back
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className={`block mb-2 ${textMain}`}>
              Upload .xlsx File
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="w-full text-white"
            />
          </div>
          <div className="text-gray-300 text-sm mb-2">
            <p>Required columns (case-insensitive):</p>
            <ul className="list-disc ml-6">
              <li>NAME</li>
              <li>SKU CODE</li>
              <li>BARCODE</li>
              <li>COLOURS</li>
              <li>SMALL</li>
              <li>MEDIUM</li>
              <li>LARGE</li>
              <li>XL</li>
              <li>XXL</li>
            </ul>
          </div>
          {error && <div className="text-red-400 font-semibold">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow mt-4"
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload & Update Collection"}
          </button>
        </form>
      </div>
    </div>
  );
}
