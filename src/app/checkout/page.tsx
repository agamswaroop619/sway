"use client";

import { useAppSelector } from "@/lib/hooks";
import Script from "next/script";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import toast from "react-hot-toast";
import { firestore } from "@/app/firebase.config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { clearCart } from "@/lib/features/carts/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { GoChevronDown } from "react-icons/go";
import { setUser } from "@/lib/features/user/user";
import {
  selectCheckoutItems,
  clearCheckout,
} from "@/lib/features/checkout/checkout";
import { Order } from "@/lib/features/user/user";
import { v4 as uuidv4 } from "uuid"; // For unique order ID
import { updateQntAtCart } from "@/lib/features/items/items";

const userInfo = (state: RootState) => state.user.userProfile;

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const CheckoutPage = () => {
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  // items that will be placed
  const cartItems = useAppSelector(selectCheckoutItems);

  // data of user
  const userData = useAppSelector(userInfo);

  if (!userData) {
    router.push("/login");
  }

  // Address field
  const [firstName, setFirstName] = useState(userData?.name || "");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(userData?.email || "");
  const [address, setAddress] = useState(userData?.delivery?.address || "");
  const [city, setCity] = useState(userData?.delivery?.city || "");
  const [state, setState] = useState(userData?.delivery?.state || "");
  const [zipCode, setZipCode] = useState(userData?.delivery?.postalCode || "");
  const [country, setCountry] = useState(userData?.delivery?.country || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [apartment, setApartment] = useState(
    userData?.delivery?.apartment || ""
  );

  // coupon Handler
  const [couponErr, setCouponErr] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // payment and shipping
  const [payment, setPayment] = useState("cash");
  const [shipping, setShipping] = useState("free");

  // success and error
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [ orderId , setOrderId ] = useState("");
  const [ shipmentId, setShipmentId ] = useState("");

  const subtotal = cartItems
    ? cartItems.reduce((acc, item) => acc + item.qnt * item.price, 0)
    : 0;

    const checkDetails = async () => {
      if (userData) {
        const requiredFields = {
          firstName,
          phone,
          address,
          zipCode,
          state,
          country,
          city,
        };
    
        for (const [key, value] of Object.entries(requiredFields)) {
          if (!value?.trim()) {
            toast.error(`${key.replace(/([A-Z])/g, ' $1')} can't be empty`);
            return;
          }
        }

        setSuccess(true);

        try {

          if( payment === "online") {
            await createOrder();
          }
          else{
            setSuccess(true);
          }

        } catch (error) {
          console.log("Something went wrong ", error);
        }
        
      }
    };
    
    useEffect(() => {
      if (success) {
        updateAll();
      }
    }, [success]);

    const updateAll = async () => {
      await updateDB();
      dispatch(clearCart());
      dispatch(clearCheckout());
    };
    

  // 1. Make paymeyt and verify
  //  2. Mark success true for update the database
  const createOrder = async () => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: (subtotal + 79) * 100 }),
      });
      const data = await res.json();

      const paymentData = {
        key: process.env.PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.id,
        prefill: {
          name: `${firstName}`,
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
              setSuccess(true);
            } else {
              toast.error("Something went wrong.");
              setError("SOmething went wrong at creating order for razorpay")
            }
          } catch (error) {
            console.error("Payment verification error:", error);
          }
        },
      };

      const payment = new window.Razorpay(paymentData);
      payment.open();
    } catch (error) {
      console.error("Order creation error:", error);
    }
  };


   // Function that use itemsupdate for update the database
  // 1. Push item of itemsUpdate in user order section
  // 2. Reduce the quantity of each item that placed for order
  const updateDB = async () => {
    const ref = {
      data: {
        docId: "demoId",
        id: 12000,
        title: "Test Item to prevent undefined",
        images: [],
        quantity: [8, 8, 8, 4, 4],
        price: 499.0,
        category: "",
        descImg: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1727074581/Take_The_High_Road_jm1cy3.jpg",
        color: "Black",
        review: 3.5,
      },
    };
    
    await handleCheckout();

    const newOrders: Order[] = [];
  
    if (cartItems) {
      try {
        // Process cart items
        await Promise.all(
          cartItems.map(async (item) => {
            const docRef = doc(firestore, "products", item.docId);
            const docData = await getDoc(docRef);
            const itemData = docData.exists() ? docData.data() : ref.data;
  
            switch (item.size) {
              case "Small":
                if (item.qnt > itemData.quantity[0]) {
                  throw new Error(`Quantity of ${item.title} exceeds available stock.`);
                }
                itemData.quantity[0] -= item.qnt;
                break;
              case "Medium":
                if (item.qnt > itemData.quantity[1]) {
                  throw new Error(`Quantity of ${item.title} exceeds available stock.`);
                }
                itemData.quantity[1] -= item.qnt;
                break;
              case "Large":
                if (item.qnt > itemData.quantity[2]) {
                  throw new Error(`Quantity of ${item.title} exceeds available stock.`);
                }
                itemData.quantity[2] -= item.qnt;
                break;
              case "XL":
                if (item.qnt > itemData.quantity[3]) {
                  throw new Error(`Quantity of ${item.title} exceeds available stock.`);
                }
                itemData.quantity[3] -= item.qnt;
                break;
              case "XXL":
                if (item.qnt > itemData.quantity[4]) {
                  throw new Error(`Quantity of ${item.title} exceeds available stock.`);
                }
                itemData.quantity[4] -= item.qnt;
                break;
            }
  
            // Update product stock in Firestore
            await updateDoc(docRef, { quantity: itemData.quantity });
      
            const itemId = item.itemId.toString();
            const quantity = itemData.quantity;
            const image= item.image;
            const title = item.title;
            const price= item.price;

            dispatch( updateQntAtCart({itemId, quantity}) )
  
            newOrders.push({ itemId, orderId, shipmentId, image, title, price});
          })
        );
  
        // Update user orders in Firestore
        const userRef = doc(firestore, "users", userData?.userId || "");
  
        if (userData) {
          const updatedOrders = [...newOrders, ...userData.orders];
          const ordersUpdateResult = await updateDoc(userRef, { orders: updatedOrders });
  
          // Ensure that user state in Redux is updated correctly
          const updatedUser = { ...userData, orders: updatedOrders };
          dispatch(setUser(updatedUser));
  
          console.log("Orders updated in Firestore: ", ordersUpdateResult);
          console.log("Updated orders: ", updatedOrders);
        }
      } catch (err) {
        console.error("Something went wrong at checkout: ", err);
      }
    }
  };


