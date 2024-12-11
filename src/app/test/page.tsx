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
  
// Redux and state imports
const params = useParams();
const dispatch = useAppDispatch();
const router = useRouter();

const [floatSidebar, setFloatSidebar] = useState(false);
const [filter, setFilter] = useState("default");
const [shopData, setShopData] = useState<Item[]>([]);
const itemsPerPage = 12;

const [min, setMin] = useState(100);
const [max, setMax] = useState(1000);

const data = useAppSelector(itemsDataInCart) || [];
const [filterRating, setFilterRating] = useState(0);
const [filterSize, setFilterSize] = useState("all");

const [totalPages, setTotalPages] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [currentItems, setCurrentItems] = useState<Item[]>([]);

// Memoized size index map
const sizeIndexMap = useMemo(() => ({
  small: 0,
  medium: 1,
  large: 2,
  xl: 3,
  xxl: 4,
}), []);

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

  const pages = Math.ceil(processedData.length / itemsPerPage);
  setTotalPages(pages);

  // Ensure currentPage is within bounds after filtering
  setCurrentPage((prev) => Math.min(prev, pages));

  const query = filter !== "default" ? `?orderby=${filter}` : "";
  router.push(`/test${query}`);
}, [filteredData, filter, filterRating, filterSize, min, max, sizeIndexMap, router, params.category]);

// Update shop data on filter/sort changes
useEffect(() => {
  applyFiltersAndSorting();
}, [applyFiltersAndSorting]);

// Update current items when shop data or current page changes
useEffect(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, shopData.length);
  setCurrentItems(shopData.slice(startIndex, endIndex));
}, [shopData, currentPage]);

// Rating filter
const ratingFilter = (rating: number) => {
  setFilterRating(rating);
};

// Size filter
const sizeFilter = (size: string) => {
  setFilterSize(size);
};


  return (
    <div className="flex sm:flex-col xs:flex-col md:flex-row lg:flex-row xl:flex-row relative">

      {/* Products */}
      <div className="flex flex-wrap justify-between w-[100vw]">
       

        <div className="flex my-2 mx-4 flex-wrap justify-between w-full">
          {shopData.length === 0 ? (
            <p>No products found</p>
          ) : (
            currentItems.map((item: Item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="w-[33%] sm:w-[47%] xs:w-[47%] lg:w-[17%] md:w-[30%] xl:w-[30%] flex flex-col items-center mb-4"
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
