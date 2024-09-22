"use client";



import React, { useState } from 'react';
import Image from 'next/image';

const ProductDetails = () => {
  const [num, setNum] = useState(1);
  const [info, setInfo] = useState(0);

  const incHandler = () => {
    setNum(num + 1);
  };

  const decHandler = () => {
    setNum(num - 1);
  };

  const clickHandler = (value: number) => {
    setInfo(value);
  };

  return (
    <div className='my=8 p-8'>
      <div className="flex justify-between">
        <div className='w-[50%] p-4'>
          <Image
            className=""
            width={250} height={300}
            src="https://sway.club/wp-content/uploads/2024/04/7-scaled.jpg"
            alt="product"
          />
        </div>

        {/* info */}
        <div className='w-[50%] p-4 pr-8 tracking-wider'>
          <h3 className='text-2xl my-4'>Brainfood | Oversized-T-shirt | Sway Clothing</h3>
          <h3 className='text-2xl text-gray-500 my-4'>₹699.00</h3>

          <div className='flex w-full gap-10'>
            <div className='bg-gray-600 rounded-l-full rounded-r-full py-2 my-3'>
              <button className=' px-4 text-xl border-r-2'  onClick={decHandler}> - </button>
              <span className=' px-4 text-lg  '>{num}</span>
              <button className='border-l-2 px-4 text-xl ' onClick={incHandler}> + </button>
            </div>

            <button className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-[#fff]"> Add to cart </button>
          </div>

          <p>Category: Streetwear</p>
        </div>
      </div>

      <div className="m-10 p-10">
        <div className="flex justify-around p-8">
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler(0)}
          >
            Description
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler(1)}
          >
            Additional information
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler(2)}
          >
            Reviews
          </span>
        </div>

        <div className="p-14 w-full ">
          {info === 0 && (
            <div className="flex flex-col">
              <div className="flex w-full gap-14 justify-between">
                <Image
                loading='lazy'
                width={300} height={200}
                  src="https://sway.club/wp-content/uploads/2024/04/Peace-Back-1-600x600.jpeg"
                  className="w-[25vw]"
                  alt="image"
                />

                <p>
                  Unlock your full potential and unleash greatness with our
                  Unleash Greatness Tee from Sway Clothing. This tee inspires
                  confidence and ambition with its bold design and motivational
                  message. Made with 100% cotton and crafted with care, this
                  mid-weight tee is a reminder that greatness lies within reach.
                  Its oversized silhouette provides a comfortable fit,
                  empowering you to conquer any challenge with ease.
                </p>
              </div>

              <div>
                Description:
                <br />1.) Weight: 200 GSM
                <br />2.) Composition: Mid-Weight Cotton
                <br />
                MADE IN INDIA
              </div>
            </div>
          )}

          {info === 1 && <div>Additional information content</div>}

          {info === 2 && <div>Reviews content</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
