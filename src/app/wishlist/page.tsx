'use client';

import Link from 'next/link';
import { MdOutlineClear } from "react-icons/md";
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
    <div>
      {wishlistItems.length > 0 ? (
      <div className="px-10 sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row flex justify-between w-full items-start">
        <div className="px-5 md:w-7/12 lg:w-7/12 xl:w-7/12 sm:w-full xs:w-full">
          {wishlistItems.map((item: Products) => (
            <div key={item.itemId} className="h-60 my-2 flex border  w-full hover:cursor-pointer">
              <img src={item.image} className="h-full" alt={item.title} onClick={() => router.push(`/products/${item.itemId}`)} />
              <div className="p-4 w-full">
                <div className="flex w-full py-1 justify-between">
                <p className="font-semibold">{item.title}</p>
                <span className=" text-2xl pb-1" onClick={() => handleRemoveItem(item.itemId)} > <MdOutlineClear/> </span>
                 </div>
                <p className="text-gray-600 py-1">This striking black shirt features the bold phrase Break Rules  + `...` </p>
               
                <p>₹{Math.ceil(item.price)}</p>
                
              </div>
            </div>
          ))}
        </div>

      </div>
      ) 

      :

      (
        <div className='flex w-full h-screen justify-center items-center'> 
          <h1 className="text-3xl font-bold text-white">Your Cart is
            Empty</h1>

          <Link href="/products" >Add items</Link>

        </div>
      )
}
     </div>
  )
};

export default WishlistPage;
