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
    <div className="z-10  w-[100vw] bg-white h-[100vh] flex text-black">

      <div className="sm:w-[70vw] p-10 xs:w-[80vw] md:w-[50vw] lg:w-[30vw] xl:w-[30vw] bg-white h-[100vh] ">

        <div className="w-[80%] mb-4 relative">
          <RiCloseLargeFill className="absolute right-0" onClick={() => setSideNav(false)} />
        </div>

        <Link href="/">Home</Link>

        <div>
          <div className="flex gap-4 my-2" onClick={() => setOpen(!open)}>
            <span>Collections</span>
            <GoChevronDown />
          </div>

          {open ? (
            <ul>
              <li>
                <Link href="">Oversized Tshirts</Link>
              </li>

              <li>
                <Link href="">Regular Tshirts</Link>
              </li>

              <li>
                <Link href="">Polo</Link>
              </li>

              <li>
                <Link href="">Psychedelics Tshirts</Link>
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

      <div className=" bg-transparent opacity-80 flex-grow"
        onClick={() => setSideNav(false)} >
           
      </div>

    </div>
  );
};

export default SideNavBar;
