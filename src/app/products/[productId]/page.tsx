"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store"; // Import the RootState type
import { addToCart } from "@/lib/features/carts/cartSlice";
import { useRouter } from "next/navigation";
import { addToCartWishlist } from "@/lib/features/wishlist/wishlist";
import toast from "react-hot-toast";
import {
  itemsDataInCart,
  updateReview,
  Item,
  setItemsData,
} from "@/lib/features/items/items";
import { getData } from "@/app/utils/getData";
import { StarRating } from "@/app/components/Rating";
import Link from "next/link";
import { StarRating2 } from "@/app/components/Rating";
import { generateUniqueString } from "@/app/utils/uniqueStringGenerator";
import { firestore } from "@/app/firebase.config";
import { updateDoc, doc } from "firebase/firestore";

const selectCartItems = (state: RootState) => state.cart.items;

const ProductDetails = () => {
  const [data, setData] = useState<Item[] | null>(null);
  const dataFromCart = useAppSelector(itemsDataInCart); // Ensure `data` is used or handled properly
  // You may want to log `data` if necessary for debugging:

  const userData = useAppSelector((state: RootState) => state.user.userProfile);

  const [num, setNum] = useState(1);
  const [info, setInfo] = useState(0);
  const [itemdata, setItemdata] = useState<Item | null>(null); // Start as null
  const [itemInCart, setItemInCart] = useState(false);
  const [itemInWishlist, setItemInWishlist] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>("");
  const [itemSize, setItemSize] = useState("");
  const [reviews, setReviews] = useState(0);

  const [reviewMessage, setReviewMessage] = useState("");

  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Set initial data using useAppSelector
  useEffect(() => {
    if (dataFromCart && dataFromCart.length > 0) {
      setData(dataFromCart);
    } else {
      setData(null); // Ensure data is set to null if there's no cart data
    }
  }, [dataFromCart]);

  // Handle data fetching if not available
  useEffect(() => {
    if (!data) {
      getData()
        .then((fetchedData) => {
          if (fetchedData && fetchedData.length > 0) {
            dispatch(setItemsData(fetchedData)); // Dispatch to Redux state
            setData(fetchedData); // Update local state
          } else {
            dispatch(setItemsData([])); // Dispatch empty data in case of no results
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          dispatch(setItemsData([])); // Handle error by dispatching empty array
        });
    }
  }, [data, dispatch]);

  // Fetch cart items from Redux store
  const itemsFromStore = useAppSelector(selectCartItems);
  const cartItems = itemsFromStore;

  useEffect(() => {
    console.log("Item data : ", itemdata);
  }, [itemdata]);

  const addHandler = (product: Item) => {
    if (itemSize === "") {
      toast.error("Plz select a size");
      return;
    }

    const itemId = Number(product.id);
    const qnt = num;
    const price = product.price;
    const title = product.title;
    const image = product.images[0].url;
    const size = itemSize;
    const docId = product.docId;

    const cartItem = { itemId, qnt, price, title, image, size, docId };

    dispatch(addToCart(cartItem));
    setItemInCart(true);
  };

  const cartItemHandler = () => {
    router.push("/cart");
  };

  const params = useParams();
  const id = params.productId;
  const numberId = Number(id);

  const incHandler = () => {
    if (!itemdata) return;

    if (itemSize === "") {
      setNum(num + 1);
    } else {
      const small = itemdata?.quantity[0] || 5;
      const medium = itemdata?.quantity[1] || 5;
      const large = itemdata?.quantity[2] || 5;
      const xl = itemdata?.quantity[3] || 4;
      const xxl = itemdata?.quantity[4] || 4;

      if (itemSize === "Small") {
        if (num < small) setNum(num + 1);
        else {
          setNum(small);
          toast.error(`Maximum product reached`);
        }
      } else if (itemSize === "Medium") {
        if (num < medium) setNum(num + 1);
        else {
          setNum(medium);
          toast.error(`Maximum product reached`);
        }
      } else if (itemSize === "Large") {
        if (num < large) setNum(num + 1);
        else {
          setNum(large);
          toast.error(`Maximum product reached`);
        }
      } else if (itemSize === "XL") {
        if (num < xl) setNum(num + 1);
        else {
          setNum(xl);
          toast.error(`Maximum product reached`);
        }
      } else if (itemSize === "XXL") {
        if (num < xxl) setNum(num + 1);
        else {
          setNum(xxl);
          toast.error(`Maximum product reached`);
        }
      } else {
        toast.error(`Maximum product reached`);
      }
    }
  };

  const decHandler = () => {
    if (num > 1) setNum(num - 1); // Prevent decrementing below 1
  };

  const clickHandler = (value: number) => {
    setInfo(value);
  };

  const addToWishlistHandler = (product: Item) => {
    if (itemSize === "") {
      toast.error("Plz select a size");
      return;
    }

    const itemId = Number(product.id);
    const qnt = num;
    const price = product.price;
    const title = product.title;
    const image = product.images[0].url;
    const size = itemSize;
    const docId = product.docId;

    const cartItem = { itemId, qnt, price, title, image, size, docId };

    dispatch(addToCartWishlist(cartItem));
    setItemInWishlist(true);
  };

  const itemExists = (id: number) => {
    console.log("cart items:", cartItems);
    const res = cartItems.find((item) => item.itemId === id);

    console.log("res:", res);

    return res
      ? { exists: true, quantity: res.qnt }
      : { exists: false, quantity: 1 };
  };

  // Ensure scrolling starts at the top of the page
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }

    if (data && data.length > 0) {
      const productData =
        data.find((item): item is Item => Number(item.id) === numberId) || null;

      console.log("Product data : ", productData);

      setItemdata(productData);

      if (productData?.userReview && productData?.userReview?.length > 0) {
        setReviews(productData.review);
      }

      const { exists, quantity } = itemExists(numberId);
      setItemInCart(exists);
      setNum(quantity);
    }
  }, [numberId, data]); // Add `data` to dependencies

  useEffect(() => {
    setImgSrc(itemdata?.images[0].url);
  }, [itemdata]);

  const reviewHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userData) {
      if (itemdata && itemdata.userReview) {
        const totalReviewScore =
          itemdata.review * itemdata.userReview.length + rating;
        const updatedRating =
          totalReviewScore / (itemdata.userReview.length + 1);

        // Clamp the rating between 0 and 5
        let clampedRating = Math.max(0, Math.min(5, updatedRating));

        // Round the clamped rating to the nearest 0.5
        clampedRating = Math.round(clampedRating * 2) / 2;

        toast.success(`review calculated : ${clampedRating}`);

        const commentId = generateUniqueString(itemdata.title);

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Check if the current item's id matches the id from the action payload
        const time = new Date();
        const month = months[time.getMonth() - 1];
        const year = time.getFullYear();
        const day = time.getDate();
        const date = `${month} ${day}, ${year}`;

        const newReview = {
          itemId: itemdata.id,

          updatedRating: clampedRating,
          userId: userData.userId,
          userName: userData.name,
          commentId: commentId,
          userRating: rating,
          review: reviewMessage,
          createdAt: date,
        };

        dispatch(updateReview(newReview));

        const docRef = doc(firestore, "products", itemdata.docId);
        const userReviews = itemdata.userReview || []; // Ensure userReview is an array (empty if undefined)

        // Create a new array to avoid mutation of the original (frozen) array
        const updatedUserReviews = [...userReviews];

        // Add the new review at the beginning of the userReviews array
        updatedUserReviews.unshift({
          review: newReview.review,
          userRating: newReview.userRating,
          userId: newReview.userId,
          userName: newReview.userName,
          commentId: newReview.commentId,
          createdAt: newReview.createdAt,
        });

        try {
          const res = await updateDoc(docRef, {
            review: clampedRating, // Assuming review is an overall rating
            userReview: updatedUserReviews, // Use the updated userReviews array here
          });
          console.log("Review successfully updated:", res);
        } catch (error) {
          console.error("Error updating Firestore:", error);
          toast.error("Failed to update review in Firestore");
        }

        setReviewMessage("");
        setRating(0);
      } else {
        toast.error("itemdata is empty");
      }
    } else {
      toast.error("user is not logged in");
    }
  };

  // Ensure `itemdata` exists before rendering
  if (!itemdata) return <div>Loading...</div>;

  return (
    <div className="my-2 scroll-smooth">
      <div className="flex sm:flex-col xs:flex-col md:flex-row xl:flex-row lg:flex-row 2xl:flex-row justify-between">
        <div className="flex  sm:w-[100vw] xs:w-[100vw] sm:px-4 xs:px-4 md:flex-row lg:flex-row xl:flex-row sm:justify-center xs:justify-center w-[45vw] sm:flex-col-reverse xs:flex-col-reverse">
          {/* for small screens */}
          <div className="block lg:hidden md:hidden xl:hidden overflow-x-scroll no-scrollbar w-[100vw] xs:w-[100vw] sm:w-[120vw]">
            <div className="flex justify-between gap-[6px] h-28 w-[160vw]">
              {itemdata.images.map((card) => {
                return (
                  <div key={card.imgId} className=" w-[20vw]  h-28">
                    <img
                      src={card.url}
                      alt="product image"
                      className="xs:w-20 sm:w-20"
                      onClick={() => setImgSrc(card.url)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* for large screeens */}
          <div className="hidden mt-4 lg:block px-4 md:block xl:block  no-scrollbar overflow-y-scroll md:h-[60vh] lg:h-[100vh] h-[27vh] w-28">
            <div className="flex h-[80vh] gap-y-4 flex-col ">
              {itemdata.images.map((card) => {
                return (
                  <div key={card.imgId} className={`w-20  `}>
                    <img
                      src={card.url}
                      alt="product image"
                      className={`w-14 ${imgSrc === card.url ? "border" : ""}`}
                      onClick={() => setImgSrc(card.url)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:w-[95%]  overflow-hidden lg:w-[95%] xl:w-[80%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 ">
            <img className="w-[100%] " src={imgSrc} alt="product" />
          </div>
        </div>

        {/* info */}
        <div className="md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 pr-8 tracking-wider">
          <h3 className="text-2xl ">
            {itemdata.title} | Oversized-T-shirt | Sway Clothing
          </h3>
          <h3 className="text-2xl text-gray-500 my-2">₹{itemdata.price}.00</h3>

          <div className="flex gap-4 my-2">
            {itemdata.review > 0 && (
              // Calculate the average rating from the user reviews
              <StarRating rating={reviews} />
            )}

            {itemdata.review > 0 && (
              <Link href="#reviews" onClick={() => setInfo(2)}>
                <span> ({itemdata.userReview?.length} reviews ) </span>
              </Link>
            )}
          </div>

          <div className="flex gap-2  mb-3">
            {" "}
            <h3>Size :</h3> {itemSize}{" "}
          </div>
          <div className="flex w-full gap-2 my-2">
            <div onClick={() => setItemSize("Small")}>
              <input
                id="s"
                name="size"
                className="appearance-none"
                type="radio"
              />
              <label
                htmlFor="s"
                className={`${
                  itemSize === "Small"
                    ? "bg-white text-black  transition-colors duration-500 ease"
                    : ""
                } border p-2 rounded-md `}
              >
                Small
              </label>
            </div>

            <div onClick={() => setItemSize("Medium")}>
              <input
                id="m"
                name="size"
                className="appearance-none"
                type="radio"
              />
              <label
                htmlFor="m"
                className={`${
                  itemSize === "Medium"
                    ? "bg-white text-black  transition-colors duration-500 ease"
                    : ""
                }
            ml-2 border p-2 rounded-md `}
              >
                Medium
              </label>
            </div>

            <div onClick={() => setItemSize("Large")}>
              <input
                id="l"
                name="size"
                className="appearance-none"
                type="radio"
              />
              <label
                htmlFor="l"
                className={`${
                  itemSize === "Large"
                    ? "bg-white text-black  transition-colors duration-500 ease"
                    : ""
                }
            ml-2 border p-2 rounded-md `}
              >
                Large
              </label>
            </div>

            <div onClick={() => setItemSize("XL")}>
              <input
                id="xl"
                name="size"
                className="appearance-none"
                type="radio"
              />
              <label
                htmlFor="xl"
                className={`${
                  itemSize === "XL"
                    ? "bg-white text-black  transition-colors duration-500 ease"
                    : ""
                }
            ml-2 border p-2 rounded-md `}
              >
                XL
              </label>
            </div>

            <div onClick={() => setItemSize("XXL")}>
              <input
                id="xxl"
                name="size"
                className="appearance-none"
                type="radio"
              />
              <label
                htmlFor="xxl"
                className={`${
                  itemSize === "XXL"
                    ? "bg-white text-black  transition-colors duration-500 ease"
                    : ""
                }
            ml-2 border p-2 rounded-md `}
              >
                XXL
              </label>
            </div>
          </div>

         

          <div className="flex md:flex-col lg:flex-row xl:flex-row w-full gap-5 sm:flex-col xs:flex-col ">
            <div className="bg-gray-600 justify-center w-[250px] flex items-center h-[50px]  rounded-l-full rounded-r-full py-2 my-3">
              <button
                className=" px-4 text-xl  w-[33%]  text-center border-r-2 disabled:opacity-55"
                disabled={num < 2}
                onClick={decHandler}
              >
                {" "}
                -{" "}
              </button>
              <span className=" w-[33%] grow text-center  ">{num}</span>
              <button
                className="border-l-2 text-center w-[33%]  disabled:opacity-55 "
                onClick={incHandler}
              >
                {" "}
                +{" "}
              </button>
            </div>

            <div className="flex gap-5 md:mb-4 sm:mb-4 xs:mb-4">
              {!itemInCart && (
                <button
                  onClick={() => addHandler(itemdata)}
                  className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
                  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
                  relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
                  hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
                  before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
                   before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
                   before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                    text-[#fff]"
                >
                  {" "}
                  Add to cart{" "}
                </button>
              )}

              {itemInCart && (
                <button
                  onClick={cartItemHandler}
                  className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
                  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
                  relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
                  hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
                  before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
                   before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
                   before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                    text-[#fff]"
                >
                  {" "}
                  View Cart{" "}
                </button>
              )}

              {!itemInWishlist && (
                <button
                  onClick={() => addToWishlistHandler(itemdata)}
                  className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
              h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
              relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
              hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
              before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
               before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
               before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                text-[#fff]"
                >
                  {" "}
                  Add to Wishlist{" "}
                </button>
              )}

              {itemInWishlist && (
                <button
                  onClick={() => addToWishlistHandler(itemdata)}
                  className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
                  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
                  relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
                  hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
                  before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
                   before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
                   before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                    text-[#fff]"
                >
                  {" "}
                  Wishlisted{" "}
                </button>
              )}
            </div>
          </div>

          <p>Category: Streetwear</p>
          <p>SKU : </p>
        </div>
      </div>

      <div className="lg:m-10 w-[90vw] lg:p-10">
        <div className="flex sm:gap-y-2 xs:gap-y-2 lg:flex-row xl:flex-row md:flex-row sm:flex-col xs:flex-col justify-around p-8">
          <span
            className={`text-xl cursor-pointer transition-colors hover:text-white duration-400 ease-in-out hover:scale-110 ${ info === 0 ? "text-white" : "text-[#7e7e7e]"} ` }
            onClick={() => clickHandler(0)}
          >
            Description
          </span>
          <span
            className={`text-xl cursor-pointer transition-colors hover:text-white duration-400 ease-in-out hover:scale-110 ${ info === 1 ? "text-white" : "text-[#7e7e7e]"} ` }
            onClick={() => clickHandler(1)}
          >
            Additional information
          </span>

          <span
            className={`text-xl flex cursor-pointer transition-colors hover:text-white duration-400 ease-in-out hover:scale-110 ${ info === 2 ? "text-white" : "text-[#7e7e7e]"} ` }
            onClick={() => clickHandler(2)}
          >
            Reviews
            {itemdata.review > 0 && (
              <span className="mx-1"> ({itemdata.userReview?.length}) </span>
            )}
          </span>
        </div>

        <div className=" w-full">
          {info === 0 && (
            <div className="flex flex-col w-full" id="desc">
              <div className="flex items-center px-10 md:flex-row lg:flex-row xl:flex-row sm:flex-col xs:flex-col  gap-10 justify-between">
                <img
                  loading="lazy"
                  src={itemdata.descImg}
                  className="h-[50vh] "
                  alt="description image"
                />
                <p className=" text-[#7e7e7e]"> {itemdata.description} </p>
              </div>

              <div className="p-10 text-[#7e7e7e]">
                Description:
                <br />
                1. Weight: 200 GSM
                <br />
                2. Composition: Mid-Weight Cotton
                <br />
                MADE IN INDIA
              </div>
            </div>
          )}

          {info === 1 && (
            <div id="additional"> Additional information content</div>
          )}
          {info === 2 && (
            <div id="reviews">
              {itemdata &&
                itemdata?.userReview?.map((item, index) => {
                  {
                    return (
                      <div key={index} className="py-3 border-t-2">
                        <div className="flex mb-2 items-center text-gray-500 gap-4 hover:text-white transition-colors duration-300 ease">
                          <img
                            className="h-10 rounded-full"
                            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1732460742/user_icons_pyq4vy.jpg"
                            alt="user icon"
                          />

                          {item.userName}

                          <StarRating rating={Number(item.userRating)} />
                        </div>
                        <p> {item.review} </p>
                      </div>
                    );
                  }
                })}

              <form className="my-6">
                <p className="mb-2 w-full">
                  Your Rating <sup className="text-red-500">*</sup>
                </p>
                <StarRating2
                  rating={rating}
                  onRatingChange={handleRatingChange}
                />

                <p className="mt-4">
                  Write Review <sup className="text-red-500">*</sup>
                </p>
                <textarea
                  id="review"
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  className="w-full h-36 focus:outline-none p-2 border-2 my-1 border-gray-400 text-black rounded-md"
                />

                <button
                  onClick={reviewHandler}
                  className="border p-3 my-2 rounded-full"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
