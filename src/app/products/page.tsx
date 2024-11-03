'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CiFilter } from 'react-icons/ci';
import { MdOutlineClear } from 'react-icons/md';
import {  useRouter } from 'next/navigation';
import { IoSearchOutline } from "react-icons/io5";
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { Item, itemsDataInCart } from '@/lib/features/items/items';
import { getData } from '@/app/utils/getData';
import { setItemsData } from '@/lib/features/items/items';
import {StarRating} from '../components/Rating';
import RangeSlider from '../components/RangeSlider';



const ProductsPage = (  ) => {

  const dispatch = useAppDispatch();
  const [floatSiderbar, setFloatSiderbar] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('default');
  const [shopData, setShopData] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; // Number of products to show per page
  
  const data = useAppSelector(itemsDataInCart) || []; // Provide a default empty array
  const router = useRouter();

  const [ min, setMin ] = useState(100);
  const [ max, setMax ] = useState(1000);
  
  useEffect(() => {
    if (data.length === 0) {
      getData()
        .then((fetchedData) => {
          if (fetchedData && fetchedData.length > 0) {
            dispatch(setItemsData(fetchedData)); // Properly dispatch to update the Redux state
          } else {
            dispatch(setItemsData([])); // Handle no fetched data case
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          dispatch(setItemsData([])); // Handle error case by dispatching an empty array
        });
    } else {
      setShopData(data); // If data exists, update shopData state
    }
  }, [data, dispatch]);
  
  // Whenever the data changes, update shopData accordingly
  useEffect(() => {
    if (data.length > 0) {
      setShopData(data);
    }
  }, [data]);

 
  

// Filter and sort logic
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

    setShopData(filteredData);
  } else {
    router.push(`/products`);
    if( data && data.length > 0)
    setShopData(data );
  }
  setCurrentPage(1); // Reset to page 1 when the filter changes
}, [filter, data, router]);

let totalPages: number = 0;
let currentItems: Item[] = [];

// pagination of items
if (shopData && shopData.length > 0) {
  // Calculate pagination
  const totalItems = shopData.length;
  totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  currentItems = shopData.slice(startIndex, startIndex + itemsPerPage);
}

// Handle page changes
// const handlePageChange = (newPage: number) => {
//   if (newPage >= 1 && newPage <= totalPages) {
//     setCurrentPage(newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when changing pages
//   }
// };

const filterByPrice = () => {
   let filteredData = [...data];

   if( data && ( min !== 100 || max != 1000 )){
    filteredData = filteredData.filter(item => item.price >= min && item.price <= max);
    setShopData(filteredData);
   }
}


  return (
    <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row relative">

      {/* Mobile view filter button */}
      <div className="p-6 border w-full  relative hidden sm:block xs:block md:hidden lg:hidden xl:hidden">
       <div className='flex w-full items-center mb-2  justify-around'>
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
          
              <p>Price: ₹{min} — ₹{max}</p>
          <RangeSlider   min={min} setMin={setMin}
          max={max} setMax={setMax}
          onChange={({ min, max }: { min: number; max: number }) =>
              console.log(`min = ${min}, max = ${max}`)
          }   />
          <button className="bg-green-700 p-2 rounded-full mt-4 mb-2"
          onClick={ filterByPrice}>Filter</button>
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
          <p>Price: ₹{min} — ₹{max}</p>
          <RangeSlider   min={min} setMin={setMin}
          max={max} setMax={setMax}
          onChange={({ min, max }: { min: number; max: number }) =>
              console.log(`min = ${min}, max = ${max}`)
          }   />
          <button className="bg-green-700 p-2 rounded-full mt-4 mb-2"
          onClick={ filterByPrice}>Filter</button>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Filter by rating</h3>
          <p>⭐⭐⭐⭐⭐ (1)</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Filter by size</h3>
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
        <div className="h-14 py-4 flex justify-between items-center w-[100%] mx-8">
          <span className="hidden lg:block md:block xl:block">Displaying result</span>
          <select
            className="bg-black p-2 hidden lg:block md:block xl:block border focus:outline-none"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="default">Default sorting</option>
            <option value="popular">Sort by popularity</option>
            <option value="latest">Sort by latest</option>
            <option value="rating">Sort by average rating</option>
            <option value="low">Sort by Price: Low to high</option>
            <option value="high">Sort by Price: High to low</option>
          </select>
        </div>

        <div className="flex my-2 mx-4 flex-wrap justify-between w-full">
          {  currentItems.length === 0 ? (
            <p>No products found</p>
          ) : (
            currentItems.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="w-[33%] sm:w-[47%] xs:w-[47%] lg:w-[30%] md:w-[30%] xl:w-[30%] flex flex-col items-center mb-4"
              >
                <div className="relative group">
                  <img
                    src={item.images[0].url}
                    alt="image1"
                    className="w-[100%] h-[100%] object-cover transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                  />
                  <img
                    src={item.images[1].url}
                    alt="image2"
                    className="w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                  />
                </div>
                <div className="w-full p-3 text-center">
                  <h3 className="mb-2">{item.title}</h3>
                  <p>₹{item.price}</p>
                 
                  <div className='w-full flex items-center justify-center '>
                  { 
          item.review > 0 && (
          // Calculate the average rating from the user reviews
          <StarRating   rating= {item.review} /> )}
                  </div>

                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-4 w-full">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded mr-2 disabled:hidden"
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded ml-2 disabled:hidden"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
