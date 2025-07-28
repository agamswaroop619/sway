import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/firebase.config";
import { collection, getDocs, doc, updateDoc, query, where, DocumentData } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { name, collection: collectionName, color, quantity } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Product name is required" },
        { status: 400 }
      );
    }

    // Find the product by name (title field) - case insensitive
    const productsRef = collection(firestore, "products");
    const q = query(productsRef, where("title", "==", name));
    const querySnapshot = await getDocs(q);

    let productDoc = null;
    
    // If exact match not found, try case-insensitive search
    if (querySnapshot.empty) {
      const allProductsSnapshot = await getDocs(productsRef);
      for (const doc of allProductsSnapshot.docs) {
        const data = doc.data();
        if (data.title && data.title.toLowerCase() === name.toLowerCase()) {
          productDoc = doc;
          break;
        }
      }
    } else {
      productDoc = querySnapshot.docs[0];
    }

    if (!productDoc) {
      return NextResponse.json(
        { 
          success: false, 
          productFound: false,
          message: `Product with name "${name}" not found` 
        },
        { status: 404 }
      );
    }

    // Get the first matching document
    const productRef = doc(firestore, "products", productDoc.id);

    // Prepare update data
    const updateData: DocumentData = {
      updatedAt: new Date().toISOString()
    };

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
    if (collectionName) updateData.collection = collectionName;
    if (color) updateData.color = color;

    // Update the document
    await updateDoc(productRef, updateData);

    return NextResponse.json({
      success: true,
      message: `Product "${name}" updated successfully`,
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