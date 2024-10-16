import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET as string;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

type PaymentVerificationRequest = {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export async function POST(request: NextRequest) {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } =
      (await request.json()) as PaymentVerificationRequest;

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { message: "Invalid request data", isOk: false },
        { status: 400 }
      );
    }

    const signature = generatedSignature(orderId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
      return NextResponse.json(
        { message: "Payment verification failed", isOk: false },
        { status: 400 }
      );
    }

    // Process successful payment here (e.g., update DB)
    return NextResponse.json(
      { message: "Payment verified successfully", isOk: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during payment verification:", error);
    return NextResponse.json(
      { message: "Server error during payment verification", isOk: false },
      { status: 500 }
    );
  }
}
