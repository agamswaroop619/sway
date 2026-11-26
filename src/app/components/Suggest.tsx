'use client'
import Image from "next/image";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";
import { useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";

const itemData = (state: RootState) => state.items.itemsData;

interface SuggestPageProps {
  collection: string;
}

const SuggestPage = ({ collection }: SuggestPageProps) => {

    const data = useAppSelector(itemData);
    const router = useRouter();

    const clickHandler = useCallback(
      (id: string) => {
        router.push(`/products/${id}`);
      },
      [router]
    );

    const shopData = useMemo(() => {
      if (!data) return [];
      return data.filter((item) => item.collection === collection).slice(0, 4);
    }, [data, collection]);

    return (
   <div className="border-t">

    <p className="w-full text-center my-8">Related products</p>


     <div className="flex sm:flex-wrap xs:flex-wrap items-center w-full justify-between">
      {shopData.length > 0 && (
        shopData.map((item) => (
          <div
            key={item.id}
            onClick={() => clickHandler(item.id)}
            className="flex cursor-pointer mb-[10%] sm:w-[46%] xs:mx-[10%] sm:mx-0 xs:w-[80%] md:w-[23%] flex-col"
          >
            <div className="relative w-full h-48">
              <Image
                src={item.images[0]?.url || "/placeholder.jpg"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 25vw"
                priority={false}
              />
            </div>
            <div className="text-center p-4 h-28">
              <p className="mb-2">{item.title}</p>
              <p className="text-gray-400">
                <span className="line-through mr-2">₹{Math.ceil(item.price + 300)}</span>
                <span>₹{Math.ceil(item.price)}</span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
   </div>
  );
};

export default memo(SuggestPage);
