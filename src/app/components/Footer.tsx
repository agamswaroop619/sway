import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black/90 backdrop-blur-sm border-t border-gray-700 mt-auto">
      <div className="container-responsive py-8 xs:py-10 sm:py-12 md:py-12 lg:py-12 xl:py-12">
        <div className="responsive-grid-3 gap-8 lg:gap-12 xl:gap-12">
          {/* Newsletter Section */}
          <div className="responsive-w-full">
            <h2 className="text-green-500 font-bold text-xl xs:text-2xl sm:text-2xl mb-4">
              Join our club
            </h2>
            <p className="text-gray-300 text-sm xs:text-base sm:text-base mb-6 leading-relaxed">
              By submitting your email, you agree to receive advertising emails
              from Sway.
            </p>

            <div className="flex gap-2 mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-semibold">
                Subscribe
              </button>
            </div>

            <p className="text-gray-400 text-sm">
              © 2024 Sway. All Rights Reserved.
            </p>
          </div>

          {/* About Sway Section */}
          <div className="responsive-w-full">
            <h3 className="text-green-500 font-bold text-lg xs:text-xl sm:text-xl mb-4">
              About Sway
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/cart"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Shop Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support Section */}
          <div className="responsive-w-full">
            <h3 className="text-green-500 font-bold text-lg xs:text-xl sm:text-xl mb-4">
              Help & Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  My account
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund_returns"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Refund and Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm xs:text-base sm:text-base"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 py-4">
        <div className="container-responsive">
          <div className="flex flex-col xs:flex-row sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center xs:text-left sm:text-left">
              Copyright © 2024 Sway. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/sway.society/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
