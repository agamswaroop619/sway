"use client";
import React, { useState } from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { GoChevronDown } from "react-icons/go";
import Link from "next/link";

interface PropsType {
  setSideNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNavBar: React.FC<PropsType> = ({ setSideNav }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="z-30 w-screen flex fixed">
      <div className="text-lg lg:w-0 md:w-0 xl:w-0 sm:w-[60vw] xs:w-[70vw]  w-[100vw] py-10 px-5 bg-black h-[100vh] flex flex-col text-white">
        <div className="full mb-6 relative">
          <RiCloseLargeFill
            className="absolute right-4"
            onClick={() => setSideNav(false)}
          />
        </div>

        <Link href="/">Home</Link>

        <div>
          <div className="flex gap-4 mt-2" onClick={() => setOpen(!open)}>
            <span>Collections</span>
            <GoChevronDown
              className={`  ${
                open === true
                  ? " transition duration-500 ease rotate-180"
                  : "transition duration-500 ease rotate-0"
              }`}
            />
          </div>

          {open ? (
            <ul
              className={`mx-3 px-2 border-l-2 border-slate-400 transition-all duration-500 ease ${
                open
                  ? "opacity-100 max-h-[500px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <li>
                <Link className="my-4" href="/shop/streetwear">
                  Streetwear
                </Link>
              </li>

              <li>
                <Link className="my-4" href="/shop/regular">
                  Regular Tshirts
                </Link>
              </li>

              <li>
                <Link className="my-4" href="/shop/polo">
                  Polo
                </Link>
              </li>

              <li>
                <Link className="my-4" href="/shop/psychedelics">
                  Psychedelics Tshirts
                </Link>
              </li>
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col my-2 gap-y-2">
          <Link href="/">Abouts us</Link>
          <Link href="/contacts">Contact us</Link>
          <Link href="/track-order">Track order</Link>
          <Link href="/login">Login/Sign up</Link>
        </div>
      </div>

      <div
        className="flex-grow bg-[#e5e5e5] opacity-45"
        onClick={() => setSideNav(false)}
      ></div>
    </div>
  );
};

export default SideNavBar;
