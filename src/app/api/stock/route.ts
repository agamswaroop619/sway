import { NextResponse } from "next/server";
import { firestore } from "@/app/firebase.config";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const productsSnapshot = await getDocs(collection(firestore, "products"));
    
    const stockData = productsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        collection: data.collection || "",
        quantity: data.quantity || [0, 0, 0, 0, 0], // [S, M, L, XL, XXL]
        totalStock: Array.isArray(data.quantity) 
          ? data.quantity.reduce((sum: number, qty: number) => sum + qty, 0)
          : 0,
        price: data.price || 0,
      };
    });

    // Calculate summary statistics
    const totalProducts = stockData.length;
    const totalStock = stockData.reduce((sum, product) => sum + product.totalStock, 0);
    const lowStockProducts = stockData.filter(product => product.totalStock < 10).length;
    const outOfStockProducts = stockData.filter(product => product.totalStock === 0).length;

    const summary = {
      totalProducts,
      totalStock,
      lowStockProducts,
      outOfStockProducts,
      averageStock: totalProducts > 0 ? Math.round(totalStock / totalProducts) : 0,
    };

    return NextResponse.json({
      success: true,
      data: stockData,
      summary,
    });

  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch stock data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 