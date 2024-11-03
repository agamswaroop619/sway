"use client";

import { useAppSelector } from "@/lib/hooks";
import { selectCartItems } from "@/lib/features/carts/cartSlice";
import Script from "next/script";
import { useState, useEffect } from "react";
import Link from "next/link";
import {  GoArrowLeft } from "react-icons/go";
import toast from "react-hot-toast";
import { firestore } from "@/app/firebase.config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ItemsUpdate } from "../../../itemsUpdate";
import { clearCart } from "@/lib/features/carts/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { GoChevronDown } from "react-icons/go";

const userInfo = ( state : RootState ) => state.user.userProfile;

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const CheckoutPage = () => {

  const [mounted, setMounted] = useState(false);

  // items that will be placed
  const cartItems = useAppSelector(selectCartItems);

  // Items and their reference of cartItems for update in database
  const ItemsUpdate: ItemsUpdate[]= [];
    // data of user
    const userData = useAppSelector( userInfo );

  // Address field
  const [firstName, setFirstName] = useState( userData?.name);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(userData?.email);
  const [address, setAddress] = useState(userData?.delivery?.address);
  const [city, setCity] = useState(userData?.delivery?.city);
  const [state, setState] = useState(userData?.delivery?.state);
  const [zipCode, setZipCode] = useState(userData?.delivery?.postalCode);
  const [country, setCountry] = useState(userData?.delivery?.country );
  const [phone, setPhone] = useState(userData?.phone);
  const [apartment, setApartment] = useState(userData?.delivery?.apartment);

  const [ couponErr , setCouponErr ] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const couponHandler = () => {
    
    if (couponCode === "") {
      setCouponErr("Please enter a valid coupon code");
    }
    else
    setCouponErr("Invalid Coupon Code");

    return ;
  }

  // payment and shipping
  const [payment, setPayment] = useState("cash");
  const [shipping, setShipping] = useState("free");

  // success and error
  const [error, setError] = useState("");
  const [ success, setSuccess ] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // push ref and updated items of cartItems
  const getItemsUpdate = async () => {

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

    // Assuming `cartItems` is an array of objects with details about the items.
    for (const item of cartItems) {

      const docRef = doc(firestore, "products", item.docId);

      try {
        // Fetch the document data, or use ref as a fallback
        const docSnap = await getDoc(docRef);
        const docData = docSnap.exists() ? docSnap.data() : ref.data;

        if( !docSnap.exists() ){
          console.log("Document does not exist");
          setError("Something went wrong");
          return;
        }

        switch( item.size ) {

          case 'Small':
                if( item.qnt > docData.quantity[0].small ){
                  setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[0].small}`)
                  return;
                }
                
                docData.quantity[0].small= docData.quantity[0].small - item.qnt;
                ItemsUpdate.push({docData, docRef});

                break;

          case 'Medium':
            if( item.qnt > docData.quantity[1].medium ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[1].medium}`)
              return;
            }

            docData.quantity[1].medium= docData.quantity[1].medium - item.qnt;
            ItemsUpdate.push({docData, docRef});

            break;

          case "Large":
            if( item.qnt > docData.quantity[2].large ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[2].large}`)
              return;
            }

            docData.quantity[2].large= docData.quantity[2].large - item.qnt;
            ItemsUpdate.push({docData, docRef});


            break;

          case 'XL':
            if( item.qnt > docData.quantity[3].xl ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[3].xl}`)
              return;
            }

            docData.quantity[3].xl= docData.quantity[3].xl - item.qnt;
            ItemsUpdate.push({docData, docRef});

            break;

          case 'XXL':
            if( item.qnt > docData.quantity[4].xxl ){
              setError(`Quantity of ${item.title} is exceed from available by ${item.qnt- docData.quantity[4].xxl}`)
              return;
            }

            docData.quantity[4].xxl= docData.quantity[4].xxl - item.qnt;
            ItemsUpdate.push({docData, docRef});

            break;

          default:
            setError(`Ye kon sa size hai ?`)
            break;

        }

      } catch (error) {
        console.error("Error fetching document:", error);
        setError("Failed to fetch data for some items");
      }
    }

    console.log("Data is  -> ", ItemsUpdate);

  };

 // 1. Make paymeyt and verify
