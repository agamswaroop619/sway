'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { data } from '@/app/data';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';  // Import the RootState type
import { addToCart } from '@/lib/features/carts/cartSlice';
import { useRouter } from 'next/navigation';
import { addToCartWishlist } from '@/lib/features/wishlist/wishlist';
import toast from 'react-hot-toast';

const selectCartItems = (state: RootState) => state.cart.items;

interface Image {
  url: string;
  imgId: number;
}

export interface Item {
  id: number;
  title: string;
  images: Image[];
  price: number;
  description: string;
  category: string;
  quantity: number;
  descImg: string;
  color: string;
  review: number;
}

const ProductDetails = () => {

  const [num, setNum] = useState(1);
  const [info, setInfo] = useState(0);
  const [itemdata, setItemdata] = useState<Item | null>(null);  // Start as null
  const [itemInCart, setItemInCart] = useState(false);
  const [itemInWishlist, setItemInWishlist]= useState(false);
  const [imgSrc, setImgSrc ] = useState<string | undefined>("");
  const [ itemSize , setItemSize ] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Fetch cart items from Redux store
  const itemsFromStore = useAppSelector(selectCartItems);
  const cartItems = itemsFromStore;


  const addHandler = (product: Item) => {

    if( itemSize === "" ) {
        toast.error("Plz select a size");
        return;
    }

   const itemId= product.id;
   const qnt= num;
   const price= product.price;
   const title= product.title;
   const image= product.images[0].url;
   const size= itemSize;

   const cartItem= { itemId, qnt, price, title, image, size }

   dispatch(addToCart( cartItem))
   setItemInCart(true)
  };

  const cartItemHandler = () => {
    router.push('/cart');
  };

  const params = useParams();
  const id = params.productId;
  const numberId = Number(id);

  const incHandler = () => {
    setNum(num + 1);
  };

  const decHandler = () => {
    setNum(num - 1);
  };

  const clickHandler = (value: number) => {
    setInfo(value);
  };

  const addToWishlistHandler = ( product:Item ) => {

    if( itemSize === "" ) {
      toast.error("Plz select a size");
      return;
  }

    const itemId= product.id;
   const qnt= num;
   const price= product.price;
   const title= product.title;
   const image= product.images[0].url;
   const size= itemSize;

   const cartItem= { itemId, qnt, price, title, image, size }

   dispatch(addToCartWishlist( cartItem))
   setItemInWishlist(true)
  }

  const itemExists = (id: number) => {
    console.log("cart items:", cartItems);
    const res = cartItems.find((item) => item.itemId === id); // Ensure you're checking the correct 'id'
  
    console.log("res:", res);
    
    return res ? { exists: true, quantity: res.qnt } : { exists: false, quantity: 1 }; // Return quantity or default to 1
  };
  
  // Ensure scrolling starts at the top of the page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }

    // Find the product data by ID and ensure it's of the correct type
    const productData = data.find((item): item is Item => item.id === numberId) || null;

    // Set the state only if the productData is of the correct type
    setItemdata(productData);

    // Call itemExists and update the state based on its result
  const { exists, quantity } = itemExists(numberId);
  setItemInCart(exists);
  setNum(quantity); // Update quantity based on result 

  }, [numberId]);

  useEffect( () => {

    setImgSrc( itemdata?.images[0].url)

  }, [itemdata])

  // Ensure `itemdata` exists before rendering
  if (!itemdata) return <div>Loading...</div>;

  return (
    <div className='my-2 lg:p-8 md:p-4 xl:p-8 2xl:p-8'>
      <div className="flex sm:flex-col xs:flex-col md:flex-row xl:flex-row lg:flex-row 2xl:flex-row justify-between">

      <div className='flex sm:w-[100vw] xs:w-[100vw] sm:px-4 xs:px-4 md:flex-row lg:flex-row xl:flex-row sm:justify-center xs:justify-center w-[45vw] sm:flex-col-reverse xs:flex-col-reverse'>
        <div className='flex lg:flex-col gap-4 overflo'>
          {
            itemdata.images.map( card => {
              return (
                <div key={card.imgId} className=" w-20 mt-4 ">
                  <img src={card.url} alt="product image" className="xs:w-20 sm:w-20" onClick={() => setImgSrc(card.url)}/>
                   </div>
              )
            })
          }
        </div>

        <div className='md:w-[95%] overflow-hidden lg:w-[95%] xl:w-[95%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 '>
          <img
            className="w-[100%] "
            src={imgSrc}
            alt="product"
            
          />
        </div>
      </div>

        {/* info */}
        <div className='md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 pr-8 tracking-wider'>
          <h3 className='text-2xl mb-4'>{itemdata.title} | Oversized-T-shirt | Sway Clothing</h3>
          <h3 className='text-2xl text-gray-500 my-4'>₹{itemdata.price}.00</h3>

          <h3>Size</h3>
          <div className='flex w-full justify-between my-2'>

           <div className={``} onClick={ () => setItemSize('Small')}>
            <input id='s' name="size" className="appearance-none" type="radio" /> 
            <label htmlFor='s' className="ml-2  border p-2 rounded-md ">Small</label>
           </div>

           <div className='' onClick={ () => setItemSize('Medim')}>
           <input id='m' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='m' className="ml-2  border p-2 rounded-md ">Medium</label>
           </div>

           <div className='' onClick={ () => setItemSize('Large')}>
           <input id='l' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='l' className="ml-2  border p-2 rounded-md ">Large</label>
           </div>

           <div className='' onClick={ () => setItemSize('XL')}>
           <input id='xl' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='xl' className="ml-2  border p-2 rounded-md ">XL</label>
           </div>

           <div className='' onClick={ () => setItemSize('XXL')}>
           <input id='xxl' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='xxl' className="ml-2  border p-2 rounded-md ">XXL</label>
           </div>

           
          </div>

          <div className='flex md:flex-row lg:flex-row xl:flex-row w-full gap-5 sm:flex-col xs:flex-col '>
            <div className='bg-gray-600 justify-center w-[250px] flex items-center h-[50px]  rounded-l-full rounded-r-full py-2 my-3'>
              <button
                className=' px-4 text-xl  w-[33%]  text-center border-r-2 disabled:opacity-55'
                disabled={num < 2}
                onClick={decHandler}
              > - </button>
              <span className=' w-[33%] grow text-center  '>{num}</span>
              <button
                className='border-l-2 text-center w-[33%]  disabled:opacity-55 '
                
                onClick={incHandler}
              > + </button>
            </div>

          <div className='flex gap-5 sm:mb-4 xs:mb-4'>
          {
              !itemInCart && (
                <button
                  onClick={() => addHandler(itemdata)}
                  className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
                  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
                  relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
                  hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
                  before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
                   before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
                   before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                    text-[#fff]"> Add to cart </button>
              )
            }

            {
              itemInCart && (
                <button
                  onClick={cartItemHandler}
                  className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
                  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
                  relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
                  hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
                  before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
                   before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
                   before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                    text-[#fff]"> View Cart </button>
              )
            }

            {
              !itemInWishlist && <button
              onClick={() => addToWishlistHandler(itemdata)}
              className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
              h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
              relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
              hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
              before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
               before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
               before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                text-[#fff]"> Add to Wishlist </button>
            }

            {
              itemInWishlist && 
              <button
                  onClick={() => addToWishlistHandler(itemdata)}
                  className="px-2 border-white md:px-4 lg:px-4 xl:px-4 border bg-black 
                  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer 
                  relative overflow-hidden transition-all duration-500 ease-in-out shadow-md 
                  hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full 
                  before:w-full before:h-full before:bg-gradient-to-r before:from-[#009b49]
                   before:to-[rgb(105,184,141)] before:transition-all before:duration-500 
                   before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0
                    text-[#fff]"> Wishlisted </button>
            }
          </div>

          </div>

          <p>Category: Streetwear</p>
        </div>
      </div>

      <div className="lg:m-10 w-[90vw] lg:p-10">
        <div className="flex justify-around p-8">
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler(0)}
          >
            Description
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler(1)}
          >
            Additional information
          </span>
          <span
            className="text-xl cursor-pointer"
            onClick={() => clickHandler(2)}
          >
            Reviews
          </span>
        </div>

        <div className=" w-full">
          {info === 0 && (
            <div className="flex flex-col w-full">
              <div className="flex  md:flex-row lg:flex-row xl:flex-row sm:flex-col xs:flex-col  gap-14 justify-between">
                <img
                  loading='lazy'
                  src={itemdata.descImg}
                  className="w-[25vw]  sm:w-full xs:w-full "
                  alt="description image"
                />

                <p className='p-10 sm:p-4 xs:p-4'>Boost Your Brainpower with Brainfood
Are you looking for a way to enhance your mental clarity and focus? Look no further than Brainfood! Our specially formulated product is designed to provide your brain with the nutrients it needs to function at its best.

What is Brainfood?
Brainfood is a unique blend of natural ingredients that have been scientifically proven to support brain health. Our formula includes vitamins, minerals, and antioxidants that nourish your brain and promote optimal cognitive function.

Why Choose Brainfood?
There are many reasons to choose Brainfood as your go-to brain-boosting supplement. Firstly, our product is made with high-quality ingredients that are carefully selected for their effectiveness. We prioritize quality and purity to ensure you are getting the best possible product.

Secondly, Brainfood is easy to incorporate into your daily routine. Simply take the recommended dosage with a meal and let the nutrients go to work. No need to worry about complicated regimens or inconvenient schedules.

Lastly, Brainfood is backed by science. Our formula is based on extensive research and studies that demonstrate the positive impact of our ingredients on brain health. You can trust that Brainfood is a reliable and effective choice for enhancing your cognitive abilities.

Experience the Benefits of Brainfood
With Brainfood, you can experience improved focus, enhanced memory, and increased mental clarity. Say goodbye to brain fog and hello to a sharper mind. Invest in your brain health today and unlock your full cognitive potential with Brainfood.</p>
              </div>

              <div>
                Description:
                <br />1. Weight: 200 GSM
                <br />2. Composition: Mid-Weight Cotton
                <br />
                MADE IN INDIA
              </div>
            </div>
          )}

          {info === 1 && <div>Additional information content</div>}
          {info === 2 && <div>Reviews content</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
