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
import { useCallback } from "react";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [mount, setMount] = useState(false);

  const [floatSiderbar, setFloatSiderbar] = useState(false);
  const [filter, setFilter] = useState("default");
  const [shopData, setShopData] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

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
          // console.error("Error fetching data:", error);
          if (error instanceof Error) {
            console.error("");
          }
          dispatch(setItemsData([]));
        });
    }
  }, [dispatch, data.length]);

  // Apply filters and sorting
  const applyFiltersAndSorting = useCallback(() => {
    let processedData = [...data];

    // Filter by rating
    if (filterRating > 0) {
      processedData = processedData.filter(
        (item) => item.review >= filterRating
      );
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

    // Avoid redundant updates
    setShopData((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(processedData)) {
        return processedData;
      }
      return prevData;
    });

    setCurrentPage(1);
    const query = filter !== "default" ? `?orderby=${filter}` : "";
    router.push(`/products/${query}`);

    setMount(true);
  }, [data, filter, filterRating, filterSize, min, max, router]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [applyFiltersAndSorting]);

  // Rating filter
  const ratingFilter = (rating: number) => {
    setFilterRating(rating);
  };

  // Size filter
  const sizeFilter = (size: string) => {
    setFilterSize(size);
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  if (!mount) {
    return (
      /* From Uiverse.io by Fresnel11 */
      <div className="min-w-screen min-h-screen flex bg-slate-500 justify-center align-middle items-center">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  } else
    return (
      <div className="responsive-flex-col relative min-h-screen bg-gradient-to-b from-black to-green-950">
        {/* Mobile view filter button */}
        <div className="responsive-padding border-b border-gray-700 w-full relative block md:hidden lg:hidden xl:hidden bg-black/50 backdrop-blur-sm">
          <div className="flex w-full items-center justify-between">
            <button
              className="flex items-center gap-2 text-white border border-gray-600 rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors duration-300"
              onClick={() => setFloatSiderbar(!floatSiderbar)}
            >
              <CiFilter className="text-xl" />
              <span className="text-sm">Filters</span>
            </button>

            <select
              className="bg-black border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
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
          <div className="fixed top-0 left-0 z-50 w-full h-screen bg-black/90 backdrop-blur-sm">
            <div className="w-full max-w-sm h-full bg-black text-white p-4 overflow-y-auto">
              {/* Header with Close Icon */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setFloatSiderbar(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <MdOutlineClear className="text-2xl" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="flex items-center bg-white rounded-full px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search products"
                    className="flex-1 bg-transparent text-black focus:outline-none text-sm"
                  />
                  <IoSearchOutline className="text-gray-600" />
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-white">
                  Filter by price
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Price: ₹{min} — ₹{max}
                </p>
                <div className="px-2">
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
                <h3 className="font-semibold mb-3 text-white">
                  Filter by Rating
                </h3>
                {[4, 3, 2, 1].map((rating) => (
                  <div
                    key={rating}
                    className="flex gap-3 items-center cursor-pointer py-2 hover:bg-gray-800 rounded px-2 transition-colors duration-300"
                    onClick={() => {
                      ratingFilter(filterRating === rating ? 0 : rating);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filterRating === rating}
                      readOnly
                      className="w-4 h-4"
                    />
                    <label className="text-sm cursor-pointer">
                      {rating} ⭐ & above
                    </label>
                  </div>
                ))}
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-white">
                  Filter by Size
                </h3>
                {["small", "medium", "large", "xl", "xxl"].map((size) => (
                  <button
                    key={size}
                    className={`block w-full text-left p-2 rounded transition-colors duration-300 ${
                      filterSize === size
                        ? "bg-green-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      sizeFilter(filterSize === size ? "all" : size);
                    }}
                  >
                    {!size.includes("x")
                      ? size.charAt(0).toUpperCase() + size.slice(1)
                      : size.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={() => setFloatSiderbar(false)}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block lg:block xl:block w-full md:w-1/4 lg:w-1/4 xl:w-1/4 p-4 sticky top-20 h-fit">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex items-center bg-white rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search products"
                  className="flex-1 bg-transparent text-black focus:outline-none"
                />
                <IoSearchOutline className="text-gray-600" />
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-white">Filter by price</h3>
              <p className="text-sm text-gray-300 mb-4">
                Price: ₹{min} — ₹{max}
              </p>
              <div className="px-2">
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
              <h3 className="font-semibold mb-3 text-white">
                Filter by Rating
              </h3>
              {[4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className="flex gap-3 items-center cursor-pointer py-2 hover:bg-gray-800 rounded px-2 transition-colors duration-300"
                  onClick={() =>
                    ratingFilter(filterRating === rating ? 0 : rating)
                  }
                >
                  <input
                    type="checkbox"
                    checked={filterRating === rating}
                    readOnly
                    className="w-4 h-4"
                  />
                  <label className="text-sm cursor-pointer">
                    {rating} ⭐ & above
                  </label>
                </div>
              ))}
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-white">Filter by Size</h3>
              {["small", "medium", "large", "xl", "xxl"].map((size) => (
                <button
                  key={size}
                  className={`block w-full text-left p-2 rounded transition-colors duration-300 ${
                    filterSize === size
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => sizeFilter(filterSize === size ? "all" : size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1 responsive-padding">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 py-4 border-b border-gray-700">
            <span className="hidden md:block lg:block xl:block text-white">
              Displaying {currentItems.length} of {shopData.length} results
            </span>
            <select
              className="bg-black border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 hidden md:block lg:block xl:block"
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

          {/* Products Grid */}
          <div className="product-grid-responsive gap-4 xs:gap-4 sm:gap-6 md:gap-6 lg:gap-6 xl:gap-6">
            {currentItems.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-white text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              currentItems.map((item: Item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300 hover-lift"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.images[0].url}
                      loading="lazy"
                      alt={item.title}
                      className="w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                    />
                    <img
                      src={item.images[1].url}
                      loading="lazy"
                      alt={item.title}
                      className="w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-green-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-green-500 font-bold text-lg mb-2">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center justify-center mb-2">
                      {item.review > 0 && <StarRating rating={item.review} />}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 mb-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg mr-4 transition-colors duration-300 ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Previous
              </button>
              <span className="text-white px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ml-4 transition-colors duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
};

export default ProductsPage;
