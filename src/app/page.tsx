"use client";
import React, { useState, useEffect } from "react";
import CardSlider from "./components/CardSlider";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";

export default function Home(): JSX.Element {
  const gifUrls: string[] = [
    "https://res.cloudinary.com/dfyfsmu84/image/upload/v1739832831/hf4dv0ofuzd5lxy7q52w.gif",
    "https://res.cloudinary.com/dfyfsmu84/image/upload/v1742472218/kxcohqxaantib4olg9rx.gif",
    "https://res.cloudinary.com/dfyfsmu84/image/upload/v1742472223/gyvuwe4tb7t50trzurot.gif",
    "https://res.cloudinary.com/dfyfsmu84/image/upload/v1742472223/xbuv32uuaraskc86lmkj.gif",
    "https://res.cloudinary.com/dfyfsmu84/image/upload/v1742472224/oifeojhddpo9xqtlh33f.gif",
  ];
  const [selectedGifs, setSelectedGifs] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle the array and pick the first 4 GIFs
    const shuffled = [...gifUrls].sort(() => 0.5 - Math.random());
    setSelectedGifs(shuffled.slice(0, 4));
  }, []);

  return (
    <>
      <div className="flex sm:flex-col xs:flex-col lg:flow-row md:flex-row xl:flex-row w-[100vw] px-10 justify-between bg-gradient-to-b from-black to-green-950">
        <section className="w-[35vw] xs:mb-4 sm:mb-6 sm:w-full xs:w-full md:w-[35vw] lg:w-[35vw] xl:w-[35vw] flex flex-col justify-center">
          <h3 className="text-7xl font-bold">SLAY WITH</h3>
          <h3 className="text-[#3fe607] text-7xl font-bold">SWAY</h3>
          <p>
            Sway is a cool and comfy clothing brand. Our styles mix modern
            trends with classic vibes for a vintage yet stylish look. We ensure
            the quality and comfortability of the fabric and product.
          </p>
          <Link href="/products">
            <button className="p-2 rounded-md bg-[#3fe607] mt-2 w-[130px] flex gap-2 items-center">
              Get started <FaArrowRightLong />
            </button>
          </Link>
        </section>
        <section>
          <div className="flex flex-col w-[50vw] sm:w-[100vw] xs:w-[100vw] md:w-[50vw] lg:w-[50vw] xl:w-[50vw]">
            <div className="flex gap-5 mb-3">
              {selectedGifs.slice(0, 2).map((gifUrl, index) => (
                <img
                  key={index}
                  className="h-[40vh] rounded-xl"
                  src={gifUrl}
                  alt={`Sway GIF ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-5 lg:ml-9 md:ml-9 xl:md-11">
              {selectedGifs.slice(2, 4).map((gifUrl, index) => (
                <img
                  key={index}
                  className="h-[40vh] rounded-xl"
                  src={gifUrl}
                  alt={`Sway GIF ${index + 3}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <h2>Swipe for Top Picks in our Collection!</h2>
      <CardSlider />
      <section className=" bg-gradient-to-b from-black to-green-950">
        <div className="my-20 w-full flex flex-col">
          <h2 className="text-3xl font-semibold m-3">
            Follow Us On{" "}
            <a
              href="https://www.instagram.com/sway.society/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-green-600">@Sway.society</span>
            </a>
          </h2>
          <img
            className="w-full max-w-4xl mx-auto"
            src="https://res.cloudinary.com/dfyfsmu84/image/upload/v1738652759/zaxxajsx7tuvzciaxjuw.jpg"
            alt="Sway Society"
          />
        </div>
      </section>
    </>
  );
}
