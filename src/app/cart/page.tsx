"use client";

import Link from "next/link";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  removeFromCart,
  selectCartItems,
  updateQnt,
} from "@/lib/features/carts/cartSlice";
import { itemsDataInCart, setItemsData } from "@/lib/features/items/items";
import {
  setItems,
  removeCheckoutItem,
  clearCheckout,
  selectCheckoutItems,
} from "@/lib/features/checkout/checkout";
import { GoChevronDown } from "react-icons/go";
import { getData } from "../utils/getData";

interface cartItems {
  itemId: number;
  qnt: number;
  price: number;
  title: string;
  image: string;
  size: string;
  docId: string;
  stock: number; // stock should always be a number
}

const CartPage = () => {
  const [couponErr, setCouponErr] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const couponHandler = () => {
    if (couponCode === "") {
      setCouponErr("Please enter a valid coupon code");
    } else setCouponErr("Invalid Coupon Code");

    return;
  };

  const dispatch = useAppDispatch();

  // Fetch cart items from Redux store
  const itemsFromStore = useAppSelector(selectCartItems);
  const allItems = useAppSelector(itemsDataInCart) || [];
  const cartItems = useAppSelector(selectCheckoutItems);

  const [outOfStock, setOutOfStock] = useState<cartItems[]>([]);

  useEffect(() => {
    if (allItems.length === 0) {
      getData()
        .then((fetchedData) => {
          if (allItems.length === 0) dispatch(setItemsData(fetchedData || []));
        })
        .catch((error) => {
          // console.error("Error fetching data:", error);
          if (error instanceof Error) {
            console.error("");
          }
          dispatch(setItemsData([]));
        });
    }
  }, [dispatch, allItems.length]);

  useEffect(() => {
    if (allItems.length > 0) {
      const carts: cartItems[] = [];
      const out: cartItems[] = [];

      dispatch(clearCheckout());
      //console.log("at the starting phase");

      itemsFromStore.forEach((item) => {
        const itemData = allItems?.find(
          (card) => Number(card.id) === item.itemId
        ); // changed filter to find
        let stock = 0;

        if (itemData) {
          switch (item.size) {
            case "Small":
              stock = itemData.quantity[0] - item.qnt;
              break;
            case "Medium":
              stock = itemData.quantity[1] - item.qnt;
              break;
            case "Large":
              stock = itemData.quantity[2] - item.qnt;
              break;
            case "XL":
              stock = itemData.quantity[3] - item.qnt;
              break;
            case "XXL":
              stock = itemData.quantity[4] - item.qnt;
              break;
            default:
              stock = -1;
              break;
          }

          const data = {
            itemId: item.itemId,
            qnt: item.qnt,
            price: item.price,
            title: item.title,
            image: item.image,
            size: item.size,
            docId: item.docId,
            stock: stock,
          };

          if (stock >= 0) {
            carts.push(data);
          } else {
            out.push(data);
          }
        }
      });

      dispatch(setItems(carts));
      setOutOfStock(out);
    }
  }, [itemsFromStore, allItems]); // Dependencies

  const incHandler = (itemId: number, quantity: number) => {
    const item = cartItems?.find((card) => card.itemId === itemId);
    if (item && Math.abs(item.stock - quantity) > 0) {
      const updatedItem = { ...item, qnt: item.qnt + 1, stock: item.stock - 1 };
      const qnt: number = updatedItem.qnt;
      // dispatch(incQnt(updatedItem));
      dispatch(updateQnt({ itemId: itemId, quantity: qnt }));
    }
  };

  const router = useRouter();

  const handleRemoveItem = (id: number) => {
    // This function will be called when the remove item button is clicked
    dispatch(removeFromCart(id));
    dispatch(removeCheckoutItem(id));
  };

  const decHandler = (itemId: number, quantity: number) => {
    const num = quantity - 1;
    dispatch(updateQnt({ itemId: itemId, quantity: num }));
  };

  const total = cartItems
    ? cartItems.reduce((acc, item) => acc + item.price * item.qnt, 0)
    : 0;

  if (allItems.length > 0)
    return (
      <div className="relative bg-gradient-to-b from-black to-green-950 py-10 xs:py-15 sm:py-20 md:py-20 lg:py-20 xl:py-20">
        {itemsFromStore && itemsFromStore.length > 0 ? (
          <>
            <div className="cart-layout-responsive responsive-padding gap-6 lg:gap-8 xl:gap-10">
              {/* In-stock items */}
              <div className="cart-items-responsive">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 xs:p-6 sm:p-6 md:p-6 lg:p-8 xl:p-8 border border-gray-700">
                  <div className="flex justify-between pb-4 text-gray-400 border-b border-gray-700 mb-4">
                    <span className="font-semibold">Products</span>
                    <span className="font-semibold">Total</span>
                  </div>

                  <div className="space-y-4">
                    {cartItems &&
                      cartItems.map((item: cartItems) => (
                        <div
                          key={item.itemId}
                          className="flex flex-col xs:flex-row sm:flex-row border-b border-gray-700 pb-4 last:border-b-0"
                        >
                          <div className="flex-shrink-0 mb-4 xs:mb-0 sm:mb-0">
                            <img
                              src={item.image}
                              className="w-24 xs:w-32 sm:w-32 h-24 xs:h-32 sm:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                              alt={item.title}
                              onClick={() =>
                                router.push(`/products/${item.itemId}`)
                              }
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1 xs:ml-4 sm:ml-4">
                            <div className="flex flex-col xs:flex-row sm:flex-row xs:justify-between sm:justify-between mb-2">
                              <h3 className="text-white font-semibold text-lg xs:text-xl sm:text-xl mb-2 xs:mb-0 sm:mb-0">
                                {item.title} | Sway Clothing
                              </h3>
                              <p className="text-green-500 font-bold text-lg xs:text-xl sm:text-xl">
                                <span className="line-through mr-2 text-gray-500">
                                  ₹{Math.ceil(item.price + 300)}
                                </span>
                                <span>₹{Math.ceil(item.price)}</span>
                              </p>
                            </div>

                            <p className="text-gray-400 text-sm mb-2">
                              {item.stock} items left
                            </p>

                            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-2 mb-3 inline-block">
                              <span className="text-green-400 text-sm font-semibold">
                                SAVE ₹300.00
                              </span>
                            </div>

                            <p className="text-gray-300 mb-3">
                              Size:{" "}
                              <span className="text-white font-semibold">
                                {item.size}
                              </span>
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
                                <button
                                  className="px-4 py-2 text-xl w-12 text-center border-r border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-300"
                                  disabled={item.qnt < 2}
                                  onClick={() =>
                                    decHandler(item.itemId, item.qnt)
                                  }
                                >
                                  -
                                </button>
                                <span className="w-12 text-center py-2 bg-gray-800 text-white font-semibold">
                                  {item.qnt}
                                </span>
                                <button
                                  className="border-l border-gray-600 text-center w-12 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-300"
                                  onClick={() =>
                                    incHandler(item.itemId, item.qnt)
                                  }
                                  disabled={item.stock === 0}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors duration-300 underline text-sm"
                                onClick={() => handleRemoveItem(item.itemId)}
                              >
                                <MdOutlineDeleteForever className="text-lg" />
                                <span className="hidden xs:inline sm:inline">
                                  Remove
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Out of Stock Items */}
                {outOfStock.length > 0 && (
                  <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-lg p-4 xs:p-6 sm:p-6 md:p-6 lg:p-8 xl:p-8 border border-gray-700">
                    <h2 className="text-lg xs:text-xl sm:text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                      Out of Stock
                    </h2>
                    <div className="space-y-4">
                      {outOfStock.map((item: cartItems) => (
                        <div
                          key={item.itemId}
                          className="flex flex-col xs:flex-row sm:flex-row border-b border-gray-700 pb-4 last:border-b-0"
                        >
                          <div className="flex-shrink-0 mb-4 xs:mb-0 sm:mb-0">
                            <img
                              src={item.image}
                              className="w-24 xs:w-32 sm:w-32 h-24 xs:h-32 sm:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                              alt={item.title}
                              onClick={() =>
                                router.push(`/products/${item.itemId}`)
                              }
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1 xs:ml-4 sm:ml-4">
                            <div className="flex flex-col xs:flex-row sm:flex-row xs:justify-between sm:justify-between mb-2">
                              <h3 className="text-white font-semibold text-lg xs:text-xl sm:text-xl mb-2 xs:mb-0 sm:mb-0">
                                {item.title} | Sway Clothing
                              </h3>
                              <p className="text-green-500 font-bold text-lg xs:text-xl sm:text-xl">
                                ₹{Math.ceil(item.price)}
                              </p>
                            </div>

                            <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-2 mb-3 inline-block">
                              <span className="text-red-400 text-sm font-semibold">
                                Out of Stock
                              </span>
                            </div>

                            <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-2 mb-3 inline-block">
                              <span className="text-green-400 text-sm font-semibold">
                                SAVE ₹300.00
                              </span>
                            </div>

                            <p className="text-gray-300 mb-3">
                              Size:{" "}
                              <span className="text-white font-semibold">
                                {item.size}
                              </span>
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden opacity-50">
                                <button
                                  className="px-4 py-2 text-xl w-12 text-center border-r border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={item.qnt < 2}
                                  onClick={() =>
                                    decHandler(item.itemId, item.qnt)
                                  }
                                >
                                  -
                                </button>
                                <span className="w-12 text-center py-2 bg-gray-800 text-white font-semibold">
                                  {item.qnt}
                                </span>
                                <button
                                  className="border-l border-gray-600 text-center w-12 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() =>
                                    incHandler(item.itemId, item.qnt)
                                  }
                                  disabled={true}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors duration-300 underline text-sm"
                                onClick={() => handleRemoveItem(item.itemId)}
                              >
                                <MdOutlineDeleteForever className="text-lg" />
                                <span className="hidden xs:inline sm:inline">
                                  Remove
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart total section */}
              <div className="cart-summary-responsive">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 xs:p-6 sm:p-6 md:p-6 lg:p-6 xl:p-6 border border-gray-700 sticky top-20">
                  <h3 className="text-white font-semibold text-lg xs:text-xl sm:text-xl mb-4 border-b border-gray-700 pb-2">
                    CART TOTAL
                  </h3>

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
                      <span className="text-white font-semibold">
                        ₹{Math.floor(total)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-300">
                      <span>Discount on MRP</span>
                      <span className="text-green-500 font-semibold">
                        ₹{Math.floor(total * 0.3)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-300">
                      <div>
                        <span>Shipping</span>
                        <p className="text-xs text-gray-500">Free Shipping</p>
                      </div>
                      <span className="text-green-500 font-semibold">FREE</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-xl xs:text-2xl sm:text-2xl font-bold text-white border-t border-gray-700 pt-4 mb-6">
                    <span>Total Amount</span>
                    <span>₹{Math.floor(total)}</span>
                  </div>

                  <Link href="/checkout" className="block">
                    <button className="w-full bg-green-600 text-white py-3 xs:py-4 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 text-lg">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full justify-center items-center responsive-padding py-20">
            <div className="text-center">
              <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-bold text-white mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-400 mb-6 text-sm xs:text-base sm:text-base">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  else {
    return (
      /* From Uiverse.io by Fresnel11 */
      <div className="min-w-screen min-h-screen flex bg-slate-500 justify-center align-middle items-center">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }
};

export default CartPage;
