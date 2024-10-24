'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { RootState } from '@/lib/store';  // Import the RootState type
import { addToCart } from '@/lib/features/carts/cartSlice';
import { useRouter } from 'next/navigation';
import { addToCartWishlist } from '@/lib/features/wishlist/wishlist';
import toast from 'react-hot-toast';
import { Item } from '@/lib/features/items/items';
import { itemsDataInCart } from '@/lib/features/items/items';
import { setItemsData } from '@/lib/features/items/items';
import { getData } from '@/app/utils/getData';
import StarRating from '@/app/components/Rating';
import Link from 'next/link';

const selectCartItems = (state: RootState) => state.cart.items;


const ProductDetails = () => {

  const [ data, setData ] = useState<Item[] | null>(null);
  const dataFromCart= useAppSelector(itemsDataInCart) ; // Ensure `data` is used or handled properly
  // You may want to log `data` if necessary for debugging:
  
  const [num, setNum] = useState(1);
  const [info, setInfo] = useState(0);
  const [itemdata, setItemdata] = useState<Item | null>(null);  // Start as null
  const [itemInCart, setItemInCart] = useState(false);
  const [itemInWishlist, setItemInWishlist]= useState(false);
  const [imgSrc, setImgSrc ] = useState<string | undefined>("");
  const [itemSize, setItemSize] = useState("");
  const [ reviews, setReviews ] = useState(0);

  const itemReviews = [
    {
      userId: 12,
      rating: 5,
      review: "This product is amazing",
    },
    {
      userId: 10,
      rating: 4,
      review: "This product is good",
    },
    {
      userId: 3,
      rating: 3,
      review: "This product is okay",
    },
    {
      userdId: 4,
      rating: 2,
      review: "This product is bad",
    },
    {
      userId: 5,
      rating: 1,
      review: "Worst experiences"
    },
    {
      userId: 6,
      rating: 5,
      review: "This product is amazing",
    },
    {
      userId: 21,
      rating: 4,
      review: "This product is good",
    },
    {
      userId: 20,
      rating: 3,
      review: "This product is okay",
    },
    {
      userId: 90,
      rating: 3,
      review: "This product is amazing",
    },
    {
      userId: 81,
      rating: 2,
      review: "This product is good",
    },
    {
      userId: 71,
      rating: 1,
      review: "This product is bad",
    }
  ]

  
  const dispatch = useAppDispatch();
  const router = useRouter();

 // Set initial data using useAppSelector
 useEffect(() => {
  if (dataFromCart && dataFromCart.length > 0) {
    setData(dataFromCart);
  } else {
    setData(null); // Ensure data is set to null if there's no cart data
  }
}, [dataFromCart]);

// Handle data fetching if not available
useEffect(() => {
  if (!data) {
    getData()
      .then((fetchedData) => {
        if (fetchedData && fetchedData.length > 0) {
          dispatch(setItemsData(fetchedData)); // Dispatch to Redux state
          setData(fetchedData); // Update local state
          
        } else {
          dispatch(setItemsData([])); // Dispatch empty data in case of no results
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        dispatch(setItemsData([])); // Handle error by dispatching empty array
      });
  }
}, [data, dispatch]);
  
  // Fetch cart items from Redux store
  const itemsFromStore = useAppSelector(selectCartItems);
  const cartItems = itemsFromStore;

  useEffect( () => {
    console.log("Item data : ", itemdata)
  }, [itemdata])
  
  const addHandler = (product: Item) => {

    toast.success(`item docId: ${product.docId}`)

    if (itemSize === "") {
      toast.error("Plz select a size");
      return;
    }
  
    const itemId = Number(product.id);
    const qnt = num;
    const price = product.price;
    const title = product.title;
    const image = product.images[0].url;
    const size = itemSize;
    const docId = product.docId;
  
    const cartItem = { itemId, qnt, price, title, image, size, docId };
  
    dispatch(addToCart(cartItem));
    setItemInCart(true);
  };
  
  const cartItemHandler = () => {
    router.push("/cart");
  };
  
  const params = useParams();
  const id = params.productId;
  const numberId = Number(id);
  
  const incHandler = () => {
    if (!itemdata) return;
  
    if (itemSize === "") {
      setNum(num + 1);
    } else {
      const small = itemdata?.quantity?.[0]?.small || 5;
      const medium = itemdata?.quantity?.[1]?.medium || 5;
      const large = itemdata?.quantity?.[2]?.large || 5;
      const xl = itemdata?.quantity?.[3]?.xl || 4;
      const xxl = itemdata?.quantity?.[4]?.xxl || 4;
  
      if (itemSize === "Small" ) {
        if( num < small)
        setNum(num + 1);
        else
        {
          setNum(small);
          toast.error(`Maximum product reached`);
        }
      } else if (itemSize === "Medium" ) {
        if( num < medium)
          setNum(num + 1);
          else
          {
            setNum(medium);
            toast.error(`Maximum product reached`);
          }
      } else if (itemSize === "Large" ) {
        if( num < large)
          setNum(num + 1);
          else
          {
            setNum(large);
            toast.error(`Maximum product reached`);
          }
      } else if (itemSize === "XL" ) {
        if( num < xl)
          setNum(num + 1);
          else
          {
            setNum(xl);
            toast.error(`Maximum product reached`);
          }
      } else if (itemSize === "XXL" ) {
        if( num < xl)
          setNum(num + 1);
          else
          {
            setNum(xl);
            toast.error(`Maximum product reached`);
          }
      } else {
        toast.error(`Maximum product reached`);
      }
    }
  };
  
  
  const decHandler = () => {
    if (num > 1) setNum(num - 1); // Prevent decrementing below 1
  };
  
  const clickHandler = (value: number) => {
    setInfo(value);
  };
  
  const addToWishlistHandler = (product: Item) => {

    toast.success(`item docId: ${product.docId}`)

    if (itemSize === "") {
      toast.error("Plz select a size");
      return;
    }
  
    const itemId = Number(product.id);
    const qnt = num;
    const price = product.price;
    const title = product.title;
    const image = product.images[0].url;
    const size = itemSize;
    const docId = product.docId;
  
    const cartItem = { itemId, qnt, price, title, image, size, docId};
  
    dispatch(addToCartWishlist(cartItem));
    setItemInWishlist(true);
  };
  
  const itemExists = (id: number) => {
    console.log("cart items:", cartItems);
    const res = cartItems.find((item) => item.itemId === id);
  
    console.log("res:", res);
  
    return res ? { exists: true, quantity: res.qnt } : { exists: false, quantity: 1 };
  };
  
  // Ensure scrolling starts at the top of the page
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  
    if (data && data.length > 0) {
      const productData = data.find((item): item is Item => Number(item.id) === numberId) || null;
  
      setItemdata(productData);

      if( productData?.userReview && productData?.userReview?.length > 0 ) {
        setReviews(productData.userReview.length);
      }
  
      const { exists, quantity } = itemExists(numberId);
      setItemInCart(exists);
      setNum(quantity);
    }
  }, [numberId, data]); // Add `data` to dependencies
  
  useEffect(() => {
    setImgSrc(itemdata?.images[0].url);
  }, [itemdata]);

  // Ensure `itemdata` exists before rendering
  if (!itemdata) return <div>Loading...</div>;

  return (
    <div className='my-2 scroll-smooth'>
      <div className="flex sm:flex-col xs:flex-col md:flex-row xl:flex-row lg:flex-row 2xl:flex-row justify-between">

      <div className='flex  sm:w-[100vw] xs:w-[100vw] sm:px-4 xs:px-4 md:flex-row lg:flex-row xl:flex-row sm:justify-center xs:justify-center w-[45vw] sm:flex-col-reverse xs:flex-col-reverse'>

            {/* for small screens */}
        <div className='block lg:hidden md:hidden xl:hidden overflow-x-scroll no-scrollbar w-[100vw] xs:w-[100vw] sm:w-[120vw]'>
        <div className='flex justify-between gap-[6px] h-28 w-[160vw]'>
          {
            itemdata.images.map( card => {
              return (
                <div key={card.imgId} className=" w-[20vw]  h-28">
                  <img src={card.url} alt="product image" className="xs:w-20 sm:w-20" onClick={() => setImgSrc(card.url)}/>
                   </div>
              )
            })
          }
        </div>
        </div>

          {/* for large screeens */}
        <div className='hidden mt-4 lg:block px-4 md:block xl:block  no-scrollbar overflow-y-scroll md:h-[60vh] lg:h-[100vh] h-[27vh] w-28'>
        <div className='flex h-[80vh] gap-y-4 flex-col '>
          {
            itemdata.images.map( card => {
              return (
                <div key={card.imgId} className={`w-20  `}  >
                  <img src={card.url} alt="product image" className={`w-14 ${imgSrc === card.url ? "border" : ""}`} onClick={() => setImgSrc(card.url)}/>
                   </div>
              )
            })
          }
        </div>
        </div>

        <div className='md:w-[95%]  overflow-hidden lg:w-[95%] xl:w-[80%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 '>
          <img
            className="w-[100%] "
            src={imgSrc}
            alt="product"
            
          />
        </div>
      </div>

        {/* info */}
        <div className='md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] sm:w-[100%] xs:w-[100%] p-4 pr-8 tracking-wider'>
          <h3 className='text-2xl '>{itemdata.title} | Oversized-T-shirt | Sway Clothing</h3>
          <h3 className='text-2xl text-gray-500 my-2'>₹{itemdata.price}.00</h3>

          
         <div className='flex gap-4 my-2'>

         { 
         itemdata.review > 0 && (
          // Calculate the average rating from the user reviews
        <StarRating   rating= {itemdata.review} /> )
        }

        {
          itemdata.review > 0 && <Link href="#reviews" onClick={() => setInfo(2)}><span >  ({itemdata.userReview?.length} reviews ) </span></Link>

        }
         </div>

          <div className='flex gap-2  mb-3'>  <h3>Size :</h3> {itemSize} </div>
          <div className='flex w-full gap-2 my-2'>

           <div 
            onClick={ () => setItemSize('Small')}>
            <input id='s' name="size" className="appearance-none" type="radio" /> 
            <label htmlFor='s' className={`${itemSize === "Small" ? "bg-white text-black  transition-colors duration-500 ease" : ""} border p-2 rounded-md `} >Small</label>
           </div>

           <div 
            onClick={ () => setItemSize('Medium')}>
           <input id='m' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='m' className={`${itemSize === "Medium" ? "bg-white text-black  transition-colors duration-500 ease" : ""}
            ml-2 border p-2 rounded-md `}>Medium</label>
           </div>

           <div 
            onClick={ () => setItemSize('Large')}>
           <input id='l' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='l' className={`${itemSize === "Large" ? "bg-white text-black  transition-colors duration-500 ease" : ""}
            ml-2 border p-2 rounded-md `}>Large</label>
           </div>

           <div 
            onClick={ () => setItemSize('XL')}>
           <input id='xl' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='xl' className={`${itemSize === "XL" ? "bg-white text-black  transition-colors duration-500 ease" : ""}
            ml-2 border p-2 rounded-md `}
            >XL</label>
           </div>

           <div 
            onClick={ () => setItemSize('XXL')}>
           <input id='xxl' name="size" className="appearance-none" type="radio" /> 
           <label htmlFor='xxl' className={`${itemSize === "XXL" ? "bg-white text-black  transition-colors duration-500 ease" : ""}
            ml-2 border p-2 rounded-md `}>XXL</label>
           </div>

           
          </div>

          <div className='flex md:flex-col lg:flex-row xl:flex-row w-full gap-5 sm:flex-col xs:flex-col '>
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

          <div className='flex gap-5 md:mb-4 sm:mb-4 xs:mb-4'>
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
        <div className="flex sm:gap-y-2 xs:gap-y-2 lg:flex-row xl:flex-row md:flex-row sm:flex-col xs:flex-col justify-around p-8">
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
            className="text-xl flex cursor-pointer"
            onClick={() => clickHandler(2)}
          >
            Reviews { reviews > 0 &&  <span className='mx-1'>  ({reviews}) </span> }

          </span>
        </div>

        <div className=" w-full">
          {info === 0 && (
            <div className="flex flex-col w-full" id='desc'>
              <div className="flex  md:flex-row lg:flex-row xl:flex-row sm:flex-col xs:flex-col  gap-14 justify-between">
                <img
                  loading='lazy'
                  src={itemdata.descImg}
                  className="w-[25vw] h-[35vh] lg:h-[65vh] md:w-[75vw]  xl:w-[65vw]  sm:w-full xs:w-full "
                  alt="description image"
                />

                <p className='p-10 sm:p-4 xs:p-4'>{`Boost Your Brainpower with Brainfood
Are you looking for a way to enhance your mental clarity and focus? Look no further than Brainfood! Our specially formulated product is designed to provide your brain with the nutrients it needs to function at its best.

<span > What is Brainfood? </span>
Brainfood is a unique blend of natural ingredients that have been scientifically proven to support brain health. Our formula includes vitamins, minerals, and antioxidants that nourish your brain and promote optimal cognitive function.

Why Choose Brainfood?
There are many reasons to choose Brainfood as your go-to brain-boosting supplement. Firstly, our product is made with high-quality ingredients that are carefully selected for their effectiveness. We prioritize quality and purity to ensure you are getting the best possible product.

Secondly, Brainfood is easy to incorporate into your daily routine. Simply take the recommended dosage with a meal and let the nutrients go to work. No need to worry about complicated regimens or inconvenient schedules.

Lastly, Brainfood is backed by science. Our formula is based on extensive research and studies that demonstrate the positive impact of our ingredients on brain health. You can trust that Brainfood is a reliable and effective choice for enhancing your cognitive abilities.

Experience the Benefits of Brainfood
With Brainfood, you can experience improved focus, enhanced memory, and increased mental clarity. Say goodbye to brain fog and hello to a sharper mind. Invest in your brain health today and unlock your full cognitive potential with Brainfood. `}</p>
              </div>

              <div className='p-4'>
                Description:
                <br />1. Weight: 200 GSM
                <br />2. Composition: Mid-Weight Cotton
                <br />
                MADE IN INDIA
              </div>
            </div>
          )}

          {info === 1 && <div id='additional'> Additional information content</div>}
          {info === 2 && <div id='reviews'>

          {
            itemReviews.map( ( item, index ) => {
              return (
                <div key={index} className='py-3 border-t-2'>
                  <div className='flex mb-2 text-gray-500 gap-4 hover:text-white transition-colors duration-300 ease '> Akash Kumar  <StarRating rating={ Number(item.rating)} />  </div>
                  <p> {item.review} </p>
                </div>
              )

            })
          }

          <form onSubmit={ (e) => {
            e.preventDefault();
            console.log(e);
            toast.success("Review submit successfully");
          }} className='my-6'>

            <p className='mb-2 w-full' >Your Rating <sup className='text-red-500'>*</sup></p>
            <StarRating  rating={4} />

            <p className='mt-4' >Write Review <sup className='text-red-500'>*</sup></p>
            <textarea id="review" className='w-full h-36 focus:outline-none p-2 border-2 my-1 border-gray-400 text-black rounded-md'/>

            <button className='border p-3 my-2 rounded-full'> Submit  </button>

          </form>
          
            </div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
