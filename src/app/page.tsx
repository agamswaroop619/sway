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
      <div className="responsive-flex-col w-full responsive-padding justify-between bg-gradient-to-b from-black to-green-950 py-10 xs:py-15 sm:py-20 md:py-20 lg:py-20 xl:py-20">
        <section className="responsive-w-full xs:mb-4 sm:mb-6 md:mb-0 flex flex-col justify-center responsive-padding">
          <h3 className="text-responsive-2xl font-bold text-center xs:text-left sm:text-left md:text-left lg:text-left xl:text-left">
            SLAY WITH
          </h3>
          <h3 className="text-[#3fe607] text-responsive-2xl font-bold text-center xs:text-left sm:text-left md:text-left lg:text-left xl:text-left">
            SWAY
          </h3>
          <p className="text-responsive-base text-center xs:text-left sm:text-left md:text-left lg:text-left xl:text-left responsive-margin">
            Sway is a cool and comfy clothing brand. Our styles mix modern
            trends with classic vibes for a vintage yet stylish look. We ensure
            the quality and comfortability of the fabric and product.
          </p>
          <div className="flex justify-center xs:justify-start sm:justify-start md:justify-start lg:justify-start xl:justify-start">
            <Link href="/products">
              <button className="btn-responsive rounded-md bg-[#3fe607] text-black font-semibold flex gap-2 items-center hover-scale transition-all duration-300">
                Get started <FaArrowRightLong />
              </button>
            </Link>
          </div>
        </section>

        <section className="responsive-w-full flex justify-center">
          <div className="responsive-w-full max-w-6xl">
            <div className="responsive-grid-2 gap-3 xs:gap-4 sm:gap-5 md:gap-5 lg:gap-5 xl:gap-5 mb-3">
              {selectedGifs.slice(0, 2).map((gifUrl, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-xl"
                >
                  <img
                    className="responsive-image-square hover-scale transition-all duration-500"
                    src={gifUrl}
                    alt={`Sway GIF ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="responsive-grid-2 gap-3 xs:gap-4 sm:gap-5 md:gap-5 lg:gap-5 xl:gap-5 lg:ml-9 md:ml-9 xl:ml-11">
              {selectedGifs.slice(2, 4).map((gifUrl, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-xl"
                >
                  <img
                    className="responsive-image-square hover-scale transition-all duration-500"
                    src={gifUrl}
                    alt={`Sway GIF ${index + 3}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <CardSlider />

      <section className="bg-gradient-to-b from-black to-green-950">
        <div className="container-responsive py-10 xs:py-15 sm:py-20 md:py-20 lg:py-20 xl:py-20">
          <h2 className="text-responsive-lg font-semibold text-center responsive-margin">
            Follow Us On{" "}
            <a
              href="https://www.instagram.com/sway.society/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-400 transition-colors duration-300"
            >
              <span>@Sway.society</span>
            </a>
          </h2>
          <div className="flex justify-center">
            <img
              className="responsive-image max-w-4xl rounded-lg shadow-2xl"
              src="https://res.cloudinary.com/dfyfsmu84/image/upload/v1738652759/zaxxajsx7tuvzciaxjuw.jpg"
              alt="Sway Society"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
