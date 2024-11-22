"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Track = () => {
  const [orderId, setOrderId] = useState("");
  const [err, setErr] = useState("");

  const router = useRouter();

  const trackHandelr = () => {
    if (orderId.trim() === "") {
        setErr("Invalid order Id");
    }
    else{
        setErr("");
        router.push(`/track-orders/${orderId}`)
    }
  }

  return (
    <div className="mx-10  my-6 w-[100vw]">
     
     <div className="flex gap-6 gap-y-6 xs:flex-col lg:flex-row  ">
     <div className="flex-row  gap-6 ">
     <span>Order ID : </span>
        <input
          type="text"
          className={`p-2 ml-3 w-[30vw] rounded-sm text-black outline-none  `}
          onChange={(e) => {
            if (e.target.value.length > 10) {
              setErr("Order Id must not exceeds than 10 characters");
              return;
            }
            if (err) {
              setErr("");
            }
            setOrderId(e.target.value.toUpperCase());
          }}
          value={orderId}
        />
     </div>

        <button onClick={trackHandelr} className="text-white w-[140px] p-2 border bg-green-600 rounded-md">
            Track Order
        </button>

        </div>
     </div>
 
  );
};

export default Track;
