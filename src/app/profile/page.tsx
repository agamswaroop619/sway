import React from 'react';
import Link from "next/link";

const page = () => {
  return (
    <div className='m-10'>

      This is my Profile

          <Link href="/login" className='bg-slate-400 p-2 rounded-md m-4'>
          Login or Sign up
          </Link>
      
    </div>
  )
}

export default page
