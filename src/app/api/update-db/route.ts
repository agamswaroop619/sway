import { NextResponse, NextRequest } from "next/server";
import { firestore } from "@/app/firebase.config";
import { doc, runTransaction } from "firebase/firestore";


type CartItem = {
    docId: string;
    size: string;
    qnt: number;
    title: string;
    itemId: number;
    price: number;
    image: string;
};

type Order = {
    itemId: string;
    docId?: string;
    shipmentId: string;
    image: string;
    title: string;
    price: number;
    size?: string;
    quantity?: number;
    orderDate?: string;
    paymentMethod?: string;
    totalAmount?: number;
};

type UserData = {
    userId: string;
    orders?: Order[];
};

export async function POST(req: NextRequest) {
    try {
        const { cartItems, userData, shipmentId, paymentMethod }: { cartItems: CartItem[]; userData?: UserData; shipmentId: string; paymentMethod?: string } = await req.json();

        if (!cartItems || !userData?.userId || !shipmentId) {
            return NextResponse.json(
                { message: "Missing required fields", isOk: false },
                { status: 400 }
            );
        }

        const newOrders: Order[] = [];
        const orderDate = new Date().toISOString();

        let updatedOrders: Order[] = [];

        await runTransaction(firestore, async (transaction) => {
            for (const item of cartItems) {
                const docRef = doc(firestore, "products", item.docId);
                const docData = await transaction.get(docRef);

                if (!docData.exists()) {
                    throw new Error(`Product ${item.docId} not found`);
                }

                const itemData = docData.data();
                const sizeIndex = ["Small", "Medium", "Large", "XL", "XXL"].indexOf(item.size);

                if (sizeIndex === -1) {
                    throw new Error(`Invalid size ${item.size} for ${item.title}`);
                }

                const currentQuantity = Array.isArray(itemData.quantity)
                    ? itemData.quantity[sizeIndex] ?? 0
                    : 0;

                if (item.qnt > currentQuantity) {
                    throw new Error(`Insufficient stock for ${item.title}`);
                }

                const updatedQuantity = [...itemData.quantity];
                updatedQuantity[sizeIndex] = currentQuantity - item.qnt;
                transaction.update(docRef, { quantity: updatedQuantity });

                newOrders.push({
                    itemId: item.itemId.toString(),
                    docId: item.docId,
                    shipmentId,
                    image: item.image,
                    title: item.title,
                    price: item.price,
                    size: item.size,
                    quantity: item.qnt,
                    orderDate,
                    paymentMethod: paymentMethod || "Unknown",
                    totalAmount: item.price * item.qnt,
                });
            }

            const userRef = doc(firestore, "users", userData.userId);
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error(`User ${userData.userId} not found`);
            }

            const existingOrders = userDoc.data().orders || [];
            updatedOrders = [...newOrders, ...existingOrders];
            transaction.update(userRef, { orders: updatedOrders });
        });

        return NextResponse.json(
            { message: "DB updated", isOk: true, orders: updatedOrders },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error processing order:", error);
        return NextResponse.json(
            { message: "Failed to update database", isOk: false, details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
