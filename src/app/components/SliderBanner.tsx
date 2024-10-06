'use client'
import React from "react";
import { Carousel } from "react-responsive-carousel";

import "react-responsive-carousel/lib/styles/carousel.min.css";


const sliderBannerData = [
   {
    id: 1,
    path: "",
    title: "Title 1",
    image: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997652/Home/Slide_8_e9i9wz.jpg"
   },
   {
    id: 2,
    path: "",
    title: "Title 2",
    image: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997649/Home/Slide_6_bxy5gu.jpg"
   },
   {
    id: 3,
    path: "",
    title: "Title 3",
    image: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997641/Home/Slide_2_-_Copy_su5ts0.jpg"
   },
   {
    id: 4,
    path: "",
    title: "Title 4",
    image: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997651/Home/Slide_7_ao5mpv.jpg"
   },
   {
    id: 5,
    path: "",
    title: "Title 5",
    image: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997648/Home/Slide_5_wdisrl.jpg"
   }
  ]


function SliderBanner() {
 
  return (
   <div>
    <Carousel
            showArrows={true}
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            
          >
            {
              sliderBannerData.map((item) => {
                return (
                  <div key={item.id}>
                    <img src={item.image} alt={item.title} className="lg:h-[62vh] md:w-[45vh] sm:w-[35vh] xs:h-[33vh]"/>
                  </div>
                )})
            }
          </Carousel>
   </div>
  );
}

export default SliderBanner;