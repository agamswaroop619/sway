"use client";

import Image from 'next/image';

import React, { useState } from 'react';

const ProductDetails = () => {
  const [num, setNum] = useState(1);
  const [info, setInfo] = useState(0);

  const incHandler = () => {
    setNum(num + 1);
  };

  const decHandler = () => {
    setNum(num - 1);
  };

  const clickHandler = () => {
    setInfo((1 + num) % 3);
  };

  return (
    <div>
      <div className="flex">
        <div>
          <Image
            className="h-[30vw]"
            src="https://sway.club/wp-content/uploads/2024/04/7-scaled.jpg"
            alt="product"
          />
        </div>

        {/* info */}
        <div>
          <h3>Brainfood | Oversized-T-shirt | Sway Clothing</h3>
          <h3>₹699.00</h3>

          <div>
            <div>
              <button onClick={decHandler}> - </button>
              {num}
              <button onClick={incHandler}> + </button>
            </div>

            <button className="p-2 border rounded-lg"> Add to cart </button>
          </div>

          <p>Category: Streetwear</p>
        </div>
      </div>

      <div className="m-10 p-10">
        <div className="flex justify-around p-8">
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler()}
          >
            Description
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler()}
          >
            Additional information
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler()}
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
