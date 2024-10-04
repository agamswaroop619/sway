'use client';

import Link from 'next/link';
import { MdOutlineDeleteForever,  MdOutlineShoppingBag } from "react-icons/md";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';  // Import the RootState type
import { removeFromWishlist } from '@/lib/features/wishlist/wishlist';
import { Products} from "@/lib/features/carts/cartSlice";

const selectWishlistItems = (state: RootState) => state.wishlist.items;

const WishlistPage = () => {

  const [wishlistItems, setWishlistItems] = useState<Products[]>([]);  // Initialize with empty array

  const dispatch = useAppDispatch();

  // Fetch cart items from Redux store
  const itemsFromStore = useAppSelector(selectWishlistItems);

  useEffect(() => {
    setWishlistItems(itemsFromStore || []);  // Ensure cartItems is always an array
  }, [itemsFromStore]);  // Update only when itemsFromStore changes

  const router = useRouter();

  // const handleQuantityClick = (item: any) => {
  //   // This function will be called when the quantity button is clicked
  //   console.log("item : ",item);
  // };

  const handleRemoveItem = (id: number) => {
    // This function will be called when the remove item button is clicked
    dispatch(removeFromWishlist(id));
  };


  return (
    <div className='lg:px-10 sm:p-4 xs:p-3 md:p-6 xl:p-8 flex justify-center w-full'>
      {wishlistItems.length > 0 ? (
      <div className=" md:w-[70vw] lg:w-[60vw] ">

        {wishlistItems.map((item: Products) => (
          <div key={item.itemId} className=" my-2 flex border  w-full hover:cursor-pointer">
            <img src={item.image} className="xs:w-32 h-36 lg:h-44 xl:44 sm:36 lg:40 lg:w-44 xl:w-48" alt={item.title} onClick={() => router.push(`/products/${item.itemId}`)} />
            <div className="p-4 w-full">
              <div className="flex-row  w-full py-1 justify-between">
              <p className="font-semibold text-xl">{item.title}</p>
              <span>₹{Math.ceil(item.price)}</span>
               </div>
              
             <p>5 Left in Stock</p>
             <p className='border p-2 my-1 w-32'>SAVE ₹300.00 </p>
             <p>Size : Medium</p>

            

          <span className=" flex items-center gap-1 pb-1 underline" onClick={ () => handleRemoveItem(item.itemId)}  > <MdOutlineDeleteForever/>  Remove from Wishlistt </span>
          <span className=" flex items-center gap-1 pb-1 underline"> <MdOutlineShoppingBag /> Add to Cart</span>
              
            </div>
          </div>
        ))}
 
    </div>
      ) 

      :

      (
        <div className='flex flex-col w-full h-screen justify-center items-center'> 
          <h1 className="text-3xl my-2 font-bold text-white">Your Cart is
            Empty</h1>

          <Link href="/products" className='border p-2 rounded-md' >Add items</Link>

        </div>
      )
}
     </div>
  )
};

export default WishlistPage;
