import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-700 flex flex-col gap-y-4" >
      
        <div className="flex flex-wrap p-6 w-full justify-around">
          <div className="w-4/12 " >
            <h2 className="text-green-600  my-4 text-2xl ">Join our club </h2>
            <p className="mb-4">By Submittng your email, you agree to receive advertising emails from Sway. </p>

            <p className="my-14 ">© 2024 Sway. All Rights Reserved. </p>
          </div>

          <div className="w-3/12 ">
            <h3 className="text-green-600 my-4 text-xl ">About Sway</h3>
            <ul className="flex flex-col gap-y-4">
              <li> <a href="#">Streetwear Collection</a> </li>
              <li> <a href="#">Blogs</a> </li>
              <li> <a href="#">Cart</a> </li>
              <li> <a href="#">Checkout</a> </li>
              <li> <a href="#">Wishlist</a> </li>
              <li> <a href="#">Privacy Policy</a> </li>
            </ul>
          </div>

          <div className="w-3/12 ">
          <h3 className="text-green-600 my-4 text-xl ">Help & Support</h3>
            <ul className="flex flex-col gap-y-4">
              <li> <a href="#">About us</a> </li>
              <li> <a href="#">Contact us</a> </li>
              <li> <a href="#">My account</a> </li>
              <li> <a href="#">Terms & Conditions</a> </li>
              <li> <a href="#">Refund and Returns Policy</a> </li>
              <li> <a href="#">Shipping Policy</a> </li>
            </ul>
          </div>
        </div>

        <div className="mx-4 p-2 border-t-2">
          <p className="text-center tracking-wide">Copyright © 2024 Sway </p>
        </div>

        </footer>
  )
}

export default Footer
