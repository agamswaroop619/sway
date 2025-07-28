import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/firebase.config";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { skuCode, name, collection: collectionName, color, quantity } = await req.json();

    if (!skuCode) {
      return NextResponse.json(
        { success: false, message: "SKU code is required" },
        { status: 400 }
      );
    }

    // Find the product by SKU code (id field)
    const productsRef = collection(firestore, "products");
    const q = query(productsRef, where("id", "==", parseInt(skuCode)));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { 
          success: false, 
          productFound: false,
          message: `Product with SKU code ${skuCode} not found` 
        },
        { status: 404 }
      );
    }

    // Get the first matching document
    const productDoc = querySnapshot.docs[0];
    const productRef = doc(firestore, "products", productDoc.id);

    // Prepare update data
    const updateData: Record<string, any> = {};

    // Update quantity array [S, M, L, XL, XXL]
    if (quantity) {
      updateData.quantity = [
        quantity.small || 0,
        quantity.medium || 0,
        quantity.large || 0,
        quantity.xl || 0,
        quantity.xxl || 0
      ];
    }

    // Update other fields if provided
    if (name) updateData.title = name;
    if (collectionName) updateData.collection = collectionName;
    if (color) updateData.color = color;

    // Add update timestamp
    updateData.updatedAt = new Date().toISOString();

    // Update the document
    await updateDoc(productRef, updateData);

    return NextResponse.json({
      success: true,
      message: `Product ${skuCode} updated successfully`,
      productId: productDoc.id,
      updatedFields: Object.keys(updateData)
    });

  } catch (error) {
    console.error("Error updating product stock:", error);
    return NextResponse.json(
      { 
        success: false, 
        productFound: true,
        message: "Failed to update product",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 