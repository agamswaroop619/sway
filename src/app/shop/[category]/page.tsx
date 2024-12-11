"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CiFilter } from "react-icons/ci";
import { MdOutlineClear } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoSearchOutline } from "react-icons/io5";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Item, itemsDataInCart } from "@/lib/features/items/items";
import { getData } from "@/app/utils/getData";
import { setItemsData } from "@/lib/features/items/items";
import { StarRating } from "@/app/components/Rating";
import RangeSlider from "@/app/components/RangeSlider";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useCallback } from "react";

const ProductsPage = () => {
  
const params = useParams();
const dispatch = useAppDispatch();
const router = useRouter();

const [floatSiderbar, setFloatSiderbar] = useState(false);
const [filter, setFilter] = useState("default");
const [shopData, setShopData] = useState<Item[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 12;

const [min, setMin] = useState(100);
const [max, setMax] = useState(1000);

const data = useAppSelector(itemsDataInCart) || [];
const [filterRating, setFilterRating] = useState(0);
const [filterSize, setFilterSize] = useState("all");

// Fetch data if not in Redux store
useEffect(() => {
  if (data.length === 0) {
    getData()
      .then((fetchedData) => dispatch(setItemsData(fetchedData || [])))
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(setItemsData([]));
      });
  }
}, [dispatch, data.length]);

// Filter data based on params.category
const filteredData = useMemo(
  () => data.filter((item) => item.collection === params.category),
  [data, params.category]
);

// Apply filters and sorting
const applyFiltersAndSorting = useCallback(() => {
  let processedData = [...filteredData];

  // Filter by rating
  if (filterRating > 0) {
    processedData = processedData.filter((item) => item.review >= filterRating);
  }

  // Filter by size
  if (filterSize !== "all") {
    const sizeIndexMap: Record<string, number> = {
      small: 0,
      medium: 1,
      large: 2,
      xl: 3,
      xxl: 4,
    };
    const idx = sizeIndexMap[filterSize];
    processedData = processedData.filter((item) => item.quantity[idx] > 0);
  }

  // Filter by price range
  if (min !== 100 || max !== 1000) {
    processedData = processedData.filter(
      (item) => item.price >= min && item.price <= max
    );
  }

  // Sort data
  switch (filter) {
    case "rating":
      processedData.sort((a, b) => b.review - a.review);
      break;
    case "low":
      processedData.sort((a, b) => a.price - b.price);
      break;
    case "high":
      processedData.sort((a, b) => b.price - a.price);
      break;
  }

  setShopData(processedData);
  setCurrentPage(1);
  const query = filter !== "default" ? `?orderby=${filter}` : "";
  router.push(`/shop/${params.category}${query}`);
}, [filteredData, filter, filterRating, filterSize, min, max, router, params.category]);

useEffect(() => {
  applyFiltersAndSorting();
}, [applyFiltersAndSorting]);

// Paginate data
const paginatedData = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return shopData.slice(startIndex, startIndex + itemsPerPage);
}, [shopData, currentPage, itemsPerPage]);



// Rating filter
const ratingFilter = (rating: number) => {
  setFilterRating(rating);
};

// Size filter
const sizeFilter = (size: string) => {
  setFilterSize(size);
};

const [totalPages, setTotalPages] = useState(0);

