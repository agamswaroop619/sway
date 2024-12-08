"use client";

import {  MdOutlineShoppingBag } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store"; // Import the RootState type
import { Item } from "@/lib/features/items/items";
import { removeFromWishlist } from "@/lib/features/user/user";
import { firestore } from "../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { arrayRemove } from "firebase/firestore";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/features/carts/cartSlice";
import Link from "next/link";

const userInfo = (state: RootState) => state.user.userProfile;
const itemsData = (state: RootState) => state.items.itemsData;
const cartItem = (state: RootState) => state.cart.items;

const WishlistPage = () => {

  const dispatch = useAppDispatch();

  const wishlist = useAppSelector(userInfo)?.wishlist;
  const allItems = useAppSelector(itemsData);
  const userData = useAppSelector(userInfo);
  const cart = useAppSelector(cartItem);

  const [products, setProducts] = useState<Item[]>([]);


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
    <div className="m-10">

     <div className="flex flex-col justify-between">
     {products.map((item) => {
        return (
         <Link key={item.id} href={`/products/${item.id}`} >
          <div    className="flex gap-6 mb-4 w-[70vw]  pb-2 border-b-2 ">
            <img
              className="w-36"
              alt={`${item.title} image`}
              src={item.images[0].url}
            />
            <div>
              <p className="text-lg  font-semibold flex justify-between items-center"> 
                {item.title} 
                
                <RxCross1 onClick={ () => removeHandler(item.id)} /> 
                </p>
              <p className="text-gray-500">
               
                <span className="line-through mr-3">
                 
                ₹{item.price + 300}
                </span>
                ₹{item.price}
              </p>
              <p> {item.review} ⭐ </p>
              <p className="">
                
                {item.description.length > 120
                  ? item.description.substring(0, 120) + `...`
                  : item.description.substring(0, 120)}
              </p>
             
             <button className="p-2 rounded-md border mt-2 flex gap-2 items-center" onClick={ () => cartHandler(item)}>
              < MdOutlineShoppingBag  /> Add to Cart
             </button>

            </div>
          </div>
         </Link>
        );
      })}
     </div>
    </div>
  );
};

export default WishlistPage;
