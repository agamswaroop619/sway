import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// POST method for placing an order
export async function POST(req: NextRequest) {
  try {
    // Step 1: Extract order details from the request body
    const { orderDetails } = await req.json();
    if (!orderDetails) {
      return NextResponse.json({ error: 'Order details are required' }, { status: 400 });
    }

    // Step 2: Authenticate the admin and get the token
    const authResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/auth/login',
      {
        "email": process.env.SHIP_ROCKET_EMAIL,
        "password": process.env.SHIP_ROCKET_PASS_KEY,
      }
    );

    const token = authResponse.data.token;
    if (!token) {
      return NextResponse.json({ error: 'Failed to authenticate with Shiprocket' }, { status: 401 });
    }

    // Step 3: Use the token to place the order with Shiprocket
    const orderResponse = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      orderDetails,
      {
        headers: {

          "Authorization": `Bearer ${token}`,
        },
      }
    );

   // console.log("order details : ", orderResponse);

    // Step 4: Return a success response with order details
    return NextResponse.json(
      {
        message: 'Order placed successfully',
        orderId: orderResponse.data.order_id, // Assuming Shiprocket's response includes `order_id`
        details: orderResponse.data,
      },
      { status: 200 }
    );
  } catch (error) {
    // Enhanced error handling
    let errorMessage = 'An error occurred while placing the order';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Return an error response
    return NextResponse.json(
      {
        error: 'Order placement failed',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
