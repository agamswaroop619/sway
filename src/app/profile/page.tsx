'use client';  // Ensure this file is used as a client component

import Link from "next/link";
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { useRouter } from "next/navigation";

const userLoginInfo = (state: RootState) => state.user.isLoggedIn;
const userProfile = (state: RootState) => state.user.userProfile;

const Page = () => {

  const router = useRouter();

  const isLoggedIn = useAppSelector(userLoginInfo);
  const userProfileData = useAppSelector(userProfile);

  if( !isLoggedIn ) {
    router.push('/login');
  }
  
  return (
    <div className='m-10'>
      {
        !isLoggedIn ? (
          <>
            <p>This is my Profile</p>
            <Link href="/login" className='bg-slate-400 p-2 rounded-md m-4'>
              Login or Sign up
            </Link>
          </>
        ) : (
          <div>
            <p>Welcome Home</p>
            {userProfileData && (
              <div>
                <p>Name: {userProfileData.name}</p>
                <p>Email: {userProfileData.email}</p>
                <p>Phone: {userProfileData.phone}</p>
              </div>
            )}
          </div>
        )
      }
    </div>
  );
}

export default Page;
