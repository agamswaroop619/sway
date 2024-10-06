import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { BiCategory } from "react-icons/bi";

import Link from "next/link";

const mobileBar = () => {
  return (
    <div className="hidden md:hidden lg:hidden xl:hidden 2xl:hidden xs:block sm:block">
      <div className="flex justify-around pb-2 pt-4 text-white bg-black w-[100vw]">
        <Link href="/" className="flex justify-center flex-col items-center">
          <IoHomeOutline className="mb-1" />
          <span>Home</span>
        </Link>

        <Link
          href="/products"
          className="flex justify-center flex-col items-center"
        >
          <MdOutlineExplore className="mb-1" />
          <span>Products</span>
        </Link>

        <Link
          href="/about"
          className="flex justify-center flex-col items-center"
        >
          <BiCategory className="mb-1" />
          <span>About</span>
        </Link>
      </div>
    </div>
  );
};

export default mobileBar;
