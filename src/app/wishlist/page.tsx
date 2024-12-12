"use client";

import {  MdOutlineShoppingBag } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store"; // Import the RootState type
import { Item, setItemsData } from "@/lib/features/items/items";
import { removeFromWishlist  } from "@/lib/features/user/user";
import { firestore } from "../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { arrayRemove } from "firebase/firestore";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/features/carts/cartSlice";
import Link from "next/link";
import { getData } from "../utils/getData";

const userInfo = (state: RootState) => state.user.userProfile;
const itemsData = (state: RootState) => state.items.itemsData;
const cartItem = (state: RootState) => state.cart.items;

const WishlistPage = () => {

  const dispatch = useAppDispatch();
  const router = useRouter();

  const wishlist = useAppSelector(userInfo)?.wishlist;
  const allItems = useAppSelector(itemsData) || [];
  const userData = useAppSelector(userInfo);
  const cart = useAppSelector(cartItem);

  const [products, setProducts] = useState<Item[]>([]);

  useEffect(() => {
    if (allItems.length === 0) {
      getData()
        .then((fetchedData) => dispatch(setItemsData(fetchedData || [])))
        .catch((error) => {
          console.error("Error fetching data:", error);
          dispatch(setItemsData([]));
        });
    }
  }, [dispatch, allItems.length]);
  

  useEffect(() => {
    if (allItems?.length) {
      // Filter the items to get only those that are in the wishlist
      const items = allItems.filter((item) => wishlist?.includes(item.id));

      // Update the products state with the filtered items
      setProducts(items);
    }
  }, [wishlist, allItems]); // Ensure the effect runs when either wishlist or allItems change

  const removeHandler = async ( id: string ) => {

    dispatch ( removeFromWishlist(id) );

   try {
    
    if( userData ) {
      const userRef = doc(firestore, "users", userData.userId);
      await updateDoc(userRef, { wishlist: arrayRemove(id) });
    }

   } catch (error) {
    console.log("Something went wrong : ",error);
   }

  }

  const cartHandler = ( product: Item) => {

    const res = cart.find( (item) => item.itemId === Number(product.id));

    if( res ) {
      toast.error("item is already in cart");
    }
    else{
      
    const item = {
      itemId: Number(product.id),
      qnt: 1,
      price: product.price,
      title: product.title,
      image: product.images[0].url,
      size: "Small",
      docId: product.docId,
    }

    dispatch( addToCart(item));

    toast.success("added to cart")
    }


  }

  if( userData && userData.wishlist.length < 1 ) 
    return(
  
      <div className="flex flex-col w-full h-screen justify-center items-center">
      <h1 className="text-3xl my-2 font-bold text-white">Your Wishlist is Empty</h1>
      <Link href="/products" className="border p-2 rounded-md">
        Add items
      </Link>
    </div>
    )

  if( userData?.wishlist && userData.wishlist.length > 0 )
  return (
    <div className="my-2 mx-[10%]">

    <h2 className="text-lg pb-3 mb-8 border-b-2">Wishlist </h2>

     <div className="flex  flex-col justify-between">
     {products.map((item) => {
        return (
        
          <div key={item.id}   className="flex cursor-pointer gap-6 mb-4 md:w-[70vw] xs:w-[80vw] sm:w-[80vw] xs:mx-0 sm:mx-0 md:mx-[5%] pb-4 border-b ">
            <img
              className="w-36"
              alt={`${item.title} image`}
              src={item.images[0].url}
              onClick={() => router.push(`/products/${item.id}`)}
            />
            <div>
              <p  className="md:text-lg  xs:text-md font-semibold flex justify-between items-center"> 
                <span onClick={() => router.push(`/products/${item.id}`)}>{item.title} </span>
                
                <RxCross1 onClick={ () => removeHandler(item.id)} /> 
                </p>
              <p  onClick={() => router.push(`/products/${item.id}`)} className="text-gray-500">
               
                <span className="line-through mr-3">
                 
                ₹{item.price + 300}
                </span>
                ₹{item.price}
              </p>
              <p  onClick={() => router.push(`/products/${item.id}`)}> {item.review} ⭐ </p>
              <p  onClick={() => router.push(`/products/${item.id}`)} className="xs:hidden sm:hidden md:block">
                
                {item.description.length > 120
                  ? item.description.substring(0, 120) + `...`
                  : item.description.substring(0, 120)}
              </p>
             
             <button className="p-2 transition-all duration-500 ease-in-out hover:scale-105 hover:text-green-600 hover:border-green-700
              rounded-md border mt-2 flex gap-2 items-center" onClick={ () => cartHandler(item)}>
              < MdOutlineShoppingBag  /> Add to Cart
             </button>

            </div>
          </div>
        
        );
      })}
     </div>
    </div>
  );

  if( allItems.length < 1 ){
    return(
      <div className="min-w-screen min-h-screen flex justify-center items-center">
        <div
  className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
></div>
      </div>
    )
  }

};

export default WishlistPage;