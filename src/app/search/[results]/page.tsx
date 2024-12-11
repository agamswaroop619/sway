"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { itemsDataInCart } from "@/lib/features/items/items";
import Link from "next/link";
import { CiFilter } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { MdOutlineClear } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { Item } from "@/lib/features/items/items";
import { getData } from "@/app/utils/getData";
import { setItemsData } from "@/lib/features/items/items";
import { useDispatch } from "react-redux";
import RangeSlider from "@/app/components/RangeSlider";

const SearchPage = () => {


  const params = useParams();
  const query = params.results;
  const input = String(query).replace(/%20/g, " ");

  // Call all hooks at the top level of the component
  const dataFromCart = useAppSelector(itemsDataInCart); // Do this only once at the top level
  const dispatch = useDispatch();
  const router = useRouter();

  // state management
  const [data, setData] = useState<Item[] | null>(null); // State to store data
  const [searchData, setSearchData] = useState<Item[]>([]); // For storing search results
  const [info, setInfo] = useState<Item[]>([]); // For filtered and search results

  const [floatSiderbar, setFloatSiderbar] = useState<boolean>(false); // For mini screen sidebar
  const [filter, setFilter] = useState<string>(""); // For filtering data

  const [status, setStatus] = useState(false); // For "products not found" status

  const [min, setMin] = useState(100);
  const [max, setMax] = useState(1000);

  const [filterSize, setFilterSize] = useState("");
  const [filterRating, setFilterRating] = useState(0);

  const ratingFilter = (rating: number) => {
    setFilterRating(rating);

    if (data) {
      if (rating < 1) {
        setSearchData(data);
      } else {
        const originalData = [...data];
        const filteredData = originalData.filter(
          (item) => item.review >= rating
        );
        setSearchData(filteredData);
      }
    }
  };

  // filter using size
  const sizeFilter = (size: string) => {
    setFilterSize(size);

    if (data) {
      if (size === "all") {
        setSearchData(data);
      } else {
        const originalData = [...data];

        let idx = 0;
        switch (size) {
          case "small":
            idx = 0;
            break;
          case "medium":
            idx = 1;
            break;
          case "large":
            idx = 2;
            break;
          case "xl":
            idx = 3;
            break;
          case "xxl":
            idx = 4;
            break;
        }

        const filteredData = originalData.filter(
          (item) => item.quantity[idx] > 0
        );
        setSearchData(filteredData);
      }
    }
  };

  // Set initial data using useAppSelector
  useEffect(() => {
    if (dataFromCart && dataFromCart.length > 0) {
      setData(dataFromCart);
    } else {
      setData(null); // Ensure data is set to null if there's no cart data
    }
  }, [dataFromCart]);

  useEffect( () => {

    if( data && ( min !== 100 || max != 1000 )){
      let filteredData = [...data];
     filteredData = filteredData.filter(item => item.price >= min && item.price <= max);
     setSearchData(filteredData);
    }
  
  }, [data, searchData, min, max])

  // Handle data fetching if not available
  useEffect(() => {
    if (!data) {
      getData()
        .then((fetchedData) => {
          if (fetchedData && fetchedData.length > 0) {
            dispatch(setItemsData(fetchedData)); // Dispatch to Redux state
            setData(fetchedData); // Update local state
          } else {
            dispatch(setItemsData([])); // Dispatch empty data in case of no results
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          dispatch(setItemsData([])); // Handle error by dispatching empty array
        });
    }
  }, [data, dispatch]);

  // Perform search based on the input
  useEffect(() => {
    if (data && data.length > 0) {
      const searchResults = data.filter((item) => {
        const normalizedInput = input.toLowerCase();
        const normalizedTitle = item.title.toLowerCase();
        const categoryMatch = item.category.some((cat) =>
          cat.toLowerCase().includes(normalizedInput)
        );

        return normalizedTitle.includes(normalizedInput) || categoryMatch;
      });

      if (searchResults.length < 1) {
        setStatus(true); // No products found
      } else {
        setStatus(false); // Reset status if products are found
        setInfo(searchResults); // Update filtered info
        setSearchData(searchResults); // Update search data
      }
    }
  }, [input, data]);

  // Handle sorting/filtering when filter changes
  useEffect(() => {
    if (filter !== "default" && filter !== "" && data && data.length > 0) {
      router.push(`/search/${input}?orderby=${filter}`);
      let filteredData = [...searchData]; // Create a shallow copy to avoid mutating the original array

      switch (filter) {
        case "popular":
          // Sorting logic for popular (implement if available)
          break;
        case "latest":
          // Sorting logic for latest (implement if available)
          break;
        case "rating":
          filteredData = filteredData.sort((a, b) => b.review - a.review); // Sort by review rating
          break;
        case "low":
          filteredData = filteredData.sort((a, b) => a.price - b.price); // Sort by low price
          break;
        case "high":
          filteredData = filteredData.sort((a, b) => b.price - a.price); // Sort by high price
          break;
        default:
          break;
      }

      setSearchData(filteredData); // Update searchData with sorted data
    } else {
      router.push(`/search/${input}`);
    }
  }, [filter, router, data, input]);

  if (info.length > 0)
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
          <div className="h-14  py-4 flex justify-between items-center w-[100%] mx-8">
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

          <div className="flex my-2 mx-4 flex-wrap justify-between  w-full ">
            {searchData.map((item) => (
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
                  <h3 className="mb-2">
                    {item.title} | Oversized-T-shirt | Sway Clothing
                  </h3>
                  <p>₹{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  else if (status === true)
    return (
      <div className="flex flex-col w-full h-screen justify-center items-center text-2xl">
        <p className="pb-4"> Products not found ...</p>
        <Link href="/products">
          <p className="border p-2 rounded-md bg-gray-300 text-black">
            {" "}
            Back to products
          </p>
        </Link>
      </div>
    );
  else
    <div className="flex w-full h-screen justify-center items-center text-2xl ">
      Loading...
    </div>;
};

export default SearchPage;
