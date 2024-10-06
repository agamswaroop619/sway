import React from "react";

export default function About() {
  return (
    <>
      <div className="bg-black text-white px-6 mx-12 py-12">
        <section className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <img
            src="https://sway.club/wp-content/uploads/2024/04/big-pic-sustainability-2.png"
            alt="Sway Clothing"
            className="w-full max-w-2xl mx-auto mb-12"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Sustainability At Sway
          </h2>
          <p className="text-lg">
            At Sway, sustainability is at the heart of everything we do. Our
            brand identity, characterized by its simplicity and elegance, is a
            reflection of our commitment to a more sustainable future.
          </p>
        </section>
        <img
          src="https://sway.club/wp-content/uploads/2024/04/Frame-427319594.png"
          alt="People around Us"
          className="w-full max-w-2xl mx-auto mb-12"
        />
        {/* Mission Section with Grid Layout */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Our Mission, The Sway Six:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Minimalism */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Minimalism</h3>
              <p className="text-lg">
                We believe less is more. Our thoughtfully designed pieces
                embrace minimalism, ensuring that each garment becomes a
                versatile and timeless addition to your wardrobe. By choosing
                quality over quantity, we encourage conscious consumption.
              </p>
            </div>

            {/* Circular */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Circular</h3>
              <p className="text-lg">
                Embracing the circular economy, we design with longevity in
                mind. Our pieces are intended to be treasured for years,
                encouraging a shift away from disposable fashion. When you
                invest in our clothing, you're investing in a more sustainable
                future.
              </p>
            </div>

            {/* Ethical */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Ethical</h3>
              <p className="text-lg">
                Every stitch tells a story. Our garments are meticulously
                crafted by skilled artisans who share our values of ethical and
                fair labor practices. This dedication to craftsmanship ensures
                exceptional quality and supports a network of talented
                individuals.
              </p>
            </div>

            {/* Transparency */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-lg">
                We value openness and transparency. We're on a journey to
                continuously improve our practices, and we're committed to
                sharing our progress with you. From sourcing to production, we
                want you to know the story behind each piece you wear. We update
                all information every six months.
              </p>
            </div>

            {/* Eco-Friendly Materials */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Eco-Friendly Materials
              </h3>
              <p className="text-lg">
                We are dedicated to reducing our environmental impact. Our
                clothing is made using sustainable materials, carefully sourced
                to minimize harm to the planet. From organic fabrics to
                innovative recycled materials, we aim to leave a lighter
                footprint.
              </p>
            </div>

            {/* Community and Empowerment */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Community And Empowerment
              </h3>
              <p className="text-lg">
                Our brand is part of a community that shares a vision for a
                better world. Through collaborations and initiatives, we aim to
                inspire and empower individuals to make conscious choices and
                contribute to positive change.
              </p>
            </div>
          </div>

          <p className="text-lg font-semibold mt-8">
            Guided by our core missions, we intertwine sustainability into every
            thread of our brand, from thoughtfully sourced materials and
            innovative manufacturing processes to nurturing product longevity
            and embracing eco-friendly packaging. All of this harmonizes to
            create a more meaningful and responsible approach to fashion.
          </p>
        </section>
      </div>
    </>
  );
}
