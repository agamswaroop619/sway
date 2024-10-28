
import React from "react";
// import SliderBanner from "./components/SliderBanner";
import CardSlider from "./components/CardSlider";
import Footer from "./components/Footer";

export default function Home() {


  return (
    <>
      {/* <SliderBanner /> */}
      {/* <div className=" my-4">
        <div className="flex gap-4 justify-center w-[100vw]  lg:text-7xl xl:text-7xl md:text-5xl sm:text-4xl xs:text-4xl text-6xl">
          <h1 className="text-green-600">SLAY</h1>
          <h5 className="text-white">with</h5>
          <h1 className="text-white animate-glitch relative">
            SWAY
            <span
              className="absolute top-0 left-0 w-full h-full text-white opacity-50 animate-glitchShift"
              style={{ clip: "rect(0, 900px, 0, 0)" }}
            >
              SWAY
            </span>
            <span
              className="absolute top-0 left-0 w-full h-full text-green-600 opacity-50 animate-glitchShift"
              style={{ clip: "rect(0, 900px, 0, 0)" }}
            >
              SWAY
            </span>
          </h1>
        </div>
      </div> */}

      <div className="flex mx-10 justify-around items-center">
        <div className="text-7xl">
          <h3>SLAY WITH</h3>
          <h3 className="text-green-700">SWAY</h3>
        </div>

        <img className="h-36" src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1729970708/Untitled_Project_5_d2qnlz.jpg" alt="" />
      </div>

        <div className="flex  mx-10  justify-between">
        <div className="w-[70vw]">

        </div>

          <div className="flex gap-y-4 flex-wrap justify-between">

          <video className="w-[22vw]" autoPlay muted loop preload="metadata">
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727183577/videos/final_journey_reel_xgtyga.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <video
            className="w-[22vw]"
            autoPlay
            muted
            loop
            preload="metadata"
            style={{ cursor: "pointer" }}
          >
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727183521/videos/New_Project_304_Copy_Copy_rguan6.mp4"
              type="video/mp4"
            />
          </video>

          <video className="w-[22vw]" autoPlay muted loop preload="metadata">
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727364143/collection1/IMG_6991_dfktby.mov"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <video className="w-[22vw]" autoPlay muted loop preload="metadata">
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727364148/collection1/IMG_7011_m5gk4i.mov"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          

          </div>
        </div>

      <CardSlider />

      {/* Zig-Zag Grid Section */}
      <section>
        <h3 className="pl-6 text-3xl font-bold">Art Gallery</h3>
        <div className="w-full py-4 flex justify-between">
          <img
            className="w-[22vw]"
            srcSet="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727176166/collection1/1717926580324_mkdrqb.jpg"
            alt="t-shirts"
          />
          <img
            className="w-[22vw]"
            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727363469/collection1/thumb_final-min_hcr8wd.jpg"
            alt="images"
          />
          <video className="w-[22vw]" autoPlay muted loop preload="metadata">
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727183577/videos/final_journey_reel_xgtyga.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <video
            className="w-[22vw]"
            autoPlay
            muted
            loop
            preload="metadata"
            style={{ cursor: "pointer" }}
          >
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727183521/videos/New_Project_304_Copy_Copy_rguan6.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="flex justify-between">
          <img
            alt="images"
            className="w-[22vw]"
            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727176139/collection1/IMG_6329_p5whyn.jpg"
          />
          <img
            alt="images"
            className="w-[22vw]"
            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727176104/collection1/IMG_6306_cz603e.jpg"
          />
          <video className="w-[22vw]" autoPlay muted loop preload="metadata">
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727364143/collection1/IMG_6991_dfktby.mov"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <video className="w-[22vw]" autoPlay muted loop preload="metadata">
            <source
              src="https://res.cloudinary.com/dbkiysdeh/video/upload/v1727364148/collection1/IMG_7011_m5gk4i.mov"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-24 mt-0">
          <img
            className="w-full h-auto md:order-1"
            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727176090/collection1/IMG_6295_z8jev4.jpg"
            alt="product 1"
          />
          <img
            className="w-full h-auto md:order-3"
            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727176197/collection1/DJI_20240604_163515_962_mziwj7.jpg"
            alt="product 2"
          />
          <img
            className="w-full h-auto md:order-4"
            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727176104/collection1/IMG_6306_cz603e.jpg"
            alt="product 3"
          />
          <img
            className="w-full h-auto md:order-2"
            src="https://res.cloudinary.com/dbkiysdeh/image/upload/v1727074378/rock/16_gsydvo.jpg"
            alt="product 4"
          />
        </div> */}
      </section>

      <div className="my-20 w-full flex flex-col ">
        <h2 className="text-3xl font-semibold m-3">
          Follow Us On <span className="text-green-600">@Sway.society</span>
        </h2>
        <img
          className="w-full max-w-4xl mx-auto"
          src="https://sway.club/wp-content/uploads/2024/04/sway-website-post-1536x922.jpg"
        />
      </div>

      <Footer />
    </>
  );
}
