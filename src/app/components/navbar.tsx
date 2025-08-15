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
import { RiMenu2Fill } from "react-icons/ri";
import { getDocs, collection as firestoreCollection } from "firebase/firestore";
import { firestore } from "@/app/firebase.config";

const selectCartItems = (state: RootState) => state.cart.items;
const userInfo = (state: RootState) => state.user.userProfile;

type NavbarProps = {
  sideNav: boolean;
  setSideNav: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ sideNav, setSideNav }: NavbarProps) => {
  const [search, setSearch] = useState("");
  const [not, setNot] = useState(0); // 'not' to store the count of cart items
  const [wish, setWish] = useState(0); // 'wish' to store

  const [dropDown, setDropDown] = useState(false);
  const [collections, setCollections] = useState<
    { label: string; href: string }[]
  >([]);

  const itemsFromStore = useAppSelector(selectCartItems);
  const itemsFromWish = useAppSelector(userInfo)?.wishlist || [];
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

  useEffect(() => {
    const fetchCollections = async () => {
      const snapshot = await getDocs(
        firestoreCollection(firestore, "collections")
      );
      setCollections(
        snapshot.docs.map((doc) => ({
          label: doc.data().name,
          href: `/shop/${doc.data().name.toLowerCase().replace(/\s+/g, "")}`,
        }))
      );
    };
    fetchCollections();
  }, []);

  const router = useRouter();

  const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      //console.log(search);
      router.push(`/search/${search}`);
      setSearch("");
    }
  };

  return (
    <div className="w-full">
      <header className="flex responsive-padding text-white w-full py-2 xs:py-3 sm:py-4 md:py-4 lg:py-4 xl:py-4 mb-2 justify-between items-center bg-black/90 backdrop-blur-sm sticky top-0 z-40">
        {/* Mobile Menu Button */}
        <div className="block md:hidden lg:hidden xl:hidden">
          <RiMenu2Fill
            onClick={() => setSideNav(!sideNav)}
            className="text-2xl xs:text-3xl sm:text-3xl cursor-pointer hover:text-green-400 transition-colors duration-300"
          />
        </div>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl items-center flex">
            <img
              className="h-8 xs:h-10 sm:h-10 md:h-10 lg:h-10 xl:h-10 mix-blend-lighten"
              src="https://res.cloudinary.com/dfyfsmu84/image/upload/e_improve:outdoor/xw7ycjxay8kos34rnolf"
              alt="Sway Logo"
            />
            <span className="ml-2">Sway</span>
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block lg:block xl:block">
          <ul className="flex flex-wrap justify-between text-lg lg:text-xl xl:text-xl space-x-6 lg:space-x-8 xl:space-x-10">
            <li>
              <Link
                href="/"
                className="hover:text-green-400 transition-colors duration-300"
              >
                Home
              </Link>
            </li>

            <li
              className="relative"
              onMouseLeave={() => setDropDown(false)}
              onMouseEnter={() => setDropDown(true)}
            >
              <Link
                href="/products"
                onClick={() => setDropDown(false)}
                className="hover:text-green-400 transition-colors duration-300"
              >
                Collections
              </Link>

              <ul
                className={`z-10 text-white bg-black/95 backdrop-blur-sm duration-400 ease-in-out absolute top-full left-0 min-w-48 rounded-lg shadow-xl border border-gray-700 ${
                  dropDown ? "block" : "hidden"
                } transition-all`}
              >
                {collections.map((col, idx) => (
                  <li
                    key={col.href}
                    className="p-2 opacity-0 animate-fade-in-item hover:bg-gray-800 rounded"
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    <Link
                      href={col.href}
                      onClick={() => setDropDown(false)}
                      className="block w-full"
                    >
                      {col.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link
                href="/about"
                className="hover:text-green-400 transition-colors duration-300"
              >
                About us
              </Link>
            </li>

            <li>
              <Link
                href="/contacts"
                className="hover:text-green-400 transition-colors duration-300"
              >
                Contact us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search and Icons */}
        <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-4 lg:space-x-4 xl:space-x-4">
          {/* Search Bar */}
          <label
            className={`flex items-center rounded-full transition-all duration-500 ease-in-out ${
              showSearch
                ? "bg-white text-black w-32 xs:w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72"
                : "bg-transparent w-10"
            } overflow-hidden`}
          >
            <IoIosSearch
              className="text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl px-1 cursor-pointer hover:text-green-400 transition-colors duration-300"
              onClick={toggleSearchBar}
            />

            {showSearch && (
              <input
                type="text"
                className="h-8 xs:h-9 sm:h-10 md:h-10 lg:h-10 xl:h-10 text-sm xs:text-base sm:text-base md:text-base lg:text-base xl:text-base focus:outline-none bg-transparent border-none w-full px-2"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={keyHandler}
                autoFocus
              />
            )}
          </label>

          {/* Icons */}
          {!showSearch && (
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-4 lg:space-x-4 xl:space-x-4">
              <Link href="/wishlist" className="relative group">
                <CiHeart className="text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl hover:text-green-400 transition-colors duration-300" />
                {wish > 0 && (
                  <sup className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {wish}
                  </sup>
                )}
              </Link>

              <Link href="/cart" className="relative group">
                <CiShoppingCart className="text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl hover:text-green-400 transition-colors duration-300" />
                {not > 0 && (
                  <sup className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {not}
                  </sup>
                )}
              </Link>

              <Link href="/profile">
                <CiUser className="text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl hover:text-green-400 transition-colors duration-300" />
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
