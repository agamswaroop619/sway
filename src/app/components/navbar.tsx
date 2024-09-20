import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";

const navbar = () => {
  return (
    <header className="flex bg-[#04f49c] text-black w-full  mb-2 justify-around items-center">

    
    <Link href="/" className="w-2/12 ">
      <h2 className="text-2xl">Sway</h2>
      <p className="hidden md:block lg:block">Slay with sway</p>
    </Link>

    <nav className="hidden md:block lg:block">
      <ul className="flex flex-wrap   w-[40vw] justify-between text-xl">
        <li> <Link href="/">Home</Link > </li>
        <li> <Link href="/products">Products </Link > </li>
        <li> <Link href="#">About us</Link > </li>

        <li> <Link href="#">Track order</Link> </li>
      </ul>
    </nav>

    

    <div className="text-2xl flex items-center md:w-[40vw] xs:w-[80vw] sm:w-[60vw] lg:w-[25vw] justify-evenly">
      <Link href="" ><IoIosSearch  /></Link>
      <Link href="/wishlist"><IoMdHeartEmpty /></Link>
      <Link href="/cart"><MdOutlineShoppingCart /></Link>
      <Link href="/profile"><FaRegUser/> </Link>
    </div>
   

  </header>
  )
};

export default navbar;


