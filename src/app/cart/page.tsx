'use client';

import Link from 'next/link';
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { removeFromCart , selectCartItems, updateQnt } from '@/lib/features/carts/cartSlice';
import { Products} from "@/lib/features/carts/cartSlice";

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

  const incHandler = ( itemId: number, quantity: number) => {
      const num= quantity+1;
      dispatch( updateQnt({ itemId: itemId, quantity: num }))
  };

  const decHandler = ( itemId: number, quantity: number) => {
    const num= quantity-1;
    dispatch( updateQnt({ itemId: itemId, quantity: num }))
};

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qnt, 0);;

  return (
    <div>
      {cartItems.length > 0 ? (
      <div className="lg:px-10 sm:p-4 xs:p-3 md:p-6 xl:p-8 sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row flex justify-between w-full items-start">
        <div className=" md:w-7/12 lg:w-7/12 xl:w-7/12 sm:w-full xs:w-full">
        <div className='flex justify-between pb-2 text-[#7E7E7E]'>
          <span>Products</span>
          <span>Total</span>
        </div>
          {cartItems.map((item: Products) => (
            <div key={item.itemId} className=" mb-2 flex border-t  w-full hover:cursor-pointer">
              <img src={item.image} className="h-32 pt-6" alt={item.title} onClick={() => router.push(`/products/${item.itemId}`)} />
              <div className="p-4 w-full">
                <div className="flex-row  w-full py-1 justify-between">
                <p className=" text-xl">{item.title} | Sway Clothing</p>
                <span>₹{Math.ceil(item.price)}</span>
                 </div>
                
               <p>5 Left in Stock</p>
               <p className='border p-2 my-1 w-32'>SAVE ₹300.00 </p>
               <p>Size : Medium</p>

                <div className=' justify-center border  w-[150px] flex items-center h-[50px]  rounded-lg py-2 my-3'>
              <button
                className=' px-4 text-xl  w-[33%]  text-center border-r-2 disabled:opacity-55'
                disabled={item.qnt < 2}
                onClick={() => decHandler( item.itemId, item.qnt )}
              > - </button>
              <span className=' w-[33%] grow text-center  '>{item.qnt}</span>
              <button
                className='border-l-2 text-center w-[34%]  disabled:opacity-55 '
                
                onClick={() => incHandler(item.itemId, item.qnt)}
              > + </button>
            </div>

            <span className=" flex items-center gap-1 pb-1 underline" onClick={() => handleRemoveItem(item.itemId)} > <MdOutlineDeleteForever /> Remove from Cart </span>
                
              </div>
              <span className='pt-6'>₹{item.price*item.qnt}</span>
            </div>
          ))}
        </div>

        <div className=" px-5  md:w-4/12 lg:w-4/12 xl:w-4/12 sm:w-full xs:w-full pb-4">
          <p className="text-[#7E7E7E] "> CART TOTAL  </p>

          <div className="p-2 border-t border-b my-2">
          Apply Coupon
          {
            <div className="my-1">
              <input
                type="text"
                id="coupon"
                name="coupon"
                className="bg-transparent p-2 border focus:outline-none"
                placeholder="Enter Coupon Code"
              />

              <button className="p-2 ml-4 border">Apply</button>
            </div>
          }
        </div>

          <div className="border-b-2 py-2">
            <div className="flex justify-between">
              <p> Subtotal </p>
              <p> ₹{Math.floor(total)} </p>
            </div>

            <div className="flex py-2 justify-between">
              <p> Discount on MRP </p>
              <p className="text-green-500">{0}</p>
            </div>
            <div className="flex py-2 justify-between">
             <div>
              <p> Shipping </p>
              <p className='text-sm text-gray-500'>Free Shipping</p>
             </div>
             <span className="text-green-500">FREE</span>
            </div>
          </div>

          <div className="flex py-3 justify-between font-semibold">
            <p>Total Amount</p>
            <p>₹{Math.floor(total )}</p>
          </div>

          <Link href="/checkout" > <button className="w-full text-center p-2 rounded-md bg-green-600 my-2 ">
             Checkout 
          
          </button>
          </Link>
        </div>

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

export default CartPage;
