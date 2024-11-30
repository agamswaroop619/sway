'use client';

import Link from 'next/link';
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { removeFromCart , selectCartItems, updateQnt } from '@/lib/features/carts/cartSlice';
import { itemsDataInCart } from '@/lib/features/items/items';
import { setItems, incQnt, removeCheckoutItem, clearCheckout, selectCheckoutItems } from '@/lib/features/checkout/checkout';
import { GoChevronDown } from "react-icons/go";

interface cartItems {
  itemId: number;
  qnt: number;
  price: number;
  title: string;
  image: string;
  size: string;
  docId: string;
  stock: number;  // stock should always be a number
}


const CartPage = () => {

  const [ couponErr , setCouponErr ] = useState("");
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const couponHandler = () => {
    
    if (couponCode === "") {
      setCouponErr("Please enter a valid coupon code");
    }
    else
    setCouponErr("Invalid Coupon Code");

    return ;
  }

  const dispatch = useAppDispatch();

  // Fetch cart items from Redux store
  const itemsFromStore = useAppSelector(selectCartItems);
  const allItems = useAppSelector(itemsDataInCart);
  const cartItems = useAppSelector(selectCheckoutItems);

  const [ outOfStock , setOutOfStock ] =useState<cartItems[]>([]);

  useEffect(() => {
    const carts: cartItems[] = [];
    const out: cartItems[] = [];
  
    dispatch(clearCheckout());
    console.log("at the starting phase");
  
    itemsFromStore.forEach((item) => {
      const itemData = allItems?.find((card) => Number(card.id) === item.itemId); // changed filter to find
      let stock = 0;
  
      if (itemData) {
        switch (item.size) {
          case 'Small':
            stock = itemData.quantity[0] - item.qnt;
            break;
          case 'Medium':
            stock = itemData.quantity[1] - item.qnt;
            break;
          case 'Large':
            stock = itemData.quantity[2] - item.qnt;
            break;
          case 'XL':
            stock = itemData.quantity[3] - item.qnt;
            break;
          case 'XXL':
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
          stock: stock
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
  }, [itemsFromStore, allItems]); // Dependencies
  
  const incHandler = (itemId: number, quantity: number) => {
    const item = cartItems?.find((card) => card.itemId === itemId);
    if (item && Math.abs( item.stock - quantity ) > 0 ) {
      const updatedItem = { ...item, qnt: item.qnt + 1, stock: item.stock - 1 };
      dispatch(incQnt(updatedItem));
    }
  };
  
  

  const router = useRouter();

  const handleRemoveItem = (id: number) => {
    // This function will be called when the remove item button is clicked
    dispatch(removeFromCart(id));
    dispatch( removeCheckoutItem(id));
  };


  const decHandler = ( itemId: number, quantity: number) => {
    const num= quantity-1;
    dispatch( updateQnt({ itemId: itemId, quantity: num }))
};

 



  const total = cartItems ? cartItems.reduce((acc, item) => acc + item.price * item.qnt, 0) : 0;

  return (
    <div className="relative">
  { cartItems && cartItems.length > 0 ? (
    <>
      <div className="lg:px-10 sm:p-4 xs:p-3 md:p-6 xl:p-8 sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row flex justify-between w-full items-start">
        
        {/* In-stock items */}
        <div className="md:w-7/12 lg:w-7/12 xl:w-7/12 sm:w-full xs:w-full">
          <div className="flex justify-between pb-2 text-[#7E7E7E]">
            <span>Products</span>
            <span>Total</span>
          </div>
       
         <div className=''>
         {cartItems.map((item: cartItems) => (
            <div key={item.itemId} className="mb-2 flex border-t w-full hover:cursor-pointer">
              <img
                src={item.image}
                className="h-32 pt-6"
                alt={item.title}
                onClick={() => router.push(`/products/${item.itemId}`)}
              />
              <div className="p-4 w-full">
                <div className="flex-row w-full py-1 justify-between">
                  <p className="text-xl">{item.title} | Sway Clothing</p>
                  <span>₹{Math.ceil(item.price)}</span>
                </div>

                <p>
                  {item.stock} items left</p>
                <p className="border p-2 my-1 w-32">SAVE ₹300.00</p>
                <p>Size: {item.size}</p>

                <div className="justify-center border w-[150px] flex items-center h-[50px] rounded-lg py-2 my-3">
                  <button
                    className="px-4 text-xl w-[33%] text-center border-r-2 disabled:opacity-55"
                    disabled={item.qnt < 2}
                    onClick={() => decHandler(item.itemId, item.qnt)}
                  >
                    -
                  </button>
                  <span className="w-[33%] grow text-center">{item.qnt}</span>
                  <button
  className="border-l-2 text-center w-[34%] disabled:opacity-55"
  onClick={() => incHandler(item.itemId, item.qnt)}
  disabled={ item.stock === 0 }  //Direct boolean value

>
                    + 
                  
                  </button>
                </div>

                <span> true or false {item.stock - item.qnt === 0}</span>

                <span
                  className="flex items-center gap-1 pb-1 underline"
                  onClick={() => handleRemoveItem(item.itemId)}
                >
                  <MdOutlineDeleteForever /> Remove from Cart
                </span>
              </div>
              <span className="pt-6">₹{item.price * item.qnt}</span>
            </div>
          ))}
         </div>
          

     
      {outOfStock.length > 0 && (
        <div className="md:w-7/12 lg:w-7/12 xl:w-7/12 sm:w-full xs:w-full">
          <h2 className='my-3  text-lg'>Out of Stock</h2>
          {outOfStock.map((item: cartItems) => (
            <div key={item.itemId} className="mb-2 flex border-t w-full hover:cursor-pointer">
              <img
                src={item.image}
                className="h-32 pt-6"
                alt={item.title}
                onClick={() => router.push(`/products/${item.itemId}`)}
              />
              <div className="p-4 w-full">
                <div className="flex-row w-full py-1 justify-between">
                  <p className="text-xl">{item.title} | Sway Clothing</p>
                  <span>₹{Math.ceil(item.price)}</span>
                </div>

                <p className="text-red-600">Out of Stock</p>
                <p className="border p-2 my-1 w-32">SAVE ₹300.00</p>
                <p>Size: {item.size}</p>

                <div className="justify-center border w-[150px] flex items-center h-[50px] rounded-lg py-2 my-3">
                  <button
                    className="px-4 text-xl w-[33%] text-center border-r-2 disabled:opacity-55"
                    disabled={item.qnt < 2}
                    onClick={() => decHandler(item.itemId, item.qnt)}
                  >
                    -
                  </button>
                  <span className="w-[33%] grow text-center">{item.qnt}</span>
                  <button
                    className="border-l-2 text-center w-[34%] disabled:opacity-55"
                    onClick={() => incHandler(item.itemId, item.qnt)}
                  >
                    +
                  </button>
                </div>

                <span
                  className="flex items-center gap-1 pb-1 underline"
                  onClick={() => handleRemoveItem(item.itemId)}
                >
                  <MdOutlineDeleteForever /> Remove from Cart
                </span>
              </div>
              <span className="pt-6">₹{item.price * item.qnt}</span>
            </div>
          ))}
        </div>
      )}

        </div>

        {/* Cart total section */}
        <div className="px-5 md:w-4/12 lg:w-4/12 xl:w-4/12 sm:w-full xs:w-full pb-4">
          <p className="text-[#7E7E7E]">CART TOTAL</p>

          <div className="py-2 my-2 border-b-[1px] border-t-[1px]">
              <p className="flex justify-between" onClick={ () => setCouponOpen(!couponOpen)}>Apply coupon <GoChevronDown /> </p>
              {
                <div className={`my-1  ${couponOpen === true ? "" : "hidden"}`}>
                  <div className="flex mx-4">
                  <input
                    type="text"
                    id="coupon"
                    name="coupon"
                    value={couponCode} onChange={(e)=> setCouponCode(e.target.value)}
                    className={`bg-transparent p-2 border focus:outline-none ${ couponErr !== "" ? "border-red-500" :""}`}
                    placeholder="Enter Coupon Code"
                  />

                  <button className="p-2 ml-4 border" onClick={ couponHandler}>Apply</button>
                </div>

                <p className="text-red-700">{couponErr}</p>

                </div>
              }
            </div>

          <div className="border-b-2 py-2">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹{Math.floor(total)}</p>
            </div>

            <div className="flex py-2 justify-between">
              <p>Discount on MRP</p>
              <p className="text-green-500">{0}</p>
            </div>
            <div className="flex py-2 justify-between">
              <div>
                <p>Shipping</p>
                <p className="text-sm text-gray-500">Free Shipping</p>
              </div>
              <span className="text-green-500">FREE</span>
            </div>
          </div>

          <div className="flex py-3 justify-between font-semibold">
            <p>Total Amount</p>
            <p>₹{Math.floor(total)}</p>
          </div>

          <Link href="/checkout" > <button  className="w-full text-center py-2 px-8 rounded-md bg-green-600 my-2">
            Checkout
          </button>
          </Link>

         
        </div>
      </div>

      {/* Out of stock items */}
     
      
    </>
  ) : (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <h1 className="text-3xl my-2 font-bold text-white">Your Cart is Empty</h1>
      <Link href="/products" className="border p-2 rounded-md">
        Add items
      </Link>
    </div>
  )}
</div>

  )
};

export default CartPage;
