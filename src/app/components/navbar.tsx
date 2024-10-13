"use client";
import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store"; // Import the RootState type
import { usePathname } from "next/navigation";

const selectCartItems = (state: RootState) => state.cart.items;
const selectWishlistItems = (state: RootState) => state.wishlist.items;

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [not, setNot] = useState(0); // 'not' to store the count of cart items
  const [wish, setWish] = useState(0); // 'wish' to store
  const [ nav, setNav ] = useState('home');

  const url = usePathname();

  const itemsFromStore = useAppSelector(selectCartItems);
  const itemsFromWish = useAppSelector(selectWishlistItems);
  const [showSearch, setShowSearch] = useState(false); // Track visibility of the search bar


  const toggleSearchBar = () => {
    setShowSearch(!showSearch); // Toggle the search bar visibility
  };

  

  useEffect( () => {
    
    if( url === "/" ) {
      setNav('home');
    } else if ( url === '/products' ) {
      setNav('products');
    } else if ( url === '/about' ) {
      setNav('about');
    } else if ( url === '/contacts') {
      setNav('contacts');
    }
     else {
      setNav('');
    }

  }, [url])

  useEffect(() => {
    setWish(itemsFromWish.length);
  }, [itemsFromWish]);

  useEffect(() => {
    setNot(itemsFromStore.length); // Set the count based on the cart items length
  }, [itemsFromStore]); // This ensures it updates when `itemsFromStore` changes

  const router = useRouter();

  const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(search);
      router.push(`/search/${search}`);
      setSearch("");
    }
  };

  return (
    <div>
      <header className="flex px-3 bg-[#3fe607]  text-black w-full py-4 mb-2 justify-between items-center">
        <Link href="/" className="w-2/12">
          <h2 className="text-2xl hover:text-white transition-colors duration-300 ease">Sway</h2>
        </Link>

        <nav className="hidden md:block lg:block">
          <ul className="flex flex-wrap w-[40vw] justify-between text-xl">
            <li>
              <Link href="/" 
              className={`${ nav === "home" ?  "text-white" : ""}
              hover:text-white transition-colors duration-300 ease `}>Home</Link>
            </li>
            <li>
              <Link href="/products" 
              className={`${ nav === "products" ?  "text-white" : ""}
              hover:text-white transition-colors duration-300 ease `}>Collections</Link>
            </li>
            <li>
              <Link href="/about" 
              className={`${ nav === "about" ?  "text-white" : ""}
              hover:text-white transition-colors duration-300 ease `}>About us</Link>
            </li>

            <li>
              <Link href="/contacts" 
              className={`${ nav === "contacts" ?  "text-white" : ""}
              hover:text-white transition-colors duration-300 ease `}>Contact us</Link>
            </li>
          </ul>
        </nav>

        

        <div className="flex text-2xl  items-center md:w-[20vw] xs:w-[40vw] sm:w-[40vw] lg:w-[13vw] justify-between">

    
        <label  className={`flex items-center ${
        showSearch ? 'bg-white w-[100%]' : 'bg-transparent w-10'
        } overflow-hidden transition-all duration-500 ease-in-out `}>

        <IoIosSearch className="text-3xl px-1 cursor-pointer hover:text-white transition-colors duration-300 ease" onClick={toggleSearchBar} />

      {  
       showSearch && (
        <input
        type="text"
        className=" h-7 text-[17px] focus:outline-none bg-transparent border-none w-[100%]"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={keyHandler}  />
    )}
    </label>

      {
        !showSearch && <div className="flex w-[70%] justify-between items-center"> 
          <Link href="/wishlist" className="flex hover:text-white transition-colors duration-300 ease">
            <CiHeart />
            <sup className="text-sm "> {wish} </sup>
          </Link>

          <Link href="/cart" className="flex hover:text-white transition-colors duration-300 ease">
            <CiShoppingCart /> <sup className="text-sm  ">{not}</sup>
          </Link>

          <Link href="/profile">
            <CiUser className="hover:text-white transition-colors duration-300 ease" />
          </Link>
        </div>
     
      }
      </div>

      </header>
    </div>
  );
};

export default Navbar;
