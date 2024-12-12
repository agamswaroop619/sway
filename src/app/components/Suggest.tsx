'use client'
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Item } from "@/lib/features/items/items";
import { useRouter } from "next/navigation";

const itemData = (state: RootState) => state.items.itemsData;

interface SuggestPageProps {
  collection: string;
}

const SuggestPage = ({ collection }: SuggestPageProps) => {

    const data = useAppSelector(itemData);
    const router = useRouter();

    const clickHandler = ( id: string) => {
        router.push(`/products/${id}`)
    }

  const [shopData, setShopData] = useState<Item[]>([]);

  // Filter data based on collection
  const filteredData = useMemo(() => {
    return data ? data.filter((item) => item.collection === collection) : [];
  }, [data, collection]);

  // Apply filters and sorting
  const applyFiltersAndSorting = useCallback(() => {
    setShopData(filteredData.slice(0,4)); // Use filteredData directly since it’s already filtered
  }, [filteredData]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [applyFiltersAndSorting]);

  return (
   <div className="border-t">

    <p className="w-full text-center my-8">Related products</p>


     <div className="flex sm:flex-wrap xs:flex-wrap items-center  w-full justify-between">
      {shopData.length > 0 && (
        shopData.map((item) => (
          <div key={item.id} onClick={ () => clickHandler(item.id)} className="flex cursor-pointer mb-[10%] sm:w-[46%] xs:mx-[10%] sm:mx-0 xs:w-[80%] md:w-[23%] flex-col ">
            <img src={item.images[0].url} alt="" className="w-full" />
           <div className="text-center p-4 h-28">
          <p className="mb-2">{item.title} </p>
                 <p className='text-gray-400'> <span className='line-through mr-2'>₹{Math.ceil(item.price+300)}</span> <span>₹{Math.ceil(item.price)}</span> </p>
                
           </div>
          </div>
        ))
      ) }
    </div>
   </div>
  );
};

export default SuggestPage;
