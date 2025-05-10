import { NextResponse, NextRequest } from "next/server";
import { firestore } from "@/app/firebase.config";
import { doc, updateDoc, getDoc, writeBatch } from "firebase/firestore";


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
    shipmentId: string;
    image: string;
    title: string;
    price: number;
};

type UserData = {
    userId: string;
    orders?: Order[];
};

export async function POST(req: NextRequest) {
    try {
        const { cartItems, userData, shipmentId }: { cartItems: CartItem[]; userData?: UserData; shipmentId: string } = await req.json();

        console.log(" userData : ", userData);
        console.log(" cartItems : ", cartItems);
        console.log("shipment id: ", shipmentId);

        if (!cartItems || !userData?.userId || !shipmentId) {
            return NextResponse.json(
                { message: "Missing required fields", isOk: false },
                { status: 400 }
            );
        }

        const batch = writeBatch(firestore);
        const newOrders: Order[] = [];

        await Promise.all(
            cartItems.map(async (item: CartItem) => {
                const docRef = doc(firestore, "products", item.docId);
                const docData = await getDoc(docRef);
                
                if (!docData.exists()) {
                    throw new Error(`Product ${item.docId} not found`);
                }

                const itemData = docData.data();
                const sizeIndex = ["Small", "Medium", "Large", "XL", "XXL"].indexOf(item.size);
                
                if (sizeIndex === -1) {
                    throw new Error(`Invalid size ${item.size} for ${item.title}`);
                }

                if (item.qnt > itemData.quantity[sizeIndex]) {
                    throw new Error(`Insufficient stock for ${item.title}`);
                }

                const updatedQuantity = [...itemData.quantity];
                updatedQuantity[sizeIndex] -= item.qnt;
                batch.update(docRef, { quantity: updatedQuantity });

                newOrders.push({
                    itemId: item.itemId.toString(),
                    shipmentId: shipmentId, // You might want to generate a real shipment ID here
                    image: item.image,
                    title: item.title,
                    price: item.price,
                });
            })
        );

        await batch.commit();

        // Update user orders in Firestore
        const userRef = doc(firestore, "users", userData.userId);
        const updatedOrders = [...newOrders, ...(userData.orders || [])];
        
        await updateDoc(userRef, { orders: updatedOrders });

        return NextResponse.json(
            { message: "DB updated", isOk: true, orders: updatedOrders },
            { status: 200 }
        );

    } catch (error) {
    console.error("Error processing order:", error);
        return NextResponse.json(
            { message: "Failed to update database", isOk: false },
            { status: 500 }
        );
  }
}