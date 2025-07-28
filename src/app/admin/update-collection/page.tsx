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

      const updateResults: Array<{
        skuCode: string;
        name: string;
        status: "updated" | "not_found" | "error";
        message: string;
      }> = [];

      for (const row of dataRows) {
        const product: Record<string, unknown> = {};
        headers.forEach((key: string, i: number) => {
          product[key] = row[i];
        });

        const skuCode = product["SKU CODE"]?.toString();
        const productName = product["NAME"]?.toString() || "";

        if (!skuCode) {
          updateResults.push({
            skuCode: "N/A",
            name: productName,
            status: "error",
            message: "SKU CODE is missing",
          });
          continue;
        }

        try {
          // Call API to update the product
          const response = await fetch("/api/update-product-stock", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              skuCode,
              name: productName,
              collection: product["COLLECTION"]?.toString() || "",
              color: product["COLOURS"]?.toString() || "",
              quantity: {
                small: parseInt(product["SMALL"]?.toString() || "0"),
                medium: parseInt(product["MEDIUM"]?.toString() || "0"),
                large: parseInt(product["LARGE"]?.toString() || "0"),
                xl: parseInt(product["XL"]?.toString() || "0"),
                xxl: parseInt(product["XXL"]?.toString() || "0"),
              },
            }),
          });

          const updateResult = await response.json();

          if (updateResult.success) {
            updateResults.push({
              skuCode,
              name: productName,
              status: "updated",
              message: "Successfully updated",
            });
          } else {
            updateResults.push({
              skuCode,
              name: productName,
              status: updateResult.productFound ? "error" : "not_found",
              message: updateResult.message || "Update failed",
            });
          }
        } catch (error) {
          updateResults.push({
            skuCode,
            name: productName,
            status: "error",
            message: "Network error",
          });
        }
      }

      setJsonOutput({
        summary: {
          total: updateResults.length,
          updated: updateResults.filter((r) => r.status === "updated").length,
          notFound: updateResults.filter((r) => r.status === "not_found")
            .length,
          errors: updateResults.filter((r) => r.status === "error").length,
        },
        results: updateResults,
      });

      // Refresh stock data after update
      const stockResponse = await fetch("/api/stock");
      if (stockResponse.ok) {
        const stockResult = await stockResponse.json();
        if (stockResult.success) {
          setStockData(stockResult.summary);
        }
      }
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

  const displayString = String(jsonString || "");

  return (
    <div
      className={`${bgMain} p-8 flex flex-col items-center justify-center min-h-screen`}
    >
      {/* Stock Summary Box */}
      {stockData && !stockLoading && (
        <div className={`${cardBg} rounded shadow p-6 w-full max-w-4xl mb-6`}>
          <div className="text-white">
            <h3 className="text-xl font-bold mb-4">
              📊 Current Stock Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">
                  {stockData.totalProducts}
                </div>
                <div className="text-gray-300">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">
                  {stockData.totalStock}
                </div>
                <div className="text-gray-300">Total Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">
                  {stockData.lowStockProducts}
                </div>
                <div className="text-gray-300">Low Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-300">
                  {stockData.outOfStockProducts}
                </div>
                <div className="text-gray-300">Out of Stock</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-gray-300">Average Stock per Product: </span>
              <span className="font-bold text-blue-300">
                {stockData.averageStock} units
              </span>
            </div>
          </div>
        </div>
      )}

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
        <div className={`${cardBg} rounded shadow p-6 w-full max-w-4xl mt-6`}>
          <div className="text-white">
            <h3 className="text-xl font-bold mb-4">
              📋 Update Results Summary
            </h3>

            {jsonOutput &&
              typeof jsonOutput === "object" &&
              "summary" in jsonOutput && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">
                      {String((jsonOutput as any).summary.total)}
                    </div>
                    <div className="text-gray-300">Total Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">
                      {String((jsonOutput as any).summary.updated)}
                    </div>
                    <div className="text-gray-300">Successfully Updated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">
                      {String((jsonOutput as any).summary.notFound)}
                    </div>
                    <div className="text-gray-300">Not Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-300">
                      {String((jsonOutput as any).summary.errors)}
                    </div>
                    <div className="text-gray-300">Errors</div>
                  </div>
                </div>
              )}

            <div className="bg-black rounded p-4 overflow-auto max-h-[300px] text-sm">
              <pre className="text-white">{displayString}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
