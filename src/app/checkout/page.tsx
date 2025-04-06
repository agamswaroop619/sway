"use client";

import { useAppSelector } from "@/lib/hooks";
import Script from "next/script";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import toast from "react-hot-toast";
import { firestore } from "@/app/firebase.config";
import { doc, updateDoc, getDoc, writeBatch } from "firebase/firestore";
import { clearCart } from "@/lib/features/carts/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { GoChevronDown } from "react-icons/go";
import { setOrder } from "@/lib/features/user/user";
import {
  selectCheckoutItems,
  clearCheckout,
} from "@/lib/features/checkout/checkout";
import { Order } from "@/lib/features/user/user";
import { updateQntAtCart } from "@/lib/features/items/items";
import { getDate } from "../utils/getDate";

const userInfo = (state: RootState) => state.user.userProfile;

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface orderType {
  name: string;
  sku: string;
  units: number;
  selling_price: string;
  discount: string;
  tax: string;
  hsn: number;
}

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // items that will be placed
  const cartItems = useAppSelector(selectCheckoutItems);

  let orders: orderType[] | [] = [];

  // orders in json format
  if (cartItems) {
    orders = cartItems.map((item) => {
      return {
        name: `${item.title}`,
        sku: `${item.itemId}`,
        units: item.qnt,
        selling_price: `${item.price}`,
        discount: "",
        tax: "",
        hsn: 441122,
      };
    });
  }

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
  const [payment, setPayment] = useState("online");
  const [shipping, setShipping] = useState("free");
  const shippingFee = 79;

  // success and error
  const [success, setSuccess] = useState(false);

  const [orderPlaced, setorderPlaced] = useState(false);

  const generateOrderId = (): string => {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds
    const randomString = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
    return `${timestamp}-${randomString}`; // Format with user ID
  };

  const orderId = generateOrderId();

  const subtotal = cartItems
    ? cartItems.reduce((acc, item) => acc + item.qnt * item.price, 0)
    : 0;

  const handleCheckout = async () => {
    const orderDetails = {
      order_id: `${orderId}`, // Unique order ID
      order_date: `${getDate()}`,
      billing_customer_name: `${firstName}`,
      billing_last_name: `${lastName}`,
      billing_address: `${apartment}` || "N/A",
      billing_address_2: `${address}`,
      billing_city: `${city}`,
      billing_pincode: `${zipCode}`,
      billing_state: `${state}`,
      billing_country: `${country}`,
      billing_email: `${email}` || `${userData?.email}`,
      billing_phone: `${phone}`,
      shipping_is_billing: true,
      shipping_customer_name: "",
      shipping_last_name: "",
      shipping_address: "",
      shipping_address_2: "",
      shipping_city: "",
      shipping_pincode: "",
      shipping_country: "",
      shipping_state: "",
      shipping_email: "",
      shipping_phone: "",
      order_items: orders,
      payment_method: payment === "cash" ? "COD" : "Prepaid",
      shipping_charges: shippingFee,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: subtotal,
      length: 10,
      breadth: 15,
      height: 20,
      weight: 2.5,
    };

    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderDetails }),
      });

      console.log("Shiprocket responce : ", response);

      if (!response.ok) {
        return {
          shipment_id: "",
          status: "error",
          message: `Failed to place the order.`,
        };
      }

      const data = await response.json();
      console.log("Shiprocket data : ", data);

      const shipmentId = data.shipment_id;
      return {
        shipment_id: shipmentId,
        status: "ok",
        message: "order created successfully",
      };
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place the order. Please try again.");
      return {
        shipment_id: "",
        status: "error",
        message: "Failed to place the order.",
      };
    }
  };

  const updateDB = async () => {
    const { shipment_id, status, message } = await handleCheckout();

    if (status === "error") {
      // toast.error("order is not cretaed")
      return { status: "error", message };
    }

    const shipmentId = shipment_id;

    const newOrders: Order[] = [];
    const batch = writeBatch(firestore);

    if (cartItems) {
      try {
        // Process cart items
        await Promise.all(
          cartItems.map(async (item) => {
            const docRef = doc(firestore, "products", item.docId);
            const docData = await getDoc(docRef);
            const itemData = docData.exists() ? docData.data() : {};

            // Reduce quantity based on size
            const sizeIndex = ["Small", "Medium", "Large", "XL", "XXL"].indexOf(
              item.size
            );
            if (sizeIndex === -1 || item.qnt > itemData.quantity[sizeIndex]) {
              throw new Error(`Insufficient stock for ${item.title}`);
            }

            itemData.quantity[sizeIndex] -= item.qnt;
            batch.update(docRef, { quantity: itemData.quantity });

            const itemId = item.itemId.toString();
            const image = item.image;
            const title = item.title;
            const price = item.price;

            // update items quantity after placing order
            const quantity = itemData.quantity;

            dispatch(updateQntAtCart({ itemId, quantity }));
            console.log(updateQntAtCart);
            newOrders.push({
              itemId,
              shipmentId,
              image,
              title,
              price,
            });
          })
        );

        // Update user orders in Firestore
        const userRef = doc(firestore, "users", userData?.userId || "");

        if (userData && userRef) {
          const updatedOrders = [...newOrders, ...userData.orders];
          await updateDoc(userRef, { orders: updatedOrders });

          // Ensure that user state in Redux is updated correctly
          // const updatedUser = { ...userData, orders: updatedOrders };
          //dispatch(setUser(updatedUser));
          dispatch(setOrder(updatedOrders));

          //console.log("Orders updated in Firestore: ", ordersUpdateResult);
          console.log("Updated orders: ", updatedOrders);
        }

        return { status: "ok", message: "Order placed successfully" };
      } catch (err) {
        console.error("Something went wrong at checkout: ", err);
        return { status: "error", message: "Failed to create order" };
      }
    }

    return { status: "ok", message };
  };

  const requiredFields = {
    firstName,
    phone,
    address,
    zipCode,
    state,
    country,
    city,
    lastName,
    email,
    payment,
  };

  const checkDetails = async () => {
    // Validate required fields
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value?.trim()) {
        toast.error(`${key.replace(/([A-Z])/g, " $1")} can't be empty`);
        return;
      }
    }

    if (payment === "online") {
      await createOrder();
    } else {
      setSuccess(true);
    }
  };

  useEffect(() => {
    if (success) {
      updateAll();
    }
  }, [success]);

  const createOrder = async () => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: (subtotal + shippingFee) * 100 }),
      });

      if (!res.ok) {
        throw new Error(`Failed to create order. Status: ${res.status}`);
      }

      const data = await res.json();

      const paymentData = {
        key: process.env.PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.id,
        prefill: {
          name: firstName,
          contact: phone,
        },
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error(
                `Payment verification failed. Status: ${verifyRes.status}`
              );
            }

            const verificationData = await verifyRes.json();
            if (verificationData.isOk) {
              setSuccess(true);
            } else {
              throw new Error("Payment verification failed. Try again.");
            }
          } catch (err) {
            //if(err instanceof Error)
            // toast.error(err.message);
            if (err instanceof Error) {
              console.error("");
            }
          }
        },
      };

      const paymentInstance = new window.Razorpay(paymentData);
      paymentInstance.open();
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Order creation error: ${err.message}`);
      throw new Error("Order is not created");
    }
  };

  const updateAll = async () => {
    try {
      const result = await updateDB();

      if (result.status === "ok") {
        dispatch(clearCart());
        dispatch(clearCheckout());
        setorderPlaced(true);
        toast.success("Order placed successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      throw new Error("order is not created. something went wrong");
    }

    console.log("at the end : ", cartItems);
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
    <div className=" bg-gradient-to-b from-black to-green-950">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      {!orderPlaced && (
        <div className="flex sm:flex-col-reverse xs:flex-col-reverse md:flex-row lg:flex-row xl:flex-row mx-7 justify-between">
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
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Allow only digits using a regular expression
                      if (/^\d*$/.test(inputValue)) {
                        setZipCode(inputValue);
                      }
                    }}
                  />
                </div>
                <div className="bg-white w-[49%] rounded-md px-2 text-black">
                  <span className="text-[#7E7E7E]">Phone</span>
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none"
                    value={phone}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Allow only digits using a regular expression
                      if (/^\d*$/.test(inputValue)) {
                        setPhone(inputValue);
                      }
                    }}
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
                    <span className="xs:hidden sm:hidden md:block lg:block xl:block">
                      Pay with cash upon delivery.
                    </span>
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
                    <span className="xs:hidden sm:hidden md:block lg:block xl:block">
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
                className="border flex justify-center items-center  lg:px-28 md:px-20 xs:px-10 sm: px-10"
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
                      <img src={item.image} className="h-20" loading="lazy" />
                      <div className="w-[55%]">
                        <p className="tracking-wide leading-normal mb-2">
                          {item.title} | Sway Clothing
                        </p>
                        <p>
                          <span className="line-through ">₹999</span>
                          <span> ₹{item.price}</span>
                        </p>
                        <p className="p-2 border rounded-md my-2 w-28">
                          {item.stock} left in stock
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
                <span>Delivery Charges</span>
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
      )}

      {orderPlaced && (
        <div className="flex min-h-screen min-w-screen h-full justify-center items-center  bg-gradient-to-b from-black to-green-900">
          <p className="text-lg font-bold my-4">Order Placed Successfully</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
