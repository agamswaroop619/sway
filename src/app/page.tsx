'use client'
// import Image from 'next/image';
// import Link from "next/link";
import SliderBanner from "./components/SliderBanner";
import CardSlider from "./components/CardSlider";
import Footer from "./components/Footer";


export default function Home() {

  return (
    <>
     
     <SliderBanner />
     <CardSlider />

      <div className="my-20 w-full flex flex-col ">
        <h2 className="text-3xl font-semibold m-3">Follow Us On @Sway.society</h2>
        <img
          className="w-full"
          src="https://sway.club/wp-content/uploads/2024/04/sway-website-post-1536x922.jpg"
        />
      </div>

      <h3 className="pl-6 text-3xl font-bold">Featured Products</h3>
      <div className="flex flex-wrap mb-24 justify-around gap-y-6">
        <img
          className="w-[45%] h-[50%]"
          src="https://media.istockphoto.com/id/618976674/photo/fashion-woman-shopping.jpg?s=1024x1024&w=is&k=20&c=OVwkrGYD2ylReVjw_bs2rBQWt4QnP7cNbffJWoUCWWI="
          alt="images"
        />
        <img
          className="w-[45%] h-[50%]"
          src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <img
          className="w-[45%] h-[50%]"
          src="https://images.pexels.com/photos/1205033/pexels-photo-1205033.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
        <img
          className="w-[45%] h-[50%]"
          src="https://images.pexels.com/photos/1484771/pexels-photo-1484771.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
        />
      </div>

      <Footer />
    </>
  );
}
