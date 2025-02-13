"use client";
import React, { useState } from "react";
import Link from "next/link";
import { RiCloseLargeFill } from "react-icons/ri";
import { GoChevronDown } from "react-icons/go";

type NavItem = {
  label: string;
  href: string;
};

type CollectionItem = NavItem;

interface SideNavBarProps {
  setSideNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const collections: CollectionItem[] = [
  { label: "Streetwear", href: "/shop/streetwear" },
  { label: "Regular Tshirts", href: "/shop/regular" },
  { label: "Polo", href: "/shop/polo" },
  { label: "Psychedelics Tshirts", href: "/shop/psychedelics" },
];

const navLinks: NavItem[] = [
  { label: "About us", href: "/" },
  { label: "Contact us", href: "/contacts" },
  { label: "Login/Sign up", href: "/login" },
];

const SideNavBar: React.FC<SideNavBarProps> = ({ setSideNav }) => {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  const handleClose = () => setSideNav(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn">
      <div className="fixed top-0 left-0 h-full w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0 animate-slideIn">
        <div className="p-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-white transition-transform duration-300 animate-slideIn"
            aria-label="Close navigation"
          >
            <RiCloseLargeFill className="w-6 h-6" />
          </button>

          <nav className="mt-8 space-y-6">
            <Link
              href="/"
              className="block text-lg font-medium text-white hover:text-gray-600 transition-transform duration-300 animate-slideIn"
            >
              Home
            </Link>

            <div className="transition-transform duration-300 animate-slideIn">
              <button
                className="flex items-center justify-between w-full text-lg font-medium text-white hover:text-gray-600"
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                aria-expanded={isCollectionsOpen}
                aria-controls="collections-menu"
              >
                Collections
                <GoChevronDown
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    isCollectionsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id="collections-menu"
                className={`mt-2 ml-4 space-y-2 transition-all duration-300 ${
                  isCollectionsOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {collections.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-white hover:text-gray-600 transition-transform duration-300 animate-slideIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-lg font-medium text-white hover:text-gray-600 transition-transform duration-300 animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
