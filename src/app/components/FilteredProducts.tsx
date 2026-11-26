"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { CiFilter } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { Item } from "@/lib/features/items/items";
import { setItemsData } from "@/lib/features/items/items";
import { setProductsData } from "@/lib/features/products/productsSlice";
import RangeSlider from "@/app/components/RangeSlider";
import { useSearchParams } from "next/navigation";
import { getData } from "@/app/utils/getData";

interface FilteredProductsProps {
  filterType: "search" | "category" | "products"; // Type of filtering
  searchQuery?: string; // For search page
  categoryName?: string; // For shop/category page
}

const ProductCard = React.memo(({ item }: { item: Item }) => {
  

  return (
    <Link href={`/products/${item.id}`} prefetch={false}>
      <div className=" rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer
      group bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300 hover-lift">
        
         <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.images?.[0]?.url || ""}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                    />
                    <img
                      src={item.images?.[1]?.url || item.images?.[0]?.url || ""}
                      loading="lazy"
                      alt={item.title}
                      className="w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                    />
                  </div>
        <div className="p-3 text-center">
          <h3 className="text-sm  text-white truncate">{item.title}</h3>
            <span className="text-green-400 ">₹{item.price}</span>
           
         
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

const FilteredProducts = ({
  filterType,
  searchQuery = "",
  categoryName = "",
}: FilteredProductsProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Item[]>([]);
  const [floatSiderbar, setFloatSiderbar] = useState(false);
  const [filter, setFilter] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  const [min, setMin] = useState(100);
  const [max, setMax] = useState(1000);
  const [mount, setMount] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  const [filterSize, setFilterSize] = useState("all");

  const currentQuery = searchParams.get("orderby") || "default";

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      const data = await getData();
      if (!isMounted) return;

      const productsList = data || [];
      setProducts(productsList);
      dispatch(setItemsData(productsList));
      dispatch(setProductsData(productsList));
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const processedData = useMemo(() => {
    const sizeIndexMap: Record<string, number> = {
      small: 0,
      medium: 1,
      large: 2,
      xl: 3,
      xxl: 4,
    };

    const filtered = products.filter((item) => {
      if (filterType === "search" && searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(query);
        const categoryMatch = item.collection.toLowerCase().includes(query);
        if (!titleMatch && !categoryMatch) return false;
      }

      if (filterType === "category" && categoryName) {
        if (!item.collection.toLowerCase().includes(categoryName.toLowerCase())) {
          return false;
        }
      }

      if (filterRating > 0 && item.review < filterRating) {
        return false;
      }

      if (item.price < min || item.price > max) {
        return false;
      }

      if (filterSize !== "all") {
        const sizeIdx = sizeIndexMap[filterSize];
        if (sizeIdx === undefined || item.quantity[sizeIdx] <= 0) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...filtered];
    switch (filter as "default" | "rating" | "low" | "high") {
      case "rating":
        sorted.sort((a, b) => b.review - a.review);
        break;
      case "low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return sorted;
  }, [products, filterType, searchQuery, categoryName, min, max, filterRating, filterSize, filter]);

  // Update routing on filter change
  useEffect(() => {
    setMount(true);
    setCurrentPage(1);

    // Update query parameters
    if (currentQuery !== filter) {
      let route = "";
      if (filterType === "search") {
        route = `/search/${searchQuery}`;
      } else if (filterType === "category") {
        route = `/shop/${categoryName}`;
      } else {
        route = "/products";
      }

      const query = filter !== "default" ? `?orderby=${filter}` : "";
      router.push(`${route}${query}`);
    }
  }, [filter, currentQuery, filterType, searchQuery, categoryName, router]);

  const totalPages = useMemo(
    () => Math.ceil(processedData.length / itemsPerPage),
    [processedData.length, itemsPerPage]
  );

  const currentItems = useMemo(() => {
    if (processedData.length === 0) return [];
    const startIdx = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIdx, startIdx + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const ratingFilter = useCallback((rating: number) => {
    setFilterRating(rating);
  }, []);

  const sizeFilter = useCallback((size: string) => {
    setFilterSize(size);
  }, []);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <main className="flex w-full bg-black min-h-screen">
      {/* Sidebar */}
      {floatSiderbar && (
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setFloatSiderbar(false)}
          className="fixed inset-0 z-20 bg-black/70 md:hidden"
        />
      )}

      <aside
        className={`${
          floatSiderbar
            ? "fixed left-0 top-0 z-30 h-screen w-[85%] max-w-xs overflow-y-auto bg-black/95"
            : "hidden md:sticky md:top-0 md:block md:h-fit md:w-1/5 md:overflow-y-visible lg:w-1/5 xl:w-1/5"
        } border-r border-gray-600 bg-black md:w-1/5 lg:w-1/5 xl:w-1/5 md:h-fit lg:h-fit xl:h-fit`}
      >
        <div className="p-4 md:p-6 lg:p-8 xl:p-8">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <h3 className="text-xl font-bold text-white">Filters</h3>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setFloatSiderbar(false)}
              className="text-xl text-gray-300"
            >
              ✕
            </button>
          </div>

          <h3 className="mb-6 text-xl font-bold text-white hidden md:block">Filters</h3>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-white">Price Range</h4>
            <RangeSlider min={min} setMin={setMin} max={max} setMax={setMax} onChange={({ min: newMin, max: newMax }) => {
              setMin(newMin);
              setMax(newMax);
            }} />
            <p className="text-sm mt-2 text-gray-300">
              ₹{min} - ₹{max}
            </p>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-white">Rating</h4>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((rating) => (
                <button
                  key={rating}
                  onClick={() => ratingFilter(rating)}
                  className={`block text-left text-sm py-1 ${
                    filterRating === rating ? "text-green-400 font-bold" : "text-gray-300"
                  } hover:text-green-400 transition-colors`}
                >
                  {rating === 0 ? "All" : `${rating} ⭐ & above`}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-white">Size</h4>
            <div className="space-y-2">
              {["all", "small", "medium", "large", "xl", "xxl"].map((size) => (
                <button
                  key={size}
                  onClick={() => sizeFilter(size)}
                  className={`block text-left text-sm py-1 capitalize ${
                    filterSize === size ? "text-green-400 font-bold" : "text-gray-300"
                  } hover:text-green-400 transition-colors`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

         
        </div>
      </aside>

       

      {/* Main Content */}
      <section className="w-full bg-black md:w-4/5 lg:w-4/5 xl:w-4/5">
        {/* Header */}
        <div className="p-4 md:p-6 lg:p-8 xl:p-8 border-b border-gray-700 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFloatSiderbar((prev) => !prev)}
              className="md:hidden lg:hidden xl:hidden text-2xl text-white"
              aria-label="Open filters"
            >
              <CiFilter />
            </button>
            <span className="text-gray-300">
              Showing {currentItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length}
            </span>
          </div>

          {/* Sort Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
          >
            <option value="default">Default</option>
            <option value="rating">By Rating</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="p-4 md:p-6 lg:p-8 xl:p-8">
          {mount && currentItems.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {currentItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-3 py-2 rounded ${
                        currentPage === page
                          ? "bg-green-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default FilteredProducts;
