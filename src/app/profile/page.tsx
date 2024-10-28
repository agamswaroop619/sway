"use client"; // Ensure this file is used as a client component

import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaListUl } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { LuUser } from "react-icons/lu";
import { MdOutlineLocalShipping } from "react-icons/md";
import { SlDirection } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";

const userLoginInfo = (state: RootState) => state.user.isLoggedIn;
const userProfile = (state: RootState) => state.user.userProfile;

const Page = () => {
  const router = useRouter();

  const isLoggedIn = useAppSelector(userLoginInfo);
  const userProfileData = useAppSelector(userProfile);

  const [nav, setNav] = useState("dashboard");

  // if( !isLoggedIn ) {
  //   router.push('/login');
  // }

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [state, setState] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  if( userProfileData ) {
    setFirstName( userProfileData.name);
    setEmail( userProfileData.email);
    setPhone(userProfileData.phone);

    setAddress(userProfileData.address);
    
  }

  return (
    <div className="m-8">
      {isLoggedIn ? (
        <>
          <p>This is my Profile</p>
          <Link href="/login" className="bg-slate-400 p-2 rounded-md m-4">
            Login or Sign up
          </Link>
        </>
      ) : (
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

            <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`}>
              <FaRegHeart /> <span>Wishlist</span>
            </div>

            <div
              className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              onClick={() => setNav("track-order")}
            >
              <MdOutlineLocalShipping /> <span>Track Order</span>
            </div>

            <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`}>
              <LuLogOut /> <span>Log out</span>
            </div>
          </div>

          <div>
            {nav === "dashboard" && (
              <div>
                {userProfileData && (
                  <div className="px-10 ">
                    <p>Name: {userProfileData.name}</p>
                    <p>Email: {userProfileData.email}</p>
                    <p>Phone: {userProfileData.phone}</p>
                  </div>
                )}
              </div>
            )}

            {nav === "orders" && (
              <div className="px-10 ">
               {
                userProfileData && userProfileData?.orders?.length > 0   ? 
                ( <div>
                        userProfileData.orders.map( (item, index) ={`> {`}
                          return <div key={index}>
                            <p> {itemSlice.title} </p>
                          </div>
                        {"}"})
                </div> ) : ( <div></div> )
               }
              </div>
            )}

            {nav === "account" && (
              <div className="px-10">
                <form
                  action=""
                  className=" flex flex-wrap justify-between gap-y-4 gap-x-20"
                >
                  <div className="flex flex-col">
                    <label htmlFor="">First Name</label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setFirstName(e.target.value) }
                      value={firstName}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Last Name</label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setLastName(e.target.value) }
                      value={ lastName }
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Email</label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setEmail(e.target.value) }
                      value={email}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Phone </label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setPhone(e.target.value) }
                      value={phone}
                    />
                  </div>
                </form>

                <button className="p-2 rounded-full">Save</button>
              </div>
            )}

            {nav === "address" && (
              <div className="px-10">
                <form
                  action=""
                  className=" flex flex-wrap justify-between gap-y-4 gap-x-20"
                 
                >
                  <div className="flex flex-col">
                    <label htmlFor="">Apartment, Building etc</label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setApartment(e.target.value)}
                      value={apartment}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Address</label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setAddress(e.target.value) }
                      value={address}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>City</label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setCity(e.target.value) }
                      value={city}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Postal Code </label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setPostalCode(e.target.value) }
                      value={postalCode}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>State </label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setState(e.target.value) }
                      value={state}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>County/ Region </label>
                    <input
                      type="text"
                      className="focus:outline-none p-2 rounded-md text-black"
                      onChange= { (e) => setRegion(e.target.value) }
                      value={region}
                    />
                  </div>

                </form>

                <button className="p-2 rounded-full bg-green-600 mt-4 w-20">Save</button>
              </div>
            )}

            
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
