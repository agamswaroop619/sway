'use client'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { data } from '@/app/data';
import Link from 'next/link';
import FloatingSidebar from '@/app/components/FloatingSiderbar';
import { CiFilter } from 'react-icons/ci';

interface Image {
  url: string;
  imgId: number;
}

interface Item {
  id: number;
  title: string;
  images: Image[];
  price: number;
  description: string;
  category: string;
  quantity: number;
  descImg: string;
  color: string;
  review: number;
}

const SearchPage: React.FC = () => {

  const params = useParams();
  const query = params.results;
  const input= String(query);

  const [floatSiderbar, setFloatSiderbar]= useState<boolean>(false);

  const [info, setInfo] = useState<Item[]>([]);
  // if status is true -> products not found
  const [status, setStatus] = useState(false);

  useEffect(() => {
   
      const searchResults = data.filter( (item) : item is Item => item.title.toUpperCase() == input.toUpperCase() );
      
      // Update the state with search results
      setInfo(searchResults);
      console.log("info : ",info);
      console.log("results: ", searchResults);

     
      if (searchResults.length < 1) {
          setStatus(true);
      }
  }, [input]); // Depend on 'input' instead of 'params' for a more accurate dependency

  useEffect(() => {
    console.log("info updated: ", info);
  }, [info]);
  

  if( info.length > 0)
  return (
    <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row relative">
          {/* Floating sidebar */}
          <div className='p-6  hidden sm:block xs:block md:hidden lg:hidden xl:hidden'>
            <CiFilter className='text-white border text-3xl p-1' onClick={ () => setFloatSiderbar(!floatSiderbar) } />
          </div>

          {floatSiderbar && (
        <div className='absolute left-0 z-10'>
          <FloatingSidebar floatSiderbar={floatSiderbar} setFloatSiderbar={setFloatSiderbar}  />
        </div>
      )}

          {/* Sidebar */}
          <div className="w-1/4 p-4 hidden md:block lg:block xl:block">
            <input type="text" placeholder="Search products" className="p-2 rounded-full w-full mb-4" />
    
            <div className="mb-4">
              <h3 className="font-bold mb-2">Filter by price</h3>
              <button className="bg-green-700 p-2 rounded-full mb-2">Filter</button>
              <p>Price: ₹690 — ₹700</p>
            </div>
    
            <div className="mb-4">
              <h3 className="font-bold mb-2">Filter by rating</h3>
              <p>⭐⭐⭐⭐⭐ (1)</p>
            </div>
    
            <div>
              <h3 className="font-bold mb-2">Filter by brand</h3>
              <ul>
                <li><button className="p-2">Small</button></li>
                <li><button className="p-2">Medium</button></li>
                <li><button className="p-2">Large</button></li>
                <li><button className="p-2">XL</button></li>
                <li><button className="p-2">XXL</button></li>
              </ul>
            </div>
          </div>
    
          {/* Products */}
          <div className='flex flex-wrap justify-between  sm:w-[95vw] xs:w-[95vw] sm:justify-center xs:justify-center'>
          {
            info.map( (item) => {
              return (
                <Link key={item.id} href={`/products/${item.id}`} className='w-[30%] sm:w-[48%] xs:w-[48%] lg:w-[30%] md:w-[30%] xl:w-[30%] flex flex-col items-center border-b my-2 p-2'>
                <div className="relative group">
              <img
                src={item.images[0].url}
                alt="image1"
                className="w-[100%] h-[100%] object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
              />
              <img
                src={item.images[1].url}
                alt="image2"
                className="w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
              />
            </div>
                 <div className='w-full p-4 text-center'>
                 <h3 className=" mb-2 ">{item.title} | Oversized-T-shirt | Sway Clothing</h3>
                 <p>₹499</p>
                 </div>

                  </Link>
              )
            })
          }
        </div>
        
        </div>
  )
  else if( status === true)
    return(
      <div className='flex w-full h-screen justify-center items-center text-2xl'>
        Products not found ...
      </div>
    )
  else
  (
    <div className='flex w-full h-screen justify-center items-center text-2xl '>Loading...</div>
  )
}

export default SearchPage