"use client"; // Ensure this file is used as a client component

import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaListUl } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { LuLogOut, LuUser } from "react-icons/lu";
import { MdOutlineLocalShipping } from "react-icons/md";
import { SlDirection } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { itemsDataInCart } from "@/lib/features/items/items";
import { CiSettings } from "react-icons/ci";
import { firestore } from "../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DocumentReference } from "firebase/firestore";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();

  //Selecting state from Redux
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.user.isLoggedIn
  );

  const [ sidebar , setSidebar ] = useState(false);

  const [ userRef, setUserRef ] = useState< DocumentReference | null>(null);


  const userData = useAppSelector((state: RootState) => state.user.userProfile);
  const cartItems = useAppSelector(itemsDataInCart);

  // Filtered orders based on cart items
  const orders = userData?.orders;
  const newOrders = orders
    ? cartItems?.filter((item) => orders.includes(item.id))
    : [];

  // Navigation state
  const [nav, setNav] = useState("dashboard");

  // Profile information state
  // Address field
  const [firstName, setFirstName] = useState(userData?.name);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(userData?.email);
  const [address, setAddress] = useState(userData?.delivery?.address);
  const [city, setCity] = useState(userData?.delivery?.city);
  const [state, setState] = useState(userData?.delivery?.state);
  const [zipCode, setZipCode] = useState(userData?.delivery?.postalCode);
  const [country, setCountry] = useState(userData?.delivery?.country);
  const [phone, setPhone] = useState(userData?.phone);
  const [apartment, setApartment] = useState(userData?.delivery?.apartment);

  //Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const saveAddress = async () => {
    const accountAddress = {
      apartment,
      address,
      city,
      state,
      postalCode: zipCode,
      country,
    };
  
    if (userRef) {
      const userData = await getDoc(userRef);
  
      if (userData.exists()) {
        // Use updateDoc with an object specifying the field you want to update
        await updateDoc(userRef, { delivery: accountAddress });
      }
    }
  };

  const saveAccountDetails =  async() => {
   
    if( userRef ) {
      const userData = await getDoc(userRef);

      if ( userData.exists() )
      {
        try {
          await updateDoc(userRef, { phone});
          toast.success("Phone Updated successfully");

        } catch (error) {
          toast.error("Something went wrong while updating phone number");
          
          if( error instanceof Error) {
            console.log("Error : ", error);
          }
        }
      }
    }
    
  }

  useEffect( ()=> {
   
    if( userData ) {
      const uid= userData?.userId ;
      const  ref  = doc(firestore, "users", uid);
  
      setUserRef( ref);
    }


  }, [userData] )

  return (
    <div className="m-4">
      {isLoggedIn ? (
        <div>
         
         <div className="hidden md:block xl:block lg:block">
         <div className="flex ">
            <div className="flex flex-col h-[75vh] w-[20vw] justify-between border-r-[1px]">
              <div
                className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
                onClick={() => setNav("dashboard")}
              >
                <MdDashboardCustomize /> <span>Dashboard</span>
              </div>
              <div
                className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
                onClick={() => setNav("orders")}
              >
                <FaListUl /> <span>Orders</span>
              </div>
              <div
                className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
                onClick={() => setNav("account")}
              >
                <LuUser /> <span>Account details</span>
              </div>
              <div
                className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
                onClick={() => setNav("address")}
              >
                <SlDirection /> <span>Address</span>
              </div>
              <div
                className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              >
                <FaRegHeart /> <span>Wishlist</span>
              </div>
              <div
                className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
                onClick={() => setNav("track-order")}
              >
                <MdOutlineLocalShipping /> <span>Track Order</span>
              </div>
              <div
                className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              >
                <LuLogOut /> <span>Log out</span>
              </div>
            </div>

            <div className="flex-grow px-10">
                {nav === "dashboard" && userData && (
                  <div>

                    <h2 className="text-xl mb-3 border-b pb-1">Dashboard </h2>

                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Phone: {userData.phone}</p>
                  </div>
                )}
  
                {nav === "orders" && (
                  <div>

                  <h2 className="text-xl mb-3 border-b pb-2">Orders </h2>

                    {newOrders && newOrders.length > 0 ? (
                      newOrders.map((item, index) => (
                        <div key={index}>
                          <p>{item.title}</p>
                        </div>
                      ))
                    ) : (
                      <div>No orders found</div>
                    )}
                  </div>
                )}
  
                {nav === "account" && (
                  <div className="">
                      <h2 className="text-xl mb-3 border-b pb-1">Account </h2>

                    <form className="flex flex-wrap justify-between gap-y-4 ">
                      <div className="flex flex-col">
                        <label>First Name</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setFirstName(e.target.value)}
                          value={firstName}
                        />
                      </div>
  
                      <div className="flex flex-col">
                        <label>Last Name</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setLastName(e.target.value)}
                          value={lastName}
                        />
                      </div>
  
                      <div className="flex flex-col">
                        <label>Email</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
  
                      <div className="flex flex-col">
                        <label>Phone</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setPhone(e.target.value)}
                          value={phone}
                        />
                      </div>
                    </form>
                    <button onClick={ saveAccountDetails} className="p-2 rounded-full bg-green-600 mt-4 w-20">
                      Save
                    </button>
                  </div>
                )}
  
                {nav === "address" && (
                  <div className="">
                      <h2 className="text-xl mb-3 border-b pb-1">Address </h2>

                    <form className="flex flex-wrap justify-between gap-y-4 w-full">
                      <div className="flex flex-col">
                        <label>Apartment, Building etc</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setApartment(e.target.value)}
                          value={apartment}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>Address</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setAddress(e.target.value)}
                          value={address}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>City</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setCity(e.target.value)}
                          value={city}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>Postal Code</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setZipCode(e.target.value)}
                          value={zipCode}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>State</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setState(e.target.value)}
                          value={state}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>Country/Region</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setCountry(e.target.value)}
                          value={country}
                        />
                      </div>

                      {/* Additional address fields */}
                    </form>
                    <button onClick={ saveAddress } className="p-2 rounded-full bg-green-600 mt-4 w-20">
                      Save
                    </button>
                  </div>
                )}
              </div>
          </div>
         </div>

          <div className="md:hidden lg:hidden xl:hidden mb-2 sm:block xs:block">
           
              {
                !sidebar && <CiSettings onClick={() => setSidebar(true)} />
              }

              {sidebar && (
                <div className="flex flex-col  h-[40vh] w-[60vw] justify-between  z-10">

                  <div
                    className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                    onClick={() => {
                      setNav("dashboard")
                      setSidebar(false)
                    }}
                  >
                    <MdDashboardCustomize /> <span>Dashboard</span>
                  </div>

                  <div
                    className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                    onClick={() => {
                      setNav("orders")
                      setSidebar(false)
                    }}
                  >
                    <FaListUl /> <span>Orders</span>
                  </div>

                  <div
                    className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                    onClick={() => {
                      setNav("account")
                      setSidebar(false)
                    }}
                  >
                    <LuUser /> <span>Account details</span>
                  </div>

                  <div
                    className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                    onClick={() => {
                      setNav("address")
                      setSidebar(false)
                    }}
                  >
                    <SlDirection /> <span>Address</span>
                  </div>

                  <Link href="/wishlist"
                    className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                  >
                    <FaRegHeart /> <span>Wishlist</span>
                  </Link >

                  <Link href="/track-order"
                    className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                    onClick={() => setNav("track-order")}
                  >
                    <MdOutlineLocalShipping /> <span>Track Order</span>
                  </Link>

                  <div
                    className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                  >
                    <LuLogOut /> <span>Log out</span>
                  </div>
                </div>
              )}


              {
                !sidebar && <div className="flex-grow px-10">
                {nav === "dashboard" && userData && (
                  <div>

                    <h2 className="text-xl mb-3 border-b pb-1">Dashboard </h2>

                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Phone: {userData.phone}</p>
                  </div>
                )}
  
                {nav === "orders" && (
                  <div>

                  <h2 className="text-xl mb-3 border-b pb-2">Orders </h2>

                    {newOrders && newOrders.length > 0 ? (
                      newOrders.map((item, index) => (
                        <div key={index}>
                          <p>{item.title}</p>
                        </div>
                      ))
                    ) : (
                      <div>No orders found</div>
                    )}
                  </div>
                )}
  
                {nav === "account" && (
                  <div className="">
                      <h2 className="text-xl mb-3 border-b pb-1">Account </h2>

                    <form className="flex flex-col justify-between gap-y-4 ">
                      <div className="flex flex-col">
                        <label>First Name</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setFirstName(e.target.value)}
                          value={firstName}
                        />
                      </div>
  
                      <div className="flex flex-col">
                        <label>Last Name</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setLastName(e.target.value)}
                          value={lastName}
                        />
                      </div>
  
                      <div className="flex flex-col">
                        <label>Email</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
  
                      <div className="flex flex-col">
                        <label>Phone</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setPhone(e.target.value)}
                          value={phone}
                        />
                      </div>
                    </form>
                    <button onClick={ saveAccountDetails} className="p-2 rounded-full bg-green-600 mt-4 w-20">
                      Save
                    </button>
                  </div>
                )}
  
                {nav === "address" && (
                  <div className="">
                      <h2 className="text-xl mb-3 border-b pb-1">Address </h2>

                    <form className="flex flex-col justify-between gap-y-4 w-full">
                      <div className="flex flex-col">
                        <label>Apartment, Building etc</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setApartment(e.target.value)}
                          value={apartment}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>Address</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setAddress(e.target.value)}
                          value={address}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>City</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setCity(e.target.value)}
                          value={city}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>Postal Code</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setZipCode(e.target.value)}
                          value={zipCode}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>State</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setState(e.target.value)}
                          value={state}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label>Country/Region</label>
                        <input
                          type="text"
                          className="focus:outline-none p-2 rounded-md text-black"
                          onChange={(e) => setCountry(e.target.value)}
                          value={country}
                        />
                      </div>

                      {/* Additional address fields */}
                    </form>
                    <button onClick={ saveAddress} className="p-2 rounded-full bg-green-600 mt-4 w-20">
                      Save
                    </button>
                  </div>
                )}
              </div>
              }

            </div>
          </div>
      
      ) : (
        <div className="flex justify-center items-center">
          <p>You have not login yet</p>
          <Link href="/login" className="bg-slate-400 p-2 rounded-md m-4">
            Login or Sign up
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
