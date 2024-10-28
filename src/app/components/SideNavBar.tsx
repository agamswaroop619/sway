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
    <div className="z-10  w-[100vw]  h-[100vh] flex text-black">

      <div className="w-[80%] py-10 px-5 bg-white h-[100vh] ">

        <div className="full mb-6 relative">
          <RiCloseLargeFill className="absolute right-4" onClick={() => setSideNav(false)} />
        </div>

        <Link href="/">Home</Link>

        <div>
          <div className="flex gap-4 my-2" onClick={() => setOpen(!open)}>
            <span>Collections</span>
            <GoChevronDown className={`  ${
                open === true ? " transition duration-300 ease translate-y-2" : ""
              }`} />
          </div>

          {open ? (
            <ul className="mx-3 px-2 border-l-2 border-slate-400">
              <li>
                <Link className="my-2" href="">Oversized Tshirts</Link>
              </li>

              <li>
                <Link className="my-2" href="">Regular Tshirts</Link>
              </li>

              <li>
                <Link className="my-2" href="">Polo</Link>
              </li>

              <li>
                <Link className="my-2" href="">Psychedelics Tshirts</Link>
              </li>
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col my-3 gap-y-2">
          <Link href="/">Abouts us</Link>
          <Link href="/contacts">Contact us</Link>
          <Link href="/track-order">Track order</Link>
          <Link href="/login">Login/Sign up</Link>
        </div>
      </div>

      <div className=" bg-[#d2d0d0cf] opacity-60 flex-grow"
        onClick={() => setSideNav(false)} >
           
      </div>

    </div>
  );
};

export default SideNavBar;
