'use client'
 
import { useParams } from 'next/navigation'
import React, { useState } from 'react';
import { data } from '@/app/data';

const ProductDetails = () => {
  const [num, setNum] = useState(1);
  const [info, setInfo] = useState(0);

  const params= useParams();
  
  
  const id = params.productId;
  const numberId = Number(id);
   const itemdata= data.filter( (item) => item.id === numberId )



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
    <div className='my-2 lg:p-8 md:p-4 xl:p-8 2xl:p-8'>

      <div className="flex sm:flex-col xs:flex-col md:flex-row xl:flex-row lg:flex-row 2xl:flex-row justify-between">

        <div className='md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 '>
          <img
            className="w-[60%] sm:w-[100%] xs:w-[100%]"
            src={itemdata[0].images[0].url}
            alt="product"
          />
        </div>

        {/* info */}

        <div className='md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 pr-8 tracking-wider'>
          <h3 className='text-2xl my-4'>{itemdata[0].title} | Oversized-T-shirt | Sway Clothing</h3>
          <h3 className='text-2xl text-gray-500 my-4'>₹{itemdata[0].price}.00</h3>

          <h3>Size</h3>
          <div className='flex w-full justify-between my-2'>
            <button className='border py-1 px-2 rounded-md'>Small</button>
            <button className='border py-1 px-2 rounded-md'>Medium</button>
            <button className='border py-1 px-2 rounded-md'>Large</button>
            <button className='border py-1 px-2 rounded-md'>XL</button>
            <button className='border py-1 px-2 rounded-md'>XXL</button>
          </div>

          <div className='flex w-full gap-10 '>

            <div className='bg-gray-600 rounded-l-full rounded-r-full py-2 my-3'>
              <button 
              className=' px-4 text-xl  md:px-6 lg:px-7 xl:px-8  border-r-2 disabled:opacity-55'  
              disabled= { num < 2}
              onClick={decHandler}> - </button>
              <span className=' px-4 text-lg  md:px-6 lg:px-7 xl:px-8  '>{num}</span>
              <button 
              className='border-l-2 px-4 text-xl md:px-6 lg:px-7 xl:px-8  disabled:opacity-55 '
              disabled= { num > 4} 
              onClick={incHandler}> + </button>
            </div>

            <button className="px-2 border-white md:px-6 lg:px-7 xl:px-8 border bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-[#fff]"> Add to cart </button>
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
                <img
                loading='lazy'
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
