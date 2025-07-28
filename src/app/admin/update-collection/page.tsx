"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

const bgMain =
  "bg-gradient-to-b from-green-900 via-black to-black min-h-screen";
const cardBg = "bg-gray-900";
const textMain = "text-white";

interface StockSummary {
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  averageStock: number;
}

export default function UpdateCollectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonOutput, setJsonOutput] = useState<unknown>(null);
  const [stockData, setStockData] = useState<StockSummary | null>(null);
  const [stockLoading, setStockLoading] = useState(true);
  const router = useRouter();

  // Fetch stock data on first load
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("/api/stock");
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setStockData(result.summary);
          }
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setStockLoading(false);
      }
    };

    fetchStockData();
  }, []);

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
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headers = (rows[0] as string[]).map((h) => h.trim().toUpperCase());
      const dataRows = rows.slice(1);

      const result: Record<string, unknown[]> = {
        102349: [],
      };

      let index = 1;

      for (const row of dataRows) {
        const product: Record<string, unknown> = {};
        headers.forEach((key: string, i: number) => {
          product[key] = row[i];
        });

        const doc = {
          documentChange: {
            document: {
              name: `projects/sway-4dcdc/databases/(default)/documents/products/${
                product["SKU CODE"] || "sku_" + index
              }`,
              fields: {
                id: {
                  integerValue:
                    product["SKU CODE"]?.toString() || index.toString(),
                },
                title: { stringValue: product["NAME"] || "" },
                collection: { stringValue: product["COLLECTION"] || "" },
                color: { stringValue: product["COLOURS"] || "" },
                price: { integerValue: "699" },
                quantity: {
                  arrayValue: {
                    values: ["SMALL", "MEDIUM", "LARGE", "XL", "XXL"].map(
                      (size) => ({
                        integerValue: product[size] || "0",
                      })
                    ),
                  },
                },
                images: {
                  arrayValue: {
                    values: [],
                  },
                },
                description: { stringValue: "" },
                createdAt: {
                  timestampValue: new Date().toISOString(),
                },
              },
              createTime: new Date().toISOString(),
              updateTime: new Date().toISOString(),
            },
            targetIds: [4],
          },
        };

        result[102349].push([index, [doc]]);
        index++;
      }

      setJsonOutput(result);
    } catch (err) {
      console.error(err);
      setError("Failed to process file.");
    }
    setLoading(false);
  };

  let jsonString = "";
  if (jsonOutput) {
    try {
      jsonString = JSON.stringify(jsonOutput, null, 2);
    } catch {
      jsonString = String(jsonOutput);
    }
  }

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

      {jsonString && (
        <div className="bg-black text-white mt-6 p-4 rounded max-w-4xl overflow-auto max-h-[400px] text-sm w-full">
          <pre>{jsonString}</pre>
        </div>
      )}
    </div>
  );
}
