'use client'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { data } from '@/app/data';
import Link from 'next/link';
import { CiFilter } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { MdOutlineClear } from 'react-icons/md';

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

  // search query
  const params = useParams();
  const query = params.results;
  const input= String(query);

  // float side bar for mini screen
  const [floatSiderbar, setFloatSiderbar]= useState<boolean>(false);

  // for filtering data 
  const [filter, setFilter ] = useState("default");

  // search results based on input
  const [ searchData , setSearchData ] = useState<Item[]>([]);

  const router = useRouter();

  const [info, setInfo] = useState<Item[]>([]);
  // if status is true -> products not found
  const [status, setStatus] = useState(false);

  useEffect(() => {

    console.log("params : ",params);

      const searchResults = data.filter( (item) : item is Item => item.title.toUpperCase() == input.toUpperCase() );
     
      if (searchResults.length < 1) {
          setStatus(true);
      } else{
        setInfo(searchResults);
        setSearchData(searchResults);

      }
  }, [input]); // Depend on 'input' instead of 'params' for a more accurate dependency

  useEffect(() => {
    if (filter !== "default") {
      router.push(`/search/${input}?orderby=${filter}`);
  
      if (filter === "rating") {
        const filteredData = [...info].sort((a, b) => a.review - b.review);
        setSearchData(filteredData);
      } else if (filter === "low") {
        const filteredData = [...info].sort((a, b) => a.price - b.price);
        setSearchData(filteredData);
      } else {
        const filteredData = [...info].sort((a, b) => b.price - a.price);
        setSearchData(filteredData);
      }
    } else {
      router.push(`/search/${input}`);
      setSearchData([...info]); // Copy the array to ensure React detects the state change
    }
  }, [filter, router, info, input]);  // Added `info` and `input` as dependencies
  


  if( info.length > 0)
  return (
    <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row relative">

          {/* Floating sidebar */}
          <div className='p-6  hidden sm:block xs:block md:hidden lg:hidden xl:hidden'>
            
            <CiFilter className='text-white border text-3xl p-1' onClick={ () => setFloatSiderbar(!floatSiderbar) } />

            <select className="bg-black p-2 border focus:outline-none" onChange={(e) => setFilter(e.target.value)}>
            <option value="default">Default sorting</option>
            <option value="popular">Sort by popularity</option>
            <option value="latest">Sort by latest</option>
            <option value="rating">Sort by average rating</option>
            <option value="low">Sort by Price: Low to high</option>
            <option value="high">Sort by Price: High to low</option>
          </select>

          </div>

          {floatSiderbar && (
        <div className='absolute left-0 z-10'>
           <div className="z-10 w-[80vw] h-screen max-w-[500px] bg-black text-white">
            <div className="flex  px-5 items-center">
            <input type="text" placeholder="Search products" className="p-2 rounded-full w-full mb-4" />
            <MdOutlineClear className="text-3xl" onClick={() => setFloatSiderbar(!floatSiderbar)} />
            </div>
    
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
        </div>
      )}

          {/* Sidebar */}
          <div className="w-1/4 p-4 hidden md:block lg:block xl:block">
            <input type="text" placeholder="Search products" className="p-2 rounded-full w-full mb-4" />
    
            <div className="mb-4">
              <h3 className="font-bold mb-2">Filter by price</h3>
              <button className="bg-green-700 p-2 rounded-full mb-2">Filter</button>
              <input type="range" min="0" step="11" max="100" value="0" />
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
          <div className="h-10 flex justify-between items-center w-[100%] mx-8">
          <span className='hidden lg:block md:block xl:block'>Displaying result</span>
          <select className="bg-black p-2 hidden lg:block md:block xl:block border focus:outline-none" onChange={(e) => setFilter(e.target.value)}>
            <option value="default">Default sorting</option>
            <option value="popular">Sort by popularity</option>
            <option value="latest">Sort by latest</option>
            <option value="rating">Sort by average rating</option>
            <option value="low">Sort by Price: Low to high</option>
            <option value="high">Sort by Price: High to low</option>
          </select>
        </div>
          {
            searchData.map( (item) => {
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