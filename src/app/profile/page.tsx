'use client';  // Ensure this file is used as a client component

import Link from "next/link";
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
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

  const [ nav, setNav ] = useState("dashboard");


  if( !isLoggedIn ) {
    router.push('/login');
  }
  
  return (
    <div className='m-8'>
      {
        !isLoggedIn ? (
          <>
            <p>This is my Profile</p>
            <Link href="/login" className='bg-slate-400 p-2 rounded-md m-4'>
              Login or Sign up
            </Link>
          </>
        ) : (
          <div className="flex ">
            
            <div className="flex flex-col h-[75vh] w-[20vw] justify-between border-r-[1px]">

              <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              onClick={ () => setNav("dashboard")} >

                 <MdDashboardCustomize/>  <span>Dashboard</span>
              </div>

              <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              onClick={ () => setNav("orders")} >

                 < FaListUl />  <span>Orders</span>
              </div>

              <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              onClick={ () => setNav("account")} >

                 <LuUser/>  <span>Account details</span>
              </div>


              <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              onClick={ () => setNav("address")} >

                 <SlDirection/>   <span>Address</span>
              </div>


              <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`} >

                <FaRegHeart/>  <span>Wishlist</span>
              </div>


              <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`}
              onClick={ () => setNav("track-order")} >

                 <MdOutlineLocalShipping/>  <span>Track Order</span>
              </div>

              <div className={`flex items-center w-[20vw] gap-4 cursor-pointer`} >

                 <LuLogOut/>  <span>Log out</span>
              </div>

            </div>

            <div>

              {
                nav === "dashboard"  && <div>
               
                 {userProfileData && (
              <div>
                <p>Name: {userProfileData.name}</p>
                <p>Email: {userProfileData.email}</p>
                <p>Phone: {userProfileData.phone}</p>
              </div>
            )}
              
                </div>
              }

              {
                nav === "orders" && <div> Orders</div>
              }

              {
                nav === "account" && <div> Accounts</div>
              }

              {
                nav === "address" && <div>Address</div>
              }

              {
                nav === "track-order" && <div> Order track</div>
              }



            </div>
            
          </div>
        )
      }
    </div>
  );
}

export default Page;
