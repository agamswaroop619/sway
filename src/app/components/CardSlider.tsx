"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";

import { data } from "../data";

function CardSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          initialSlide: 0,
        },
      },
    ],
  };

  return (
    <div className="w-[100vw] px-10">
      <Slider {...settings}>
        {data.map((item) => {
          return (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="w-[22%]  flex flex-col items-center border-b my-2 p-2"
            >
              <div className="relative group">
                <img
                  src={item.images[0].url}
                  alt="image1"
                  className="w-[100%] h-[100%] object-cover rounded-lg transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0"
                />
                <img
                  src={item.images[1].url}
                  alt="image2"
                  className="w-full h-full object-cover rounded-lg transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                />
              </div>
              <div className="w-full p-4 text-center">
                <h3 className=" mb-2 ">{item.title.length }</h3>
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