useEffect(() => {
  if (shopData.length > 0) {
    const pages = Math.ceil(shopData.length / itemsPerPage);
    setTotalPages(pages);
    setCurrentPage((prevPage) => (prevPage > pages ? pages : prevPage));
  }
}, [shopData]);



  return (
    <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row relative">
      
          {/* Mobile view filter button */}
<div className="p-6 border w-full relative hidden xs:block sm:block md:hidden lg:hidden xl:hidden">
  <div className="flex w-full items-center mb-2 justify-around">
    <CiFilter
      className="text-white border text-3xl p-1 cursor-pointer"
      onClick={() => setFloatSiderbar(!floatSiderbar)}
    />
    <select
      className="bg-black p-2 border text-white focus:outline-none"
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
</div>

{/* Mobile floating sidebar */}
{floatSiderbar && (
  <div className="fixed top-0 left-0 z-30 w-[80vw] max-w-[500px] h-screen bg-black text-white p-4 overflow-y-auto">
    {/* Header with Close Icon */}
    <div className="flex items-center mb-4">
      <input
        type="text"
        placeholder="Search products"
        className="p-2 rounded-full w-full bg-gray-800 text-white"
      />
      <MdOutlineClear
        className="text-3xl cursor-pointer ml-2"
        onClick={() => setFloatSiderbar(false)}
      />
    </div>

    {/* Price Filter */}
    <div>
          <div className="  relative h-28">
            <h3 className="font-bold mb-2 ">Filter by price</h3>

            <p>
              Price: ₹{min} — ₹{max}
            </p>
            <div className="absolute mb-1 h-28 top-13 left-[0px] ">
              <RangeSlider
                min={min}
                setMin={setMin}
                max={max}
                setMax={setMax}
                onChange={({ min, max }: { min: number; max: number }) =>
                  console.log(`min = ${min}, max = ${max}`)
                }
              />
            </div>
          </div>
        </div>

        <div className="  relative h-28">
            <h3 className="font-bold mb-2 ">Filter by price</h3>

            <p>
              Price: ₹{min} — ₹{max}
            </p>
            <div className="absolute mb-1 h-28 top-13 left-[0px] ">
              <RangeSlider
                min={min}
                setMin={setMin}
                max={max}
                setMax={setMax}
                onChange={({ min, max }: { min: number; max: number }) =>
                  console.log(`min = ${min}, max = ${max}`)
                }
              />
            </div>
          </div>

    {/* Rating Filter */}
    <div className="mb-6">
      <h3 className="font-bold mb-2">Filter by Rating</h3>
      {[4, 3, 2, 1].map((rating) => (
        <div
          key={rating}
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => {
            setFloatSiderbar(false);
            ratingFilter(filterRating === rating ? 0 : rating);
          }}
        >
          <input type="checkbox" checked={filterRating === rating} readOnly />
          <label className="hover:text-white transition-colors duration-300">
            {rating} ⭐ & above
          </label>
        </div>
      ))}
    </div>

    {/* Size Filter */}
    <div>
      <h3 className="font-bold mb-2">Filter by Size</h3>
      {["small", "medium", "large", "xl", "xxl"].map((size) => (
        <button
          key={size}
          className={`block w-full text-left p-2 ${
            filterSize === size ? "text-white" : "text-gray-400"
          } hover:text-white transition-colors duration-300`}
          onClick={() => {
            setFloatSiderbar(false);
            sizeFilter(filterSize === size ? "all" : size);
          }}
        >
          { !(size.includes('x')) ? size.charAt(0).toUpperCase() + size.slice(1) : size.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
)}

{/* Desktop Sidebar */}
<div className="hidden md:block lg:block xl:block w-1/4 p-4 sticky top-0">
  {/* Search Bar */}
  <div className="mb-4 flex items-center bg-white rounded-full border px-4">
    <input
      type="text"
      placeholder="Search products"
      className="p-2 bg-transparent flex-grow focus:outline-none"
    />
    <IoSearchOutline className="text-xl" />
  </div>

  {/* Price Filter */}
 <div>
          <div className="  relative h-28">
            <h3 className="font-bold mb-2 ">Filter by price</h3>

            <p>
              Price: ₹{min} — ₹{max}
            </p>
            <div className="absolute mb-1 h-28 top-13 left-[0px] ">
              <RangeSlider
                min={min}
                setMin={setMin}
                max={max}
                setMax={setMax}
                onChange={({ min, max }: { min: number; max: number }) =>
                  console.log(`min = ${min}, max = ${max}`)
                }
              />
            </div>
          </div>
        </div>

  {/* Rating Filter */}
  <div className="mb-6">
    <h3 className="font-bold mb-2">Filter by Rating</h3>
    {[4, 3, 2, 1].map((rating) => (
      <div
        key={rating}
        className="flex gap-3 items-center cursor-pointer"
        onClick={() => ratingFilter(filterRating === rating ? 0 : rating)}
      >
        <input type="checkbox" checked={filterRating === rating} readOnly />
        <label className=" cursor-pointer">
          {rating} ⭐ & above
        </label>
      </div>
    ))}
  </div>

  {/* Size Filter */}
  <div>
    <h3 className="font-bold mb-2">Filter by Size</h3>
    {["small", "medium", "large", "xl", "xxl"].map((size) => (
      <button
        key={size}
        className={`block w-full text-left p-2 ${
          filterSize === size ? "text-white" : "text-gray-400"
        } hover:text-white transition-colors duration-300`}
        onClick={() => sizeFilter(filterSize === size ? "all" : size)}
      >
        {size.charAt(0).toUpperCase() + size.slice(1)}
      </button>
    ))}
  </div>
</div>

      {/* Products */}
      <div className="flex flex-wrap justify-between w-[100vw]">
        <div className="h-14 py-4 flex justify-between items-center w-[100%] mx-8">
          <span className="hidden lg:block md:block xl:block">
            Displaying result
          </span>
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
          {shopData.length === 0 ? (
            <p>No products found</p>
          ) : (
            shopData.map((item: Item) => (
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

                  <div className="w-full flex items-center justify-center ">
                    {item.review > 0 && (
                      // Calculate the average rating from the user reviews
                      <StarRating rating={item.review} />
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
    
          {/* Pagination */}
          <div className="flex justify-center mt-4 w-full">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded mr-2 ${
      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    Previous
  </button>
  <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
  <button
    onClick={() =>
      setCurrentPage((prev) => Math.min(prev + 1, totalPages))

    }
    disabled={currentPage === totalPages}
    className={`px-4 py-2 rounded ml-2 ${
      currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    Next
  </button>
</div>

      </div>
    </div>
  );
};

export default ProductsPage;
