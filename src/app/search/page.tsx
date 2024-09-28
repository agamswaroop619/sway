'use client'
// import Link from 'next/link';
// import {data} from "../data"

const SearchPage = () => {


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
    
          {/* Results */}
         <div>
         <h1>Search Results</h1>
         <p>Showing results for: </p>
         </div>
        
        </div>
      );
}

export default SearchPage
