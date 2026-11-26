import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/firebase.config";
import { doc, runTransaction } from "firebase/firestore";

const sizes = ["Small", "Medium", "Large", "XL", "XXL"];

export async function POST(req: NextRequest) {
  try {
    const { docId, size, adjustment }: { docId: string; size: string; adjustment: number } = await req.json();

    if (!docId || !size || typeof adjustment !== "number") {
      return NextResponse.json(
        { success: false, message: "docId, size and adjustment are required" },
        { status: 400 }
      );
    }

    const sizeIndex = sizes.indexOf(size);
    if (sizeIndex === -1) {
      return NextResponse.json(
        { success: false, message: `Invalid size ${size}` },
        { status: 400 }
      );
    }

    let updatedQuantity: number[] = [];

    await runTransaction(firestore, async (transaction) => {
      const productRef = doc(firestore, "products", docId);
      const productSnapshot = await transaction.get(productRef);
      if (!productSnapshot.exists()) {
        throw new Error(`Product ${docId} not found`);
      }

      const productData = productSnapshot.data();
      const quantityArray = Array.isArray(productData.quantity)
        ? [...productData.quantity]
        : [0, 0, 0, 0, 0];

      const currentValue = quantityArray[sizeIndex] ?? 0;
      const nextValue = currentValue + adjustment;
      if (nextValue < 0) {
        throw new Error(`Cannot reduce ${size} stock below zero`);
      }

      quantityArray[sizeIndex] = nextValue;
      updatedQuantity = quantityArray;
      transaction.update(productRef, { quantity: quantityArray });
    });

    return NextResponse.json({ success: true, quantity: updatedQuantity });
  } catch (error) {
    console.error("Error updating product stock:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update stock",
      },
      { status: 500 }
    );
  }
}