//  2. Mark success true for update the database
const createOrder = async () => {
  try {
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: (subtotal+79) * 100 }),
    });
    const data = await res.json();

    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.id,
      prefill: {
        name: `${firstName}` ,
        contact: "1234567890",
      },
      handler: async function (response: RazorpayResponse) {
        try {
          // Verify payment
          const res = await fetch("/api/verify-payment", {
            method: "POST",
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verificationData = await res.json();
          if (verificationData.isOk) {
            toast.success("Payment is successful");
          
            setSuccess( true );

          } else {
            toast.error("Something went wrong.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed.");
        }
      },
    };

    const payment = new window.Razorpay(paymentData);
    payment.open();
  } catch (error) {
    console.error("Order creation error:", error);
    toast.error("Failed to create order.");
  }
};

  // push orderd items in order section of user
  const pushItems = async () => {
    const userRef = doc(firestore, "users", userData?.userId || "");
  
    try {
      const userDoc = await getDoc(userRef);
  
      console.log("User ID:", userData?.userId);
      console.log("User Document:", userDoc);
  
      if (userDoc.exists()) {
        const currentOrders = userDoc.data().orders || [];
        const newOrders = ItemsUpdate.map(item => {
          console.log("Processing item:", item);
          return item?.docData?.data()?.id;
        });
  
        const updatedOrders = [...currentOrders, ...newOrders];
        await updateDoc(userRef, { orders: updatedOrders });
  
        if (userData) {
          userData.orders = updatedOrders;
          console.log("Updated orders:", updatedOrders);
        }
      }
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };
  
  // Function that use itemsupdate for update the quantity of products 
  const updateDB = async () => {
    try {
      console.log("Updating database... : ", ItemsUpdate);
  
      // Wait for all updates to complete
      await Promise.all(
        ItemsUpdate.map(async (item: ItemsUpdate) => {
          const { docData, docRef } = item;
          console.log("Updating doc data:", docData);
          await updateDoc(docRef, docData);
        })
      );
  
      toast.success("Items updated successfully...");
    } catch (error) {
      console.error("Database update error:", error);
      toast.error("Failed to update database.");
    }
  };
  
  // call the get update fn asynchronusly
  const fetchAndupdate = async () => {
   
    if( cartItems ) {
      await getItemsUpdate();
    } else{
      console.log("Cart is empty");
      setError("cart is empty");
    }

  }

  fetchAndupdate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect( () => {
    if( success == true ){
      updateAll();
    }
  }, [success])

  const updateAll = async() => {

    await updateDB();
    await pushItems()
    dispatch( clearCart());
    console.log("cart is clear -> ", cartItems);
    router.push('/profile');
  }

  if (!mounted) {
    // Optionally, you can show a loading spinner here or a simple placeholder
    return <div>Loading...</div>;
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qnt * item.price,
    0
  );

  // check user details and if details are correct make the payment call
  const checkDetails = async () => {

    if( userData ){

      if( firstName?.trim() === "" )
      {
        toast.error("Name can't be empty");
        return;
      } else if( phone?.trim() === "" ){
        toast.error("Phone can't be empty");
        return;
      } else if( address?.trim() === "" ){
        toast.error("Address can't be empty");
        return;
      } else if( zipCode?.trim() === "" ){
        toast.error("Postal can't be empty");
        return;
      } else if( state?.trim() === "" ) {
        toast.error("State can't be empty");
        return;
      } else if( country?.trim() === "" ) {
        toast.error("County can't be empty");
        return;
      } else if( city?.trim() === "" ){
        toast.error("City can't be empty");
        return;
       }// else if ( landmark?.trim() === "" ){
      //   toast.error("LandMark can't be empty");
      //   return;
      // }

      await createOrder();

    } else{
      router.push("/login");
    }

  }

  /*const handleCheckout = async () => {
    const orderDetails = {
      order_id: Math.random().toString(10), // Random order ID
      order_date: new Date().toISOString(),

      billing_customer_name: `${firstName} `,
      billing_address: `${address}`,
      billing_city: `${city}`,
      billing_pincode: `${zipCode}`,
      billing_state: `${state}`, // Change as per user input
      billing_country: `${country}`, // Change as per user input
      billing_email: `${userData?.email}`,
      billing_phone: `${phone}`,
      shipping_is_billing: true, // Assuming shipping address is the same

      order_items: cartItems,
      payment_method: `${ payment === "cash" ? "COD" : "Online"}`,
      sub_total: subtotal+79, // Total price
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
  */

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
                  value={ country}
                  className="w-full bg-transparent focus:outline-none"
                  onChange={(e) => setCountry(e.target.value)}
                 
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
                onClick={checkDetails}
                className="border flex justify-center items-center  px-28 "
              >
                Place Order
              </Link>
            </div>
          </div>

          <div className="w-[30vw] xl:w-[30vw] lg:w-[30vw] md:w-[30vw] sm:w-[90vw] xs:w-[90vw] mt-10 text-[#7E7E7E]">
            <div>
              <p className="pb-2 border-b">Order summary </p>
              {cartItems.map((item) => {
                return (
                  <div
                    key={item.itemId}
                    className="flex text-sm justify-between my-5 "
                  >
                    <img src={item.image} className="h-20" />
                    <div className="w-[55%]">
                      <p className="tracking-wide leading-normal mb-2">
                      
                        {item.title} | Sway Clothing
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

            <div className="py-2 my-2 border-b-[1px] border-t-[1px]">
              <p className="flex justify-between" onClick={ () => setCouponOpen(!couponOpen)}>Apply coupon <GoChevronDown /> </p>
              {
                <div className={`my-1  ${couponOpen === true ? "" : "hidden"}`}>
                  <div className="flex mx-4">
                  <input
                    type="text"
                    id="coupon"
                    name="coupon"
                    value={couponCode} onChange={(e)=> setCouponCode(e.target.value)}
                    className={`bg-transparent p-2 border focus:outline-none ${ couponErr !== "" ? "border-red-500" :""}`}
                    placeholder="Enter Coupon Code"
                  />

                  <button className="p-2 ml-4 border" onClick={ couponHandler}>Apply</button>
                </div>

                <p className="text-red-700">{couponErr}</p>

                </div>
              }
            </div>

            <div>
              <p className="w-full  my-3 flex justify-between">
                <span>Subtotal</span>
                <span>₹{(subtotal )}</span>
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
