import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextRequest) {
  if (req.method === "GET") {
    const { shipmentId } = await req.json();

    if (!shipmentId) {
      return NextResponse.json({ error: "Shipment ID is required"  }, { status: 400 });
    }

    try {

        const authResponse = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.SHIP_ROCKET_EMAIL,
            password: process.env.SHIP_ROCKET_PASS_KEY,
          });
      
         const token = authResponse.data().token;

      const response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Replace with your API key
          },
        }
      );

      return NextResponse.json( response.data, { status: 200 });
    } catch (error) {
      console.error("Error tracking shipment:", error);
      return NextResponse.json({ error: "Failed to track shipment"  }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}



/*
{
    "688464692": {
        "tracking_data": {
            "track_status": 0,
            "shipment_status": 0,
            "shipment_track": [
                {
                    "id": 0,
                    "awb_code": "",
                    "courier_company_id": null,
                    "shipment_id": 0,
                    "order_id": 0,
                    "pickup_date": "",
                    "delivered_date": "",
                    "weight": "",
                    "packages": 0,
                    "current_status": "",
                    "delivered_to": "",
                    "destination": "",
                    "consignee_name": "",
                    "origin": "",
                    "courier_agent_details": null,
                    "courier_name": "",
                    "edd": null,
                    "pod": "",
                    "pod_status": "",
                    "rto_delivered_date": "",
                    "return_awb_code": ""
                }
            ],
            "shipment_track_activities": null,
            "track_url": "",
            "qc_response": "",
            "is_return": false,
            "error": "Aahh! There is no activities found in our DB. Please have some patience it will be updated soon."
        }
    }
}

*/