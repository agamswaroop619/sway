"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";

import { data } from "../data";

function CardSlider() {
  const settings = {
    dots: true, // Shows dots for navigation
    infinite: true, // Enables infinite looping of slides
    speed: 500, // Speed of the swipe animation
    slidesToShow: 4, // Number of slides visible at once
    slidesToScroll: 2, // Number of slides to scroll at a time
    initialSlide: 0,
    // Hides navigation arrows
    swipe: true, // Enables swipe functionality
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          initialSlide: 0,
          arrows: false,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          initialSlide: 0,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="w-[100vw] px-10  bg-gradient-to-b from-green-950 to-black">
      <Slider {...settings}>
        {data.map((item) => {
          return (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="w-[22%] flex flex-col items-center border-b my-2 p-2"
            >
              <div className="relative group">
                <img
                  src={item.images[0].url}
                  loading="lazy"
                  alt="image1"
                  className="w-[100%] h-[100%] object-cover rounded-lg transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
                />
                <img
                  src={item.images[1].url}
                  loading="lazy"
                  alt="image2"
                  className="w-full h-full object-cover rounded-lg transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                />
              </div>
              <div className="w-full h-28 p-4 text-center">
                <h3 className="mb-2">{item.title}</h3>
                <p>₹{item.price}</p>
              </div>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
}

export default CardSlider;
