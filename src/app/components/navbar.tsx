'use client'
import React, {useState} from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import { LuMenu } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";

const Navbar = () => {

  const [sidebar, setSidebar]= useState(true);

  const clickHandler = () => {
    setSidebar(!sidebar)
  }

  const data= [
    {
      id: 1,
      name: "Home",
    },
    {
      id: 2,
      name: "Products",
    },
    {
      id: 3,
      name: "About us",
    },
    {
      id: 4,
      name: "Blog",
    },
    {
      id: 5,
      name: "Contact us",
    },
    {
      id: 6,
      name: "Track Order",
    },
    {
      id: 7,
      name: "Login/Register",
    }
  ]

  return (
    <div>
      {
        sidebar ? (
          <header className="flex bg-[#3fe607] text-black w-full py-4  mb-2 justify-around items-center">

        <div className="text-3xl hidden md:hidden lg:hidden xl:hidden 2xl:hidden xs:block sm:block">
          <LuMenu onClick={clickHandler} />
        </div>
    
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

    

    <div className="text-2xl flex items-center md:w-[40vw] xs:w-[60vw] sm:w-[60vw] lg:w-[25vw] justify-evenly">
      <Link href="" ><IoIosSearch  /></Link>
      <Link href="/wishlist"><IoMdHeartEmpty /></Link>
      <Link href="/cart"><MdOutlineShoppingCart /></Link>
      <Link href="/profile"><FaRegUser/> </Link>
    </div>
   

          </header>
        )
        :
        (
          <div className="w-[90vw] h-[100vh] "> 

            <div className="m-8">
             
              <div className="flex justify-between"> 
                <div className="group relative">
                <LuMenu className="text-3xl transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0" onClick={clickHandler} />
                
                <RxCross1 onClick={ clickHandler} className="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0" />
                  </div>
                  <input type="text" placeholder="" />
              </div>



              {
                data.map( (item) => {
                  return (
                    <div key={item.id} className="my-2 py-2 border-t"  >
                      {item.name}
                      </div>
                  )
                } )
              }

               </div>
            </div>
        )
      }
    </div>
  )
};

export default Navbar;


