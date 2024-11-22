'use client'
import React, {useEffect} from 'react'
import { useParams } from 'next/navigation';

const TrackingPage = () => {

    // const [ status , setStatus ] = useState("");
    // const [ trackingNumber , setTrackingNumber ] = useState("");
    // const [ trackingData , setTrackingData ] = useState
    // ({
    //     "trackingNumber" : "",
    //     "status" : "",
    //     "data" : []
    //     });
    // const [ err, setErr ] = useState(false);

    // fetch the order id
    const params= useParams();
    const orderId = params.orderId;

    const fetchOrderData = async() => {
        console.log(`Order data is fetching for the ${orderId}`)
        alert(`Order data is fetching for the ${orderId}`)
    }   

    useEffect( () => {
       fetchOrderData();
    }, [])

  return (
    <div className='flex justify-between items-center h-[60vh] w-[90vw] '>
      <p className='relative left-60 text-green-500'>this is a tracking order page</p>
    </div>
  )
}

export default TrackingPage
