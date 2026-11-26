import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/firebase.config";
import { doc, runTransaction } from "firebase/firestore";

interface OrderType {
  docId?: string;
  size?: string;
  quantity?: number;
  shipmentId: string;
}

const sizes = ["Small", "Medium", "Large", "XL", "XXL"];

export async function POST(req: NextRequest) {
  try {
    const { userId, shipmentId }: { userId: string; shipmentId: string } = await req.json();

    if (!userId || !shipmentId) {
      return NextResponse.json(
        { success: false, message: "userId and shipmentId are required" },
        { status: 400 }
      );
    }

    let cancelledCount = 0;
    let restoredItems: number = 0;

    await runTransaction(firestore, async (transaction) => {
      const userRef = doc(firestore, "users", userId);
      const userSnapshot = await transaction.get(userRef);
      if (!userSnapshot.exists()) {
        throw new Error(`User ${userId} not found`);
      }

      const userData = userSnapshot.data();
      const existingOrders = Array.isArray(userData.orders) ? (userData.orders as OrderType[]) : [];
      const ordersToCancel = existingOrders.filter((order) => order.shipmentId === shipmentId);

      if (ordersToCancel.length === 0) {
        throw new Error(`No orders found for shipment ${shipmentId}`);
      }

      const updatedOrders = existingOrders.filter((order) => order.shipmentId !== shipmentId);

      for (const order of ordersToCancel) {
        if (!order.docId || !order.size || typeof order.quantity !== "number") {
          continue;
        }

        const sizeIndex = sizes.indexOf(order.size);
        if (sizeIndex === -1) {
          continue;
        }

        const productRef = doc(firestore, "products", order.docId);
        const productSnapshot = await transaction.get(productRef);
        if (!productSnapshot.exists()) {
          continue;
        }

        const productData = productSnapshot.data();
        const quantityArray = Array.isArray(productData.quantity)
          ? [...productData.quantity]
          : [0, 0, 0, 0, 0];

        quantityArray[sizeIndex] = (quantityArray[sizeIndex] ?? 0) + order.quantity;
        transaction.update(productRef, { quantity: quantityArray });
        restoredItems += order.quantity;
      }

      transaction.update(userRef, { orders: updatedOrders });
      cancelledCount = ordersToCancel.length;
    });

    return NextResponse.json({
      success: true,
      message: `Cancelled ${cancelledCount} order item(s) and restored stock for ${restoredItems} unit(s).`,
      cancelledCount,
      restoredItems,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to cancel order",
      },
      { status: 500 }
    );
  }
}
