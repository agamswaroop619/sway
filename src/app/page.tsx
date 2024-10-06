import React from "react";
import SliderBanner from "./components/SliderBanner";
import CardSlider from "./components/CardSlider";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <div className="mx-10 my-4">
        <h2 className="lg:text-7xl xl:text-7xl md:text-5xl sm:text-3xl text-3xl text-green-600">
          SLAY
        </h2>
        <div className="flex gap-[3%] lg:text-7xl xl:text-7xl md:text-5xl sm:text-3xl text-3xl">
          <h2 className=" text-white">WITH</h2>
          <h2 className=" text-white">SWAY</h2>
        </div>

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
      </div>

      <SliderBanner />

      <CardSlider />

      {/* Zig-Zag Grid Section */}
      <section>
        <h3 className="pl-6 text-3xl font-bold">Art Gallery</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-24 mt-0">
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
        </div>
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
