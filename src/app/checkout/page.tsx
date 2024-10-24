"use client";

import { useAppSelector } from "@/lib/hooks";
import { selectCartItems } from "@/lib/features/carts/cartSlice";
import Script from "next/script";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import toast from "react-hot-toast";
import { Item } from "@/lib/features/items/items";
import { firestore } from "@/app/firebase.config";
import { doc, updateDoc, getDoc } from "firebase/firestore";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const CheckoutPage = () => {
  const [mounted, setMounted] = useState(false);
  const cartItems = useAppSelector(selectCartItems);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [apartment, setApartment] = useState("");

  let ItemsUpdate: any= [];

  const [error, setError] = useState("");

  useEffect(() => {
    if (cartItems) {
       getItemsUpdate();
    }
  }, [cartItems]);

  const getItemsUpdate = async () => {

    const data = [];

    const ref = {
      data: {
        docId: "adfafasf",
        id: 12,
        title: "Test Item to prevent undefined",
        images: [
          // image URLs here...
        ],
        quantity: {
          small: 100, // Example quantity for Small size
          medium: 500, // Example quantity for Medium size
          large: 1000, // Example quantity for Large size
        },
        price: 499.0,
        category: "",
        descImg:
          "https://res.cloudinary.com/dbkiysdeh/image/upload/v1727074581/Take_The_High_Road_jm1cy3.jpg",
        color: "Black",
        review: 3.5,
      },
    };

    let i= 1;

    // Assuming `cartItems` is an array of objects with details about the items.
    for (const item of cartItems) {

      const docRef = doc(firestore, "products", item.docId);

      try {
        // Fetch the document data, or use ref as a fallback
        const docSnap = await getDoc(docRef);
        const docData = docSnap.exists() ? docSnap.data() : ref.data;

        console.log(`${i++}th data element : `, docData);

        switch( item.size ) {

          case 'Small':
                if( item.qnt > docData.quantity[0].small ){
                  setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[0].small}`)
                  return;
                }
                
                docData.quantity[0].Small= docData.quantity[0].small;
                data.push({docData, docRef});

                break;

          case 'Medium':
            if( item.qnt > docData.quantity[0].medium ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[0].medium}`)
              return;
            }

            docData.quantity[0].medium= docData.quantity[0].medium;
            data.push({docData, docRef});

            break;

          case "Large":
            if( item.qnt > docData.quantity[0].large ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[0].large}`)
              return;
            }

            docData.quantity[0].large= docData.quantity[0].large;
            data.push({docData, docRef});


            break;

          case 'XL':
            if( item.qnt > docData.quantity[0].xl ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[0].xl}`)
              return;
            }

            docData.quantity[0].xl= docData.quantity[0].xl;
            data.push({docData, docRef});

            break;

          case 'XXL':
            if( item.qnt > docData.quantity[0].xxl ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[0].xxl}`)
              return;
            }

            docData.quantity[0].xxl= docData.quantity[0].xxl;
            data.push({docData, docRef});

            break;

          default:
            setError(`Ye kon sa size hai ?`)
            break;

        }

        ItemsUpdate = data;

      } catch (error) {
        console.error("Error fetching document:", error);
        setError("Failed to fetch data for some items");
      }
    }

    i= 1;
    for( const item of ItemsUpdate ) {
      const { docData, docRef } = item;
      console.log("doc data : ", docData);
    }

  };

  const [payment, setPayment] = useState("cash");
  const [shipping, setShipping] = useState("free");

  const createOrder = async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: 999 * 100 }),
    });
    const data = await res.json();

    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.id,
      prefill: {
        name: `${firstName} ${lastName}`,
        contact: "1234567890",
      },
      handler: async function (response: RazorpayResponse) {
        // verify payment
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.isOk) {
          toast.success("Payment is successfull");
          // await handleCheckout();
           //updateDB();
        } else {
          toast.error("Something went wrong. ");
        }
      },
    };

    const payment = new window.Razorpay(paymentData);

    payment.open();
  };

  const updateDB =  () => {

    let i= 1;

    for( const item of ItemsUpdate ) {
      console.log(`${i++}th Doc ref : `, item);
    }

  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally, you can show a loading spinner here or a simple placeholder
    return <div>Loading...</div>;
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qnt * item.price,
    0
  );

  const handleCheckout = async () => {
    const orderDetails = {
      order_id: Math.random().toString(10), // Random order ID
      order_date: new Date().toISOString(),

      billing_customer_name: `${firstName} ${lastName}`,
      billing_address: `${address}`,
      billing_city: "Gopal ganj",
      billing_pincode: 841438,
      billing_state: "Bihar", // Change as per user input
      billing_country: "India", // Change as per user input
      billing_email: "akr@gmail.com",
      billing_phone: "+91 76350 31250",
      shipping_is_billing: true, // Assuming shipping address is the same

      order_items: cartItems,
      payment_method: "COD",
      sub_total: subtotal, // Total price
      length: 10,
      breadth: 15,
      height: 20,
      weight: 1.5, // Product dimensions and weight
    };

    console.log("Order details : ", orderDetails);

    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderDetails }),
      });

      console.log("data : ", response);
      toast.success("order placed successfully");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place the order.");
    }
  };

  return (
    <div >
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      {error === "" ? (
        <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row mx-7 justify-between" >
          <div className="w-[56vw] xl:w-[56vw] lg:w-[56vw] md:w-[56vw] sm:w-[90vw] xs:w-[90vw]">
            <div className="w-full mt-10 mb-4">
              <h3 className="text-xl">Contact Information</h3>

              <p className="text-gray-500">
                We{`'`}ll use this email to send you details and updates about
                your order.
              </p>

              <div className="bg-white mt-3 rounded-md w-full px-2 text-black">
                <span className="text-[#7E7E7E]">Email address</span>
                <input
                  type="text"
                  className="w-full bg-transparent  focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <input type="checkbox" id="exclusive" className="my-4" />

              <label htmlFor="exclusive" className="text-gray-500 mx-2 my-4">
                I would like to receive exclusive emails with discounts and
                product information
              </label>
            </div>

            <div className="my-3">
              <h3 className="my-2 text-xl">Shipping address</h3>
              <p className="my-2 text-[#7E7E7E]">
                Enter the address where you want your order delivered.
              </p>

              <div className="bg-white my-3 w-full px-2 rounded-md text-black">
                <span className="text-[#7E7E7E]">County/Region</span>
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none"
                  onChange={(e) => setRegion(e.target.value)}
                  value={region}
                />
              </div>

              <div className="flex my-3 justify-between">
                <div className="bg-white w-[49%] rounded-md px-2 text-black">
                  <span className="text-[#7E7E7E]">First Name</span>
                  <input
                    type="text"
                    className=" w-full bg-transparent focus:outline-none"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </div>
                <div className="bg-white w-[49%]  rounded-md px-2 text-black">
                  <span className="text-[#7E7E7E]">Last Name</span>
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white my-3 rounded-md w-full px-2 text-black">
                <span className="text-[#7E7E7E]">Address</span>
                <input
                  type="text"
                  rounded-md
                  className="w-full bg-transparent focus:outline-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="bg-white my-3 w-full rounded-md px-2 text-black">
                <span className="text-[#7E7E7E]">
                  Apartment, suite, etc. (optional)
                </span>
                <input
                  type="text"
                  className="w-full bg-transparent focus:outline-none"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>

              <div className="flex my-3 justify-between">
                <div className="bg-white w-[49%] rounded-md  px-2 text-black">
                  <span className="text-[#7E7E7E]">City</span>
                  <input
                    type="text"
                    className=" w-full bg-transparent focus:outline-none"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="bg-white w-[49%] rounded-md px-2 text-black">
                  <span className="text-[#7E7E7E]">State</span>
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex my-3 justify-between">
                <div className="bg-white w-[49%] rounded-md px-2 text-black">
                  <span className="text-[#7E7E7E]">Postal Code</span>
                  <input
                    type="text"
                    className=" w-full bg-transparent focus:outline-none"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
                <div className="bg-white w-[49%] rounded-md px-2 text-black">
                  <span className="text-[#7E7E7E]">Phone</span>
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <h3 className="mt-5 mb-3 text-xl font-semibold">
              Shipping options
            </h3>

            <button
              onClick={() => setShipping("free")}
              className={` p-2 w-full rounded-md flex mt-3 mb-4 justify-between text-[#7E7E7E] ${
                shipping === "free" ? "border" : ""
              }`}
            >
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={shipping === "free"}
                  readOnly
                  className="mr-2"
                />
                Free Shipping
              </label>

              <span>FREE</span>
            </button>

            <div>
              <h3 className="my-3 text-xl font-semibold">Payment options</h3>

              <button
                onClick={() => setPayment("cash")}
                className={`${payment === "cash" ? "border" : "w-full"}
                    rounded-md px-4 py-2 w-full text-[#7E7E7E] relative my-2 hover:cursor-pointer
                     `}
              >
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={payment === "cash"}
                    readOnly
                    className="mr-2"
                  />
                  Cash on delivery
                </label>
                <p className="flex items-center mt-6 mb-1">
                  {payment === "cash" && (
                    <span>Pay with cash upon delivery.</span>
                  )}
                </p>
              </button>

              <button
                onClick={() => setPayment("online")}
                className={`
                ${payment === "online" ? "border" : ""}
                    rounded-md px-4 py-2
                     w-full my-2 hover:cursor-pointer text-[#7E7E7E]`}
              >
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={payment === "online"}
                    readOnly
                    className="mr-2"
                  />
                  Pay by Razorpay
                </label>
                <p className="flex items-center mt-6 mb-1">
                  {payment === "online" && (
                    <span>
                      Pay securely by Credit or Debit card or Internet Banking
                      through Razorpay.
                    </span>
                  )}
                </p>
              </button>
            </div>

            <p>
              By proceeding with your purchase you agree to our Terms and
              Conditions and Privacy Policy
            </p>

            <div className="w-full flex justify-between my-10">
              <Link href="/cart" className="py-4 flex gap-4 items-center">
                <GoArrowLeft /> Return to cart
              </Link>
              <Link
                href="#"
                onClick={createOrder}
                className="border flex justify-center items-center  px-28 "
              >
                Place Order
              </Link>
            </div>
          </div>

          <div className="w-[30vw] xl:w-[30vw] lg:w-[30vw] md:w-[30vw] sm:w-[90vw] xs:w-[90vw] mt-10 text-[#7E7E7E]">
            <div>
              <p>Order summary </p>
              {cartItems.map((item) => {
                return (
                  <div
                    key={item.itemId}
                    className="flex text-sm justify-between my-5 "
                  >
                    <img src={item.image} className="h-20" />
                    <div className="w-[55%]">
                      <p className="tracking-wide leading-normal mb-2">
                        {" "}
                        {item.title} | Oversized-T-shirt | Sway Clothing
                      </p>
                      <p>
                        <span className="line-through ">₹999</span>
                        <span> ₹{item.price}</span>
                      </p>
                      <p className="p-2 border rounded-md my-2 w-28">
                        5 left in stock
                      </p>
                      <p>
                        Size : <span>Medium</span>
                      </p>
                    </div>
                    <span>₹{item.price * item.qnt}</span>
                  </div>
                );
              })}
            </div>

            <div className="py-2 my-2">
              Apply Coupon
              {
                <div className="my-1">
                  <input
                    type="text"
                    id="coupon"
                    name="coupon"
                    className="bg-transparent p-2 border focus:outline-none"
                    placeholder="Enter Coupon Code"
                  />

                  <button className="p-2 ml-4 border">Apply</button>
                </div>
              }
            </div>

            <div>
              <p className="w-full  my-3 flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </p>

              <p className="w-full my-3 flex justify-between">
                <span>Cash on delivery (Shipping charges)</span>
                <span>₹79</span>
              </p>

              <div className="flex my-3 justify-between">
                <div>
                  <p> Shipping </p>
                  <p className="text-sm my-2 text-gray-500">Free Shipping</p>
                </div>
                <span>FREE</span>
              </div>

              <p className="w-full text-lg my-4 font-semibold flex justify-between">
                <span>Total</span>
                <span>₹{subtotal + 79}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-lg font-bold my-4">Your Cart is Empty</p>
          <p> {error} </p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
