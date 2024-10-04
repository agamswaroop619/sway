'use client'
import { MdOutlineClear } from "react-icons/md";

// types.ts
 interface FloatingSidebarProps {
    floatSiderbar: boolean;
    setFloatSiderbar: React.Dispatch<React.SetStateAction<boolean>>;
  }
  

const FloatingSidebar: React.FC<FloatingSidebarProps> = ({ floatSiderbar, setFloatSiderbar }) => {
  return (
    <div className="z-10 w-[80vw] h-screen max-w-[500px] bg-black text-white">
            <div className="flex  px-5 items-center">
            <input type="text" placeholder="Search products" className="p-2 rounded-full w-full mb-4" />
            <MdOutlineClear className="text-3xl" onClick={() => setFloatSiderbar(!floatSiderbar)} />
            </div>
    
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


  )
}

export default FloatingSidebar
