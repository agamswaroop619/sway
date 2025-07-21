"use client";

import { useEffect, useState } from "react";
import { firestore } from "../firebase.config";
import {
  collection as firestoreCollection,
  getDocs,
  updateDoc,
  doc,
  writeBatch,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Placeholder for admin check
const isAdmin = true; // TODO: Replace with real admin authentication

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number[] | number;
  totalSold?: number;
  revenue?: number;
  collection?: string;
}

// Theme colors
const bgMain =
  "bg-gradient-to-b from-green-900 via-black to-black min-h-screen";
const cardBg = "bg-gray-900";
const textMain = "text-white";
// const textSecondary = "text-gray-300"; // Removed unused variable

export default function AdminAnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  // const [collections, setCollections] = useState<any[]>([]); // Removed unused variable
  const router = useRouter();
  const [addStatus, setAddStatus] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCol = firestoreCollection(firestore, "products");
      const productSnapshot = await getDocs(productsCol);
      const productList: Product[] = [];
      productSnapshot.forEach((doc) => {
        const data = doc.data();
        productList.push({
          id: doc.id,
          title: data.title,
          price: data.price,
          quantity: data.quantity || 0,
          totalSold: data.totalSold || 0,
          revenue: data.revenue || 0,
          collection: data.collection,
        });
      });
      // If no products, use sample data
      if (productList.length === 0) {
        setProducts([
          {
            id: "1",
            title: "Brainfood",
            price: 499,
            quantity: 1000,
            totalSold: 120,
            revenue: 59880,
            collection: "Oversized T-Shirts",
          },
          {
            id: "2",
            title: "Break Rules",
            price: 499,
            quantity: 1000,
            totalSold: 80,
            revenue: 39920,
            collection: "Oversized T-Shirts",
          },
          {
            id: "3",
            title: "Cupid",
            price: 399,
            quantity: 1000,
            totalSold: 60,
            revenue: 23940,
            collection: "Streetwear",
          },
          {
            id: "4",
            title: "Endure",
            price: 349,
            quantity: 1000,
            totalSold: 40,
            revenue: 13960,
            collection: "Streetwear",
          },
        ]);
      } else {
        setProducts(productList);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Fetch collections from Firestore
    const fetchCollections = async () => {
      const snapshot = await getDocs(
        firestoreCollection(firestore, "collections")
      );
      // setCollections( // Removed unused variable
      //   snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      // );
    };
    fetchCollections();
  }, []);

  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  // Group by collection
  const collectionMap: Record<string, { totalSold: number; revenue: number }> =
    {};
  products.forEach((p) => {
    const col = p.collection || "Uncategorized";
    if (!collectionMap[col]) {
      collectionMap[col] = { totalSold: 0, revenue: 0 };
    }
    collectionMap[col].totalSold += p.totalSold ?? 0;
    collectionMap[col].revenue += p.revenue ?? 0;
  });
  const collectionNames = Object.keys(collectionMap);
  // const collectionSold = collectionNames.map( // Removed unused variable
  //   (col) => collectionMap[col].totalSold
  // );
  // const collectionRevenue = collectionNames.map( // Removed unused variable
  //   (col) => collectionMap[col].revenue
  // );

  // Dummy data for charts
  const dummyCollectionNames = [
    "Streetwear",
    "Oversized T-Shirts",
    "Polo",
    "Psychedelics Tshirts",
    "Regular Tshirts",
  ];
  const dummySold = [150, 200, 80, 60, 120];
  const dummyRevenue = [75000, 120000, 40000, 30000, 60000];

  // Dummy shirts per collection
  const dummyShirts: Record<
    string,
    { title: string; totalSold: number; revenue: number }[]
  > = {
    Streetwear: [
      { title: "Cupid", totalSold: 60, revenue: 23940 },
      { title: "Endure", totalSold: 40, revenue: 13960 },
      { title: "Weeper", totalSold: 50, revenue: 34950 },
    ],
    "Oversized T-Shirts": [
      { title: "Brainfood", totalSold: 120, revenue: 59880 },
      { title: "Break Rules", totalSold: 80, revenue: 39920 },
      { title: "Humanity", totalSold: 100, revenue: 49900 },
    ],
    Polo: [
      { title: "Classic Polo", totalSold: 30, revenue: 15000 },
      { title: "Modern Polo", totalSold: 50, revenue: 25000 },
    ],
    "Psychedelics Tshirts": [
      { title: "Psychedelic Dream", totalSold: 20, revenue: 10000 },
      { title: "Trippy Vision", totalSold: 40, revenue: 20000 },
    ],
    "Regular Tshirts": [
      { title: "Basic White", totalSold: 60, revenue: 18000 },
      { title: "Basic Black", totalSold: 60, revenue: 18000 },
    ],
  };

  // Prepare data for charts (by collection)
  const barSeries = [
    {
      name: "Total Sold",
      data: dummySold,
    },
  ];
  const barOptions = {
    chart: {
      type: "bar" as const,
      events: {
        dataPointSelection: (
          event: React.MouseEvent<HTMLElement>,
          chartContext: unknown,
          config: { dataPointIndex: number }
        ) => {
          setSelectedCollection(dummyCollectionNames[config.dataPointIndex]);
        },
      },
      foreColor: "#fff",
    },
    xaxis: {
      categories: dummyCollectionNames,
      labels: {
        style: {
          colors: Array(dummyCollectionNames.length).fill("#fff"),
          fontWeight: 600,
        },
      },
    },
    title: {
      text: "Total Sold per Collection (Dummy Data)",
      style: { color: "#fff" },
    },
    plotOptions: { bar: { distributed: true } },
    tooltip: { theme: "dark" },
    legend: { labels: { colors: ["#fff"] } },
  };

  const pieSeries = dummyRevenue;
  const pieOptions = {
    labels: dummyCollectionNames,
    title: {
      text: "Revenue Distribution by Collection (Dummy Data)",
      style: { color: "#fff" },
    },
    legend: { position: "bottom" as const, labels: { colors: ["#fff"] } },
    tooltip: { theme: "dark" },
    chart: {
      events: {
        dataPointSelection: (
          event: React.MouseEvent<HTMLElement>,
          chartContext: unknown,
          config: { dataPointIndex: number }
        ) => {
          setSelectedCollection(dummyCollectionNames[config.dataPointIndex]);
        },
      },
      foreColor: "#fff",
    },
  };

  // Data for the selected collection's shirts
  const selectedShirts = selectedCollection
    ? dummyShirts[selectedCollection] || []
    : [];
  const shirtBarSeries = [
    {
      name: "Total Sold",
      data: selectedShirts.map((s) => s.totalSold),
    },
  ];
  const shirtBarOptions = {
    chart: { type: "bar" as const, foreColor: "#fff" },
    xaxis: {
      categories: selectedShirts.map((s) => s.title),
      labels: {
        style: {
          colors: Array(selectedShirts.length).fill("#fff"),
          fontWeight: 600,
        },
      },
    },
    title: {
      text: selectedCollection
        ? `Performance of Shirts in ${selectedCollection}`
        : "",
      style: { color: "#fff" },
    },
    plotOptions: { bar: { distributed: true } },
    tooltip: { theme: "dark" },
    legend: { labels: { colors: ["#fff"] } },
  };

  return (
    <div className={`${bgMain} p-8`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${textMain}`}>
          Product Sales Analytics
        </h1>
        <div className="flex gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow transition-colors duration-200"
            onClick={() => router.push("/admin/add-tshirt")}
          >
            + Add Product
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition-colors duration-200"
            onClick={() => router.push("/admin/add-collection")}
          >
            + Add Collection
          </button>
        </div>
      </div>
      {addStatus && (
        <div className="mb-4 text-center text-lg font-semibold text-pink-400">
          {addStatus}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className={`${cardBg} p-4 rounded shadow`}>
          <ApexChart
            type="bar"
            options={barOptions}
            series={barSeries}
            height={350}
          />
        </div>
        <div className={`${cardBg} p-4 rounded shadow`}>
          <ApexChart
            type="pie"
            options={pieOptions}
            series={pieSeries}
            height={350}
          />
        </div>
      </div>
      {selectedCollection && (
        <div className={`${cardBg} p-4 rounded shadow mb-8`}>
          <ApexChart
            type="bar"
            options={shirtBarOptions}
            series={shirtBarSeries}
            height={350}
          />
        </div>
      )}
      <table className="min-w-full border border-gray-700">
        <thead>
          <tr className={`${cardBg} ${textMain}`}>
            <th className="border border-gray-700 px-4 py-2">Product</th>
            <th className="border border-gray-700 px-4 py-2">Total Sold</th>
            <th className="border border-gray-700 px-4 py-2">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={textMain}>
              <td className="border border-gray-700 px-4 py-2">
                {product.title}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                {product.totalSold ?? 0}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                ₹{product.revenue ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
