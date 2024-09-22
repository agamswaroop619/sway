import React from 'react';
import Link from 'next/link';

const productsPage = () => {

  const data=[
    {
        id: 1,
       
        title: "Brainfood | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 2,
        title: "Break Rules | Oversized-T-shirt | Sway Clothing",
       
    },
    {
        id: 3,
        title: "Come & Go | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 4,
        title: "Cupid | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 5,
        title: "Endure | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 6,
        title: "Humanity | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 7,
        title: "It's Hard to be Simple | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 8,
        title: "Make Your Move | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 9,
        title: "Mentality | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 10,
        title: "Rock | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 11,
        title: "Songs | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 12,
        title: "Take The Road High | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 13,
        title: "Unleash Greatness | Oversized-T-shirt | Sway Clothing"
    },
    {
        id: 14,
        title: "Watching | Oversized-T-shirt | Sway Clothing"
    }
]

    return (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 p-4">
            <input type="text" placeholder="Search products" className="p-2 rounded-full w-full mb-4" />
    
            <div className="mb-4">
              <h3 className="font-bold mb-2">Filter by price</h3>
              <button className="bg-green-700 p-2 rounded-full mb-2">Filter</button>
              <p>Price: ₹690 — ₹700</p>
            </div>
    
            <div className="mb-4">
              <h3 className="font-bold mb-2">Filter by rating</h3>
              <p>⭐⭐⭐⭐⭐ (1)</p>
            </div>
    
            <div>
              <h3 className="font-bold mb-2">Filter by brand</h3>
              <ul>
                <li><button className="p-2">Small</button></li>
                <li><button className="p-2">Medium</button></li>
                <li><button className="p-2">Large</button></li>
                <li><button className="p-2">XL</button></li>
                <li><button className="p-2">XXL</button></li>
              </ul>
            </div>
          </div>
    
          {/* Products */}
          <div className='flex flex-wrap justify-between w-[75vw]'>
          {
            data.map( (item) => {
              return (
                <Link key={item.id} href="/products/1" className='w-[30%]  flex flex-col items-center border-b my-2 p-2'>
                <div className="relative group">
              <img
                src="https://sway.club/wp-content/uploads/2024/04/29-scaled-300x400.jpg"
                alt="image1"
                className="w-[100%] h-[100%] object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
              />
              <img
                src="https://sway.club/wp-content/uploads/2024/04/18-scaled-300x400.jpg"
                alt="image2"
                className="w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
              />
            </div>
                 <div className='w-full p-4 text-center'>
                 <h3 className=" mb-2 ">{item.title}</h3>
                 <p>₹499</p>
                 </div>

                  </Link>
              )
            })
          }
        </div>
        </div>
      );
}

export default productsPage
