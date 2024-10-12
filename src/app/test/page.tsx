'use client'
import { useAppSelector } from "@/lib/hooks";
import { itemsDataInCart } from "@/lib/features/items/items";
import { useEffect } from "react";

const TestPage = () => {
  
  const data= useAppSelector(itemsDataInCart);

  // Log data when it changes
  useEffect(() => {
    if (data) {
      console.log("Updated data: ", data);
    }
  }, [data]);

  return (
    <div>
      Results
      {data &&
        data.map((item) => {
          return (
            <div key={item.id} className="text-xl m-4 flex">
              {item.title} <img src={item.images[0].url} className="w-20" />
            </div>
          );
        })}
    </div>
  );
};

export default TestPage;
