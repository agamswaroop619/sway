'use client';

import Link from 'next/link';
import { MdOutlineClear } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';  // Import the RootState type
import { removeFromCart } from '@/lib/features/carts/cartSlice';
import { Products} from "@/lib/features/carts/cartSlice";

const selectCartItems = (state: RootState) => state.cart.items;

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Products[]>([]);  // Initialize with empty array

  const dispatch = useAppDispatch();

  // Fetch cart items from Redux store
  const itemsFromStore = useAppSelector(selectCartItems);

  useEffect(() => {
    setCartItems(itemsFromStore || []);  // Ensure cartItems is always an array
  }, [itemsFromStore]);  // Update only when itemsFromStore changes

  const router = useRouter();

  // const handleQuantityClick = (item: any) => {
  //   // This function will be called when the quantity button is clicked
  //   console.log("item : ",item);
  // };

  const handleRemoveItem = (id: number) => {
    // This function will be called when the remove item button is clicked
    dispatch(removeFromCart(id));
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qnt, 0);;

  return (
    <div>
      {cartItems.length > 0 ? (
      <div className="px-10 sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row flex justify-between w-full items-start">
        <div className="px-5 md:w-7/12 lg:w-7/12 xl:w-7/12 sm:w-full xs:w-full">
          {cartItems.map((item: Products) => (
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

        <div className="border my-2 px-5 md:w-4/12 lg:w-4/12 xl:w-4/12 sm:w-full xs:w-full pb-4">
          <p className="text-gray-600 font-semibold"> PRICE DETAILS ({cartItems.length} Items) </p>

          <div className="border-b-2 pb-2">
            <div className="flex justify-between">
              <p> Total Price </p>
              <p> ₹{Math.floor(total)} </p>
            </div>

            <div className="flex justify-between">
              <p> Discount on MRP </p>
              <p className="text-green-500">{0}</p>
            </div>
            <div className="flex justify-between">
              <p> Delivery Charges </p>
              <p className="text-green-500">
                <span className="line-through text-gray-500">
                  ₹80
                </span> FREE
              </p>
            </div>
          </div>

          <div className="flex justify-between font-semibold">
            <p>Total Amount</p>
            <p>₹{Math.floor(total )}</p>
          </div>

          <Link href="#" > <button className="relative w-full my-2 px-6 py-3 overflow-hidden font-medium transition-all bg-button-bg rounded-md group">
            <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-button-bg-dark rounded-md group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
              Place order
            </span>
          </button>
          </Link>
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

export default CartPage;
