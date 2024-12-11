'use client'
import React, { useState, useEffect, use } from 'react'
import { useParams } from 'next/navigation';
import { RootState } from '@/lib/store';
import { useAppSelector } from '@/lib/hooks';
import { Order } from '@/lib/features/user/user';
import { CiDeliveryTruck } from "react-icons/ci";

const userInfo = (state: RootState) => state.user.userProfile;

const TrackingPage = () => {

    // fetch the order id
    const params= useParams();
    const shipmentId= params.shipmentId;

    const [ shipping, setShipping ] = useState(true);
    const [ deliveryDate, setDeliveryDate] = useState("12 Dec, 2024");
    const [ pickup, setPickup] = useState("");

  const [ error, setError] = useState(false);
  const [ success, setSuccess ] = useState("loading");

    const orders: Order[] = useAppSelector(userInfo)?.orders || [];  

    const fetchOrderData = async() => {

       try {
        const response = await fetch("/api/trackShipment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shipmentId }),
        });
    
        if (!response.ok) {
          setSuccess("error")
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
        const data = await response.json();
    
        console.log("Shiprocket response : ", response)
        console.log("shipment data : ", data);
    
      } catch (error) {
        console.error("Checkout error:", error);

      }

    }   

    fetchOrderData();
    

  return (
    <div className='lg:mx-28 sm:mx-4 xs:mx-10 md:mx-20 xl:mx-28  min-h-[100vh] '>

     <p className='text-2xl '>Shipment ID : {shipmentId} </p>

    {
      shipping && (
        <div className='mb-4'>

<p className='my-4 pb-2 text-green-600 border-b flex gap-4 border-gray-400 items-center'> <CiDeliveryTruck className='' />  Expected delivery date : {deliveryDate} </p>

          <p>Shipped: {pickup || "8 Dec, 2024"} </p>

        </div>
      )
    }

    {
      !shipping && ( <div>
        <p>Shipping : In processing</p>
      </div> )
    }

    {
      success === "error" &&
      ( <div>
        <p> Somethig went wrong with shipment is {shipmentId}. Plz verify the shipment once or try again. is not valid.</p>
      </div> )
    }

    {
      orders.map( (item, index) => {
        return(
          <div key={ index } className='flex mb-4 w-full justify-between' >

           <div className='flex md:gap-10 lg:gap-10 xs:gap-4 sm:gap-6'>
              <img src={item.image} className='w-20' alt={`${item.title}`} />

              <div>
                <p className='md:text-lg lg:text-xl xl:text-xl xs:text-md sm:text-md'> {item.title} </p>
                <p className='text-gray-500'> Size: {item.size || "Small"} </p>
              </div>
           </div>

            <div className='sm:ml-3 xs:ml-3'>
              <p className='md:text-lg lg:text-xl xl:text-xl xs:text-md sm:text-md'> ₹{item.price} </p>
              <p className='text-gray-500'>Qty : {item.qnt || "1"}</p>
            </div>

          </div>
        )
      })
    }

    <div className='mt-8 pt-8 border-t '>
      <p>Payment: {orders[0]?.paymentMode || "Prepaid"}</p>
    </div>

    </div>
  )
}

export default TrackingPage


/*

{
    "703843195": {
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