const handleCheckout = async () => {

  const shippingFee = 79;

  const orderDetails = {
    order_id: uuidv4(), // Unique order ID
    order_date: new Date().toISOString(),
    billing_customer_name: firstName,
    billing_last_name: "",
    billing_address: apartment || "N/A",
    billing_address_2: address || "N/A",
    billing_city: city || "N/A",
    billing_pincode: zipCode || "000000",
    billing_state: state || "N/A",
    billing_country: country || "N/A",
    billing_email: userData?.email || "N/A",
    billing_phone: phone || "N/A",
    shipping_is_billing: true,
    order_items: cartItems,
    payment_method: payment === "cash" ? "COD" : "Prepaid",
    sub_total: subtotal + shippingFee, // Use a variable for fees
    length: 35,
    breadth: 28,
    height: 10,
    weight: 0.2,
  };

  console.log("Order details:", orderDetails);

  try {
    const response = await fetch("/api/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderDetails }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setOrderId(orderDetails.order_id);

    if (data && data.shipmentId) {
      setShipmentId(data.shipment_id);
    } else {
      alert("Failed to retrieve shipment ID from response.");
    }

    console.log("Shiprocket response : ", response)

  } catch (error) {
    console.error("Checkout error:", error);
    alert("Failed to place the order. Please try again.");
  }
};
  
  const couponHandler = () => {
    if (couponCode === "") {
      setCouponErr("Please enter a valid coupon code");
    } else setCouponErr("Invalid Coupon Code");

    return;
  };

  

  if (!cartItems) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div>
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      {error === "" ? (
        <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row mx-7 justify-between">
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
                  value={country}
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
              {cartItems &&
                cartItems.map((item) => {
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
              <p
                className="flex justify-between"
                onClick={() => setCouponOpen(!couponOpen)}
              >
                Apply coupon <GoChevronDown />{" "}
              </p>
              {
                <div className={`my-1  ${couponOpen === true ? "" : "hidden"}`}>
                  <div className="flex mx-4">
                    <input
                      type="text"
                      id="coupon"
                      name="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className={`bg-transparent p-2 border focus:outline-none ${
                        couponErr !== "" ? "border-red-500" : ""
                      }`}
                      placeholder="Enter Coupon Code"
                    />

                    <button className="p-2 ml-4 border" onClick={couponHandler}>
                      Apply
                    </button>
                  </div>

                  <p className="text-red-700">{couponErr}</p>
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

      {success && (
        <div className="flex w-full h-full justify-center items-center">
          <p className="text-lg font-bold my-4">Order Placed Successfully</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

