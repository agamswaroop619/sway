'use client'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { itemsDataInCart } from '@/lib/features/items/items';
import Link from 'next/link';
import { CiFilter } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { MdOutlineClear } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { Item } from '@/lib/features/items/items';

const SearchPage = () => {

  // search query
  const params = useParams();
  const query = params.results;
  const input= String(query);

  
  const data = useAppSelector(itemsDataInCart);

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

    if( data && data?.length> 0) {
      const searchResults = data.filter( (item) : item is Item => item.title.toUpperCase() == input.toUpperCase() );
     
      if (searchResults.length < 1) {
          setStatus(true);
      } else{
        setInfo(searchResults);
        setSearchData(searchResults);

      }
    }
      
  }, [input]); // Depend on 'input' instead of 'params' for a more accurate dependency

  useEffect(() => {
    if (filter !== "default" && data && data.length > 0) {
      router.push(`/products?orderby=${filter}`);
      let filteredData = [...data]; // Create a shallow copy to avoid mutating original data
  
      if (filter === "popular") {
        // Implement popular sorting logic here
      } else if (filter === "latest") {
        // Implement latest sorting logic here
      } else if (filter === "rating") {
        filteredData = filteredData.sort((a, b) => b.review - a.review); // Sort by rating
      } else if (filter === "low") {
        filteredData = filteredData.sort((a, b) => a.price - b.price); // Sort by low price
      } else if (filter === "high") {
        filteredData = filteredData.sort((a, b) => b.price - a.price); // Sort by high price
      }
  
      setSearchData(filteredData);
    } else {
      router.push(`/products`);
      if( data && data.length > 0)
      setSearchData(data );
    }
  }, [filter, router, info, input]);  // Added `info` and `input` as dependencies
  


  if( info.length > 0)
  return (
    <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row relative">
      
    {/* Mobile view filter button */}
    <div className="p-6 border w-full  relative hidden sm:block xs:block md:hidden lg:hidden xl:hidden">
     <div className='flex w-full items-center pb-4  justify-around'>
     <CiFilter
        className="text-white  border text-3xl p-1"
        onClick={() => setFloatSiderbar(!floatSiderbar)}
      />
      <select className="bg-black p-2 border focus:outline-none" onChange={(e) => setFilter(e.target.value)}>
          <option value="default">Default sorting</option>
          <option value="popular">Sort by popularity</option>
          <option value="latest">Sort by latest</option>
          <option value="rating">Sort by average rating</option>
          <option value="low">Sort by Price: Low to high</option>
          <option value="high">Sort by Price: High to low</option>
        </select>
     </div>

    </div>

    {floatSiderbar && (
      <div className="absolute left-0 z-10">
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
      
    <div className='text-black mb-2 px-4 bg-white rounded-full flex border items-center'>
          <input
            type="text"
            placeholder="Search products"
            className="p-2 focus:outline-none  bg-transparent"
          />
          <IoSearchOutline className=' text-xl' />
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

    {/* Products */}
    <div className="flex flex-wrap justify-between w-[100vw]">

      <div className="h-14  py-4 flex justify-between items-center w-[100%] mx-8">
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


    <div className='flex my-2 mx-4 flex-wrap justify-between  w-full '>
      {
        searchData.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="w-[33%] sm:w-[47%] xs:w-[47%] lg:w-[30%] md:w-[30%] xl:w-[30%] flex flex-col items-center mb-4"
          >
            <div className="relative group">
              <img
                src={item.images[0].url}
                alt="image1"
                className="w-[100%] h-[100%] object-cover  transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
              />
              <img
                src={item.images[1].url}
                alt="image2"
                className="w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
              />
            </div>
            <div className="w-full p-3 text-center">
              <h3 className="mb-2">{item.title} | Oversized-T-shirt | Sway Clothing</h3>
              <p>₹{item.price}</p>
            </div>
          </Link>
        ))
      }
    </div>
    </div>
  </div>
  )
  else if( status === true)
    return(
      <div className='flex flex-col w-full h-screen justify-center items-center text-2xl'>
       <p className='pb-4'> Products not found ...</p>
       <Link href="/products">
         <p className='border p-2 rounded-md bg-gray-300 text-black'>   Back to products</p>
       </Link>
      </div>
    )
  else
  (
    <div className='flex w-full h-screen justify-center items-center text-2xl '>Loading...</div>
  )
}

export default SearchPage