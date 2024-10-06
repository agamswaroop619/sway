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

const selectCartItems = (state: RootState) => state.cart.items;
const selectWishlistItems = (state: RootState) => state.wishlist.items;

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [not, setNot] = useState(0); // 'not' to store the count of cart items
  const [wish, setWish] = useState(0); // 'wish' to store

  const itemsFromStore = useAppSelector(selectCartItems);
  const itemsFromWish = useAppSelector(selectWishlistItems);

  const [showSearch, setShowSearch] = useState(false); // Track visibility of the search bar


  const toggleSearchBar = () => {
    setShowSearch(!showSearch); // Toggle the search bar visibility
  };

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
      <header className="flex bg-[#3fe607] xs:px-2 text-black w-full py-4 mb-2 justify-around items-center">
        <Link href="/" className="w-2/12">
          <h2 className="text-2xl">Sway</h2>
        </Link>

        <nav className="hidden md:block lg:block">
          <ul className="flex flex-wrap w-[40vw] justify-between text-xl">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Categories</Link>
            </li>
            <li>
              <Link href="/about">About us</Link>
            </li>
          </ul>
        </nav>


        <label
  className={`flex items-center ${
    showSearch ? 'bg-white w-[20vw]' : 'bg-transparent w-10'
  } overflow-hidden transition-all duration-500 ease-in-out `}
>
  <IoIosSearch className="text-3xl px-1 cursor-pointer" onClick={toggleSearchBar} />
  {showSearch && (
    <input
      type="text"
      className="peer focus:outline-none bg-transparent border-none w-full"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={keyHandler}
    />
  )}
</label>

        {
          !showSearch && 

        <div className="flex text-2xl items-center md:w-[30vw] xs:w-[40vw] sm:w-[40vw] lg:w-[18vw] justify-evenly">

          <Link href="/wishlist" className="flex">
            <CiHeart />
            <sup className="text-sm"> {wish} </sup>
          </Link>

          <Link href="/cart" className="flex">
            <CiShoppingCart /> <sup className="text-sm">{not}</sup>
          </Link>

          <Link href="/profile">
            <CiUser />
          </Link>
        </div>
        }
      </header>
    </div>
  );
};

export default Navbar;
