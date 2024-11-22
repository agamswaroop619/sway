import { NextRequest, NextResponse } from 'next/server';
 import axios from 'axios';
 import toast from 'react-hot-toast';

// POST method for placing an order
export async function POST( req: NextRequest) {
  const { orderDetails } = await req.json();  // Extract order details from the request body

  try {
   // First, authenticate the admin and get the token
    const authResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIP_ROCKET_EMAIL,
      password: process.env.SHIP_ROCKET_PASS_KEY,
    });

   const token = authResponse.data().token;

   // Step 2: Use the token to place the order with Shiprocket
    const orderResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderDetails,  // Order details passed from frontend
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    // Return the response with order ID

    return NextResponse.json({ orderId: 200, details: orderResponse }, { status: 200 });

  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    toast.error("Error aa gya");
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    return NextResponse.json({ error: 'Order placement failed', details: errorMessage }, { status: 500 });
  }
  
  
}