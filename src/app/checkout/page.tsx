"use client";

import { useAppSelector } from "@/lib/hooks";
import Script from "next/script";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import toast from "react-hot-toast";
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
  // 1. fetch details from cartItems and store in orders
  // 2. fill the details
  // 3. validate details ( checkfield function )
  // 4. payment maker
  // 5. shiprocket call
  // 6. update db
  // 7. update local user orders

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [shipmentId, setShipmentId] = useState("");

  // 1.  items that will be placed
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

  // 2. data of user
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
  const [phone, setPhone] = useState(userData?.phone || "");
  const [apartment, setApartment] = useState(
    userData?.delivery?.apartment || ""
  );

  // payment and shipping
  const [payment, setPayment] = useState("online");
  const [shipping, setShipping] = useState("free");
  const shippingFee = 79;

  // success and error
  const [success, setSuccess] = useState(false);

  const generateOrderId = (): string => {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds
    const randomString = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
    return `${timestamp}-${randomString}`; // Format with user ID
  };

  const orderId = generateOrderId();

  const subtotal = cartItems
    ? cartItems.reduce((acc, item) => acc + item.qnt * item.price, 0)
    : 0;

  // 3. validation
  const requiredFields = {
    firstName,
    phone,
    address,
    zipCode,
    state,
    city,
    lastName,
    email,
    payment,
  };

  const checkDetails = async () => {
    // Validate required fields
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value?.trim()) {
        toast.error(`${key.replace(/([A-Z])/g, " $1")} can&apos;t be empty`);
        return;
      }
    }

    if (payment === "online") {
      await toast.promise(createOrder(), {
        loading: "Placing order",
        success: "Order placed successfully ✅✅",
        error: "Order placement failed ❌❌",
      });
    } else {
      const res = await toast.promise(handleCheckout(), {
        loading: "Placing order",
        success: "Order placed successfully ✅✅",
        error: "Order placement failed ❌❌",
      });
      if (res.status) {
        console.log("shipment id : ", shipmentId);
        setSuccess(true);
      }
    }
  };

  // 4. payment maker
  const createOrder = async () => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: subtotal * 100 }),
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
              const res = await handleCheckout();
              if (res.status) {
                setSuccess(true);
              }
            } else {
              throw new Error("Payment verification failed. Try again.");
            }
          } catch (err) {
            if (err instanceof Error) {
              console.error("");
            }
          }
        },
      };

      const paymentInstance = new window.Razorpay(paymentData);
      paymentInstance.open();
    } catch (err) {
      if (err instanceof Error) console.error("");
      throw new Error("Order is not created");
    }
  };

  // 5. shiprocket call
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
      billing_country: "India",
      billing_email: `${email}` || `${userData?.email}`,
      billing_phone: `${userData?.phone}` || `${phone}`,
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
      sub_total: payment === "cash" ? subtotal + shippingFee : subtotal,
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

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.details ||
            data.error ||
            "Order placement failed. Please check your details and try again."
        );
        return {
          shipment_id: "",
          status: "error",
          message: data.details || data.error || "Order placement failed.",
        };
      }

      console.log("res from shiprocket : ", data);
      setShipmentId(data.details.shipment_id);
      return {
        shipmentId,
        status: true,
        message: "order created successfully",
      };
    } catch (error) {
      toast.error("Order placement failed. Please try again later.");
      console.error("Checkout error:", error);
      return {
        shipment_id: "",
        status: false,
        message: "Failed to place the order.",
      };
    }
  };

  // 6. update db
  useEffect(() => {
    if (success) {
      updateAll();
    }
  }, [shipmentId]);

  const updateAll = async () => {
    try {
      const res = await fetch("/api/update-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems, userData, shipmentId }),
      });

      const data = await res.json();

      if (res?.ok) {
        dispatch(clearCart());
        dispatch(clearCheckout());
        dispatch(setOrder(data?.orders));
      }
    } catch (err) {
      if (err instanceof Error) console.error("");
      throw new Error("order is not created. something went wrong");
    }
  };

  if (!cartItems) {
    router.push("/cart");
  }

  // coupon Handler
  const [couponErr, setCouponErr] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const couponHandler = () => {
    if (couponCode === "") {
      setCouponErr("Please enter a valid coupon code");
    } else setCouponErr("Invalid Coupon Code");

    return;
  };

  return (
    <div className="relative bg-gradient-to-b from-black to-green-950 py-10 xs:py-15 sm:py-20 md:py-20 lg:py-20 xl:py-20">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      {!success && (
        <div className="checkout-layout-responsive responsive-padding gap-6 lg:gap-8 xl:gap-10">
          {/* Checkout Form */}
          <div className="checkout-form-responsive">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 xs:p-6 sm:p-6 md:p-6 lg:p-8 xl:p-8 border border-gray-700">
              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-xl xs:text-2xl sm:text-2xl font-semibold text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-400 text-sm xs:text-base sm:text-base mb-4">
                  We&apos;ll use this email to send you details and updates
                  about your order.
                </p>

                <div className="bg-white rounded-lg p-4 text-black">
                  <label className="text-gray-600 text-sm font-medium">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-transparent focus:outline-none text-lg mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center mt-4">
                  <input type="checkbox" id="exclusive" className="mr-3" />
                  <label
                    htmlFor="exclusive"
                    className="text-gray-400 text-sm xs:text-base sm:text-base"
                  >
                    I would like to receive exclusive emails with discounts and
                    product information
                  </label>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8">
                <h3 className="text-xl xs:text-2xl sm:text-2xl font-semibold text-white mb-2">
                  Shipping address
                </h3>
                <p className="text-gray-400 text-sm xs:text-base sm:text-base mb-4">
                  Enter the address where you want your order delivered.
                </p>

                <div className="responsive-grid-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 text-black">
                    <label className="text-gray-600 text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent focus:outline-none text-lg mt-1"
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 text-black">
                    <label className="text-gray-600 text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent focus:outline-none text-lg mt-1"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 text-black mb-4">
                  <label className="text-gray-600 text-sm font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none text-lg mt-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="bg-white rounded-lg p-4 text-black mb-4">
                  <label className="text-gray-600 text-sm font-medium">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none text-lg mt-1"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />
                </div>

                <div className="responsive-grid-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 text-black">
                    <label className="text-gray-600 text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent focus:outline-none text-lg mt-1"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 text-black">
                    <label className="text-gray-600 text-sm font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent focus:outline-none text-lg mt-1"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="responsive-grid-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-black">
                    <label className="text-gray-600 text-sm font-medium">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent focus:outline-none text-lg mt-1"
                      value={zipCode}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*$/.test(inputValue)) {
                          setZipCode(inputValue);
                        }
                      }}
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 text-black">
                    <label className="text-gray-600 text-sm font-medium">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent focus:outline-none text-lg mt-1"
                      value={phone}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d*$/.test(inputValue)) {
                          setPhone(inputValue);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Options */}
              <div className="mb-8">
                <h3 className="text-xl xs:text-2xl sm:text-2xl font-semibold text-white mb-4">
                  Shipping options
                </h3>

                <button
                  onClick={() => setShipping("free")}
                  className={`w-full p-4 rounded-lg flex justify-between items-center border transition-colors duration-300 ${
                    shipping === "free"
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={shipping === "free"}
                      readOnly
                      className="mr-3"
                    />
                    <span className="text-white font-medium">
                      Free Shipping
                    </span>
                  </label>
                  <span className="text-green-500 font-semibold">FREE</span>
                </button>
              </div>

              {/* Payment Options */}
              <div className="mb-8">
                <h3 className="text-xl xs:text-2xl sm:text-2xl font-semibold text-white mb-4">
                  Payment options
                </h3>

                <button
                  onClick={() => setPayment("cash")}
                  className={`w-full p-4 rounded-lg border transition-colors duration-300 mb-4 ${
                    payment === "cash"
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={payment === "cash"}
                      readOnly
                      className="mr-3"
                    />
                    <span className="text-white font-medium">
                      Cash on delivery
                    </span>
                  </label>
                  {payment === "cash" && (
                    <p className="text-gray-400 text-sm mt-2 ml-6">
                      Pay with cash upon delivery.
                    </p>
                  )}
                </button>

                <button
                  onClick={() => setPayment("online")}
                  className={`w-full p-4 rounded-lg border transition-colors duration-300 ${
                    payment === "online"
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={payment === "online"}
                      readOnly
                      className="mr-3"
                    />
                    <span className="text-white font-medium">
                      Pay by Razorpay
                    </span>
                  </label>
                  {payment === "online" && (
                    <p className="text-gray-400 text-sm mt-2 ml-6">
                      Pay securely by Credit or Debit card or Internet Banking
                      through Razorpay.
                    </p>
                  )}
                </button>
              </div>

              <p className="text-gray-400 text-sm xs:text-base sm:text-base mb-8">
                By proceeding with your purchase you agree to our Terms and
                Conditions and Privacy Policy
              </p>

              <div className="flex flex-col xs:flex-row sm:flex-row justify-between items-center gap-4">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <GoArrowLeft /> Return to cart
                </Link>
                <button
                  onClick={checkDetails}
                  className="bg-green-600 text-white px-6 xs:px-8 sm:px-10 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-responsive">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 xs:p-6 sm:p-6 md:p-6 lg:p-6 xl:p-6 border border-gray-700 sticky top-20">
              <h3 className="text-white font-semibold text-lg xs:text-xl sm:text-xl mb-4 border-b border-gray-700 pb-2">
                Order summary
              </h3>

              <div className="space-y-4 mb-6">
                {cartItems &&
                  cartItems.map((item) => (
                    <div key={item.itemId} className="flex gap-4">
                      <img
                        src={item.image}
                        className="w-16 xs:w-20 sm:w-20 h-16 xs:h-20 sm:h-20 object-cover rounded-lg"
                        loading="lazy"
                        alt={item.title}
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm xs:text-base sm:text-base mb-1 line-clamp-2">
                          {item.title} | Sway Clothing
                        </p>
                        <p className="text-gray-400 text-sm mb-2">
                          <span className="line-through">₹999</span>
                          <span className="text-green-500 ml-2">
                            ₹{item.price}
                          </span>
                        </p>
                        <div className="bg-green-600/20 border border-green-600/30 rounded px-2 py-1 inline-block">
                          <span className="text-green-400 text-xs font-semibold">
                            {item.stock} left in stock
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          Size: <span className="text-white">Medium</span>
                        </p>
                      </div>
                      <span className="text-white font-semibold text-lg">
                        ₹{item.price * item.qnt}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Coupon Section */}
              <div className="py-3 border-b border-gray-700 mb-4">
                <button
                  className="flex justify-between items-center w-full text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setCouponOpen(!couponOpen)}
                >
                  <span>Apply coupon</span>
                  <GoChevronDown
                    className={`transition-transform duration-300 ${
                      couponOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {couponOpen && (
                  <div className="mt-3 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="coupon"
                        name="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className={`flex-1 bg-gray-800 border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 ${
                          couponErr !== ""
                            ? "border-red-500"
                            : "border-gray-600"
                        }`}
                        placeholder="Enter Coupon Code"
                      />
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
                        onClick={couponHandler}
                      >
                        Apply
                      </button>
                    </div>
                    {couponErr && (
                      <p className="text-red-400 text-sm">{couponErr}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Delivery Charges</span>
                  <span className="text-green-500 font-semibold">₹0</span>
                </div>

                {payment === "cash" && (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-300">Convenience Fee</p>
                      <p className="text-xs text-gray-500">
                        Pay by UPI/Cards to waive off
                      </p>
                    </div>
                    <span className="text-white font-semibold">
                      ₹{shippingFee}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-300">
                  <div>
                    <span>Shipping</span>
                    <p className="text-xs text-gray-500">Free Shipping</p>
                  </div>
                  <span className="text-green-500 font-semibold">FREE</span>
                </div>
              </div>

              <div className="flex justify-between text-xl xs:text-2xl sm:text-2xl font-bold text-white border-t border-gray-700 pt-4">
                <span>Total</span>
                <span>₹{payment === "cash" ? subtotal + 79 : subtotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="flex justify-center items-center responsive-padding py-20">
          <div className="text-center">
            <div className="bg-green-600/20 border border-green-600/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-white mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-400 text-sm xs:text-base sm:text-base mb-6">
              Thank you for your purchase. You will receive an email
              confirmation shortly.
            </p>
            <Link
              href="/profile"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
            >
              View Orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
