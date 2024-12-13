"use client"; // Ensure this file is used as a client component

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaListUl } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { LuLogOut, LuUser } from "react-icons/lu";
import { MdOutlineLocalShipping } from "react-icons/md";
import { SlDirection } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa";
import { firestore } from "../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DocumentReference } from "firebase/firestore";
import toast from "react-hot-toast";
import { Order } from "@/lib/features/user/user";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FormEvent } from "react";
import { logout } from "@/lib/features/user/user";
import { updateProfile } from "@/lib/features/user/user";

const Page = () => {

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [mounting, setMounting] = useState(false);

  //Selecting state from Redux
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.user.isLoggedIn
  );

  const [sidebar, setSidebar] = useState(false);

  const [userRef, setUserRef] = useState<DocumentReference | null>(null);

  const userData = useAppSelector((state: RootState) => state.user.userProfile);

  const newOrders: Order[] = userData ? userData.orders : [];


  // Navigation state
  const [nav, setNav] = useState("dashboard");

  // Profile information state
  // Address field
  const [firstName, setFirstName] = useState(userData?.name);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(userData?.email);
  const [address, setAddress] = useState(userData?.delivery?.address || "");
  const [city, setCity] = useState(userData?.delivery?.city || "");
  const [state, setState] = useState(userData?.delivery?.state || "");
  const [zipCode, setZipCode] = useState(userData?.delivery?.postalCode || "");
  const [country, setCountry] = useState(userData?.delivery?.country || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [apartment, setApartment] = useState(userData?.delivery?.apartment || "");

  const [ shipmentId, SetShipmentId ] = useState("");

  //Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      console.log("user Data : ", userData);
    }
  }, [isLoggedIn, router]);

  const saveAddress = async () => {
    const accountAddress = {
      apartment ,
      address ,
      city ,
      state ,
      postalCode: zipCode ,
      country ,
    };

    if (userRef) {
      const userData = await getDoc(userRef);

      if (userData.exists()) {
        // Use updateDoc with an object specifying the field you want to update
        await updateDoc(userRef, { delivery: accountAddress });
        dispatch( updateProfile({delivery:accountAddress} )) ;
        toast.success("Address updated successfully");
      }
    }
  };

  const saveAccountDetails = async () => {
    if (userRef) {
      const userData = await getDoc(userRef);

      const accountDetails = {
        name: firstName,
        email: email,
        phone: phone
      }

      if (userData.exists()) {
        try {
          await updateDoc(userRef, { accountDetails });
          toast.success("Account details updated successfully");
          dispatch( updateProfile( accountDetails))
        } catch (error) {
          toast.error("Something went wrong ");

          if (error instanceof Error) {
            console.log("Error : ", error);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (userData) {
      const uid = userData?.userId;
      const ref = doc(firestore, "users", uid);

      setUserRef(ref);
    }

    console.log("users data in redux : ", userData);
  }, [userData]);

  useEffect(() => {
    // Set mounting to true after the component is mounted
    setMounting(true);
  }, []);

  const submitHandler = ( e: FormEvent ) => {

    e.preventDefault();

    if( shipmentId.trim() !== "" )
    router.push(`/track-orders/${shipmentId}`)

  }

  const logoutHandler = () => {
    if(userData) {
      dispatch( logout())
    }
  }

  // Show loading message if mounting is still false
  if (!mounting) {
    return <>Loading ...</>;
  }

  return (
    <div className="mb-20">
      {isLoggedIn ? (
        <div>
          {/* For large screen (Laptop, Tablet) */}
          <div className="hidden  px-10 md:block xl:block lg:block">
            <div className="flex ">

              <div className="flex flex-col h-[75vh] w-[20vw] justify-between border-r-[1px]">
                
                <div
                  className={`flex items-center w-[20vw] gap-4 cursor-pointer 
                    transition-colors hover:text-white duration-500 ease-in-out ${
                      nav === "dashboard" ? "text-white" : "text-[#7E7E7E]"
                    }`}
                  onClick={() => setNav("dashboard")}
                >
                  <MdDashboardCustomize /> <span>Dashboard</span>
                </div>

                <div
                  className={`flex items-center w-[20vw] gap-4 cursor-pointer transition-colors hover:text-white duration-500 ease-in-out ${
                    nav === "orders" ? "text-white" : "text-[#7E7E7E]"
                  }`}
                  onClick={() => setNav("orders")}
                >
                  <FaListUl /> <span>Orders</span>
                </div>

                <div
                  className={`flex items-center w-[20vw] gap-4 cursor-pointer 
                    transition-colors hover:text-white duration-500 ease-in-out ${
                      nav === "account" ? "text-white" : "text-[#7E7E7E]"
                    }`}
                  onClick={() => setNav("account")}
                >
                  <LuUser /> <span>Account details</span>
                </div>

                <div
                  className={`flex items-center w-[20vw] gap-4 cursor-pointer 
                    transition-colors hover:text-white duration-500 ease-in-out ${
                    nav === "address" ? "text-white" : "text-[#7E7E7E]"
                  }`}
                  onClick={() => setNav("address")}
                >
                  <SlDirection /> <span>Address</span>
                </div>

                <Link href="/wishlist">
                  <div
                    className={`flex items-center w-[20vw] gap-4 cursor-pointer 
                      transition-colors hover:text-white duration-500 ease-in-out ${
                        nav === "wishlist" ? "text-white" : "text-[#7E7E7E]"
                      }`}
                  >
                    <FaRegHeart /> <span>Wishlist</span>
                  </div>
                </Link>

                <div
                  className={`flex items-center w-[20vw] gap-4 cursor-pointer 
                    transition-colors hover:text-white duration-500 ease-in-out ${
                      nav === "track-order" ? "text-white" : "text-[#7E7E7E]"
                    }`}
                  onClick={() => setNav("tracking")}
                >
                  <MdOutlineLocalShipping /> <span>Track Order</span>
                </div>

                <div
                onClick={ logoutHandler}
                  className={`flex items-center w-[20vw] gap-4 cursor-pointer transition-colors hover:text-white duration-500 ease-in-out ${
                    nav === "log out" ? "text-white" : "text-[#7E7E7E]"
                  }`}
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
                    <h2 className="text-xl mb-3  pb-2">Orders </h2>

                    <div className="flex justify-between pb-2 border-b mb-4">
                      <span className="">Product</span>
                      <span className="">Product Title</span>
                      <span className="">Shipment Id</span>
                    </div>

                    {newOrders && newOrders.length > 0 ? (
                      newOrders.map((item: Order) => (
                        <div key={item.itemId} className="flex mb-2 justify-between">
                          <img src={item.image} alt="image" loading='lazy' className="h-20" />
                      
                           <p className="text-lg ">{item.title}</p>
                           
                           <p> {item.shipmentId ||
                                  `${
                                    item.title.substring(0, 5) +
                                    Math.floor(Math.random() * 100000 + 1)
                                  }`}
                                  
                                  ...
                                   </p>

                          
                        
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
                    <button
                      onClick={saveAccountDetails}
                      className="p-2 rounded-full bg-green-600 mt-4 w-20"
                    >
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
                    <button
                      onClick={saveAddress}
                      className="p-2 rounded-full bg-green-600 mt-4 w-20"
                    >
                      Save
                    </button>
                  </div>
                )}


                {
                  nav === "tracking" && (
                    <div>
                      <h2 className="text-xl mb-3 border-b pb-1">Order Tracking </h2>

                      <form action="" className="flex-col flex"  onSubmit={ submitHandler}>

                      <div className="mb-4">
                        <label htmlFor=""> Shipment ID </label>
                        <input type="text" onChange={ (e) => SetShipmentId(e.target.value)  }
                         value={ shipmentId }  
                         className="p-2 ml-3 rounded-md text-black focus:outline-none" />
                      </div>

                        <button className="bg-green-700 text-white w-[120px] p-2 rounded-full" > Track</button>

                      </form>

                    </div>
                  )
                }

              </div>
            </div>
          </div>

          {/* For small screen ( Mobile ) */}
          <div className="md:hidden lg:hidden xl:hidden mb-2 sm:block xs:block">
            {sidebar && (
              <div className="flex flex-col  h-[40vh] w-[60vw] justify-between  z-10">
                <div
                  className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                  onClick={() => {
                    setNav("dashboard");
                    setSidebar(false);
                  }}
                >
                  <MdDashboardCustomize /> <span>Dashboard</span>
                </div>

                <div
                  className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                  onClick={() => {
                    setNav("orders");
                    setSidebar(false);
                  }}
                >
                  <FaListUl /> <span>Orders</span>
                </div>

                <div
                  className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                  onClick={() => {
                    setNav("account");
                    setSidebar(false);
                  }}
                >
                  <LuUser /> <span>Account details</span>
                </div>

                <div
                  className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                  onClick={() => {
                    setNav("address");
                    setSidebar(false);
                  }}
                >
                  <SlDirection /> <span>Address</span>
                </div>

                <Link
                  href="/wishlist"
                  className={`flex items-center w-[60vw] gap-4 cursor-pointer`}
                >
                  <FaRegHeart /> <span>Wishlist</span>
                </Link>

                <Link
                  href="/track-order"
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

            {!sidebar && (
              <div className="flex-grow mx-2">
                {nav === "dashboard" && userData && (
                  <div>
                    <div className="flex text-2xl items-center gap-2 mb-4">
                      <MdOutlineArrowBackIosNew
                        onClick={() => setSidebar(true)}
                      />
                      <h2 className="text-xl ">Dashboard </h2>
                    </div>

                    <div className="px-10">
                      <p>Name: {userData.name}</p>
                      <p>Email: {userData.email}</p>
                      <p>Phone: {userData.phone}</p>
                    </div>
                  </div>
                )}

                {nav === "orders" && (
                  <div>
                    <div className="flex text-2xl items-center gap-2 mb-4">
                      <MdOutlineArrowBackIosNew
                        onClick={() => setSidebar(true)}
                      />
                      <h2 className="text-xl ">Orders </h2>
                    </div>

                    <div className="px-10">
                      
                      {newOrders && newOrders.length > 0 ? (
                        newOrders.map((item: Order) => (
                          <div key={item.itemId} className="flex mb-4 gap-4">
                            <img
                              className="w-20"
                              src={item.image}
                              alt={`${item.title} image`}
                            />
                            <div className="flex-row  ">
                              <p>{item.title}</p>
                              <p className="mt-3">
                               
                                {item.orderId ||
                                  `${
                                    item.title.substring(0, 3) +
                                    Math.floor(Math.random() * 100000 + 1)
                                  }`}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No orders found</div>
                      )}
                    </div>
                  </div>
                )}

                {nav === "account" && (
                  <div className="">
                    <div className="flex text-2xl items-center gap-2 mb-4">
                      <MdOutlineArrowBackIosNew
                        onClick={() => setSidebar(true)}
                      />
                      <h2 className="text-xl ">Account </h2>
                    </div>

                    <form className="flex px-10 flex-col justify-between gap-y-4 ">
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
                    <button
                      onClick={saveAccountDetails}
                      className="p-2 mx-10 rounded-full bg-green-600 mt-4 w-20"
                    >
                      Save
                    </button>
                  </div>
                )}

                {nav === "address" && (
                  <div className="">
                    <div className="flex text-2xl items-center gap-2 mb-4">
                      <MdOutlineArrowBackIosNew
                        onClick={() => setSidebar(true)}
                      />
                      <h2 className="text-xl ">Address </h2>
                    </div>

                    <form className="flex px-10 flex-col justify-between gap-y-4 w-full">
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
                    <button
                      onClick={saveAddress}
                      className="p-2 mx-10 rounded-full bg-green-600 mt-4 w-20"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex m-4 justify-center items-center">
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
