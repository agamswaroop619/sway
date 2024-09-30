'use client'
import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import { LuMenu } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store'; // Import the RootState type


const selectCartItems = (state: RootState) => state.cart.items;

const Navbar = () => {
  const [sidebar, setSidebar] = useState(true);
  const [search, setSearch] = useState("");
  const [not, setNot] = useState(0); // 'not' to store the count of cart items

  const itemsFromStore = useAppSelector(selectCartItems);

  useEffect(() => {
    setNot(itemsFromStore.length); // Set the count based on the cart items length
  }, [itemsFromStore]); // This ensures it updates when `itemsFromStore` changes

  const router = useRouter();

  const clickHandler = () => {
    setSidebar(!sidebar);
  };

  const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(search);
      router.push(`/search/${search}`);
      setSearch("");
    }
  };

  const data = [
    { id: 1, name: "Home" },
    { id: 2, name: "Products" },
    { id: 3, name: "About us" },
    { id: 4, name: "Blog" },
    { id: 5, name: "Contact us" },
    { id: 6, name: "Track Order" },
    { id: 7, name: "Login/Register" },
  ];

  return (
    <div>
      {sidebar ? (
        <header className="flex bg-[#3fe607] text-black w-full py-4 mb-2 justify-around items-center">
          <div className="text-3xl hidden md:hidden lg:hidden xl:hidden 2xl:hidden xs:block sm:block">
            <LuMenu onClick={clickHandler} />
          </div>

          <Link href="/" className="w-2/12">
            <h2 className="text-2xl">Sway</h2>
          </Link>

          <nav className="hidden md:block lg:block">
            <ul className="flex flex-wrap w-[40vw] justify-between text-xl">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="#">About us</Link></li>
              <li><Link href="#">Track order</Link></li>
            </ul>
          </nav>

          <label className="flex items-center border border-black peer-focus:bg-white bg-gray-300 lg:w-[20vw]">
            <IoIosSearch className="text-3xl px-1" />
            <input
              type="text"
              className="peer focus:outline-none bg-transparent border-none"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={keyHandler}
            />
          </label>

          <div className="flex text-2xl items-center md:w-[30vw] xs:w-[40vw] sm:w-[40vw] lg:w-[18vw] justify-evenly">
            <Link href="/wishlist"><CiHeart /></Link>
            <Link href="/cart" className="flex">
              <CiShoppingCart />  <sup className="text-sm">{not}</sup>
              {/* Display the count of cart items */}
            </Link>
            <Link href="/profile"><CiUser /></Link>
          </div>
        </header>
      ) : (
        <div className="w-[90vw] h-[100vh]">
          <div className="m-8">
            <div className="flex justify-between">
              <div className="group relative">
                <LuMenu className="text-3xl transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0" onClick={clickHandler} />
                <RxCross1 onClick={clickHandler} className="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0" />
              </div>
              <input type="text" placeholder="" />
            </div>

            {data.map((item) => (
              <div key={item.id} className="my-2 py-2 border-t">
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
