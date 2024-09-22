

// import Link from "next/link";
// import SliderBanner from "./components/SliderBanner";
// import CardSlider from "./components/CardSlider";
import Image from 'next/image';
// import { Interface } from "readline";



export default function Home() {

  // const data = [
  //   {
  //     id: 1,
     
  //     title: "Brainfood | Oversized-T-shirt | Sway Clothing",
  //     images: [
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997267/brain%20food/image1_fpmqii.jpg",
  //         imgId: 1,
  //       },
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997264/brain%20food/31_oavkbd.jpg",
  //         imgId: 2,
  //       }
  //     ]
  // },
  // {
  //     id: 2,
  //     title: "Break Rules | Oversized-T-shirt | Sway Clothing",
  //     images: [
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997332/break%20rules/29_rfjomm.jpg",
  //         imgId: 1,
  //       },
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997330/break%20rules/12_ugtrgw.jpg",
  //         imgId: 2,
  //       }
  //     ]
  // },
  // {
  //     id: 4,
  //     title: "Cupid | Oversized-T-shirt | Sway Clothing",
  //     images: [
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997481/cupid/1_pawmua.jpg",
  //         imgId: 1,
  //         },
  //         {
  //           url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997483/cupid/10_y58lha.jpg",
  //           imgId: 2
  //           }
  //           ]
  // },
  // {
  //     id: 5,
  //     title: "Endure | Oversized-T-shirt | Sway Clothing",
  //     images: [
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997547/endure/25_xwgo6e.jpg",
  //         imgId: 1,
  //       },
  //       {
  //         url : "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997548/endure/26_nqtbou.jpg",
  //         imgId: 2,
  //       }
  //     ]
  // },
  // {
  //     id: 6,
  //     title: "Humanity | Oversized-T-shirt | Sway Clothing",
  //     images: [
  //       {
  //          url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997601/Humanity/13_oitaab.jpg",
  //          imgId: 1,
  //       },
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997601/Humanity/13_oitaab.jpg",
  //         imgId: 2
  //       }
  //     ]
  // },
  // {
  //     id: 7,
  //     title: "It's Hard to be Simple | Oversized-T-shirt | Sway Clothing",
  //     images: [
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997737/It%27s%20hard%20to%20be%20simple/22_yjre27.jpg",
  //         imgId: 1,
  //       },
  //       {
  //         id: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997737/It%27s%20hard%20to%20be%20simple/22_yjre27.jpg",
  //         imgId: 2
  //       }
  //     ]
  // },
  // {
  //     id: 8,
  //     title: "Make Your Move | Oversized-T-shirt | Sway Clothing",
  //     images: [
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997822/make%20your%20move/17_mbzxyx.jpg",
  //         imgId: 1,
  //       },
  //       {
  //         url: "https://res.cloudinary.com/dbkiysdeh/image/upload/v1726997822/make%20your%20move/18_kvkoe5.jpg",
  //         imgId: 2
  //       }
  //     ]
  // }
  // ]
 

  return (
    <>
     <div className="flex justify-center relative">
      <Image
      alt="bg image"
      src="https://sway.club/wp-content/uploads/2024/04/600fc4707364098a5b909bc17c54ad52.jpg"
      height={500}
 width={1200}
 objectFit="cover"
 priority
      />
       <div>
        <h3 className="absolute bottom-24 text-center left-40 text-5xl font-normal text-white ">
          Slay with sway
        </h3>
       </div>
        <button className="absolute bottom-12 text-center left-40 bg-slate-500 p-2 rounded-full">
          New In
        </button>
     </div>

     {/* <SliderBanner /> */}
     {/* <CardSlider /> */}

     {/* <div className='flex w-full justify-between '>
          {
            data.map( (item) => {
              return (
                <Link key={item.id} href="/products/1"  className='w-[30%]  flex flex-col items-center border-b my-2 p-2'>
                <div className="relative group">
                <Image 
              src={item.images[0].url} 
              alt={item.title} 
              width={500} 
              height={500} 
              className="object-cover w-full h-auto"
            />
          )}
          {product.images[1]?.url && (
            <Image 
              src={product.images[1].url} 
              alt={product.title} 
              width={500} 
              height={500} 
              className="absolute top-0 left-0 w-full h-auto object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
            </div>
                 <div className='w-full p-4 text-center'>
                 <h3 className=" mb-2 ">{item.title}</h3>
                 <p>₹499</p>
                 </div>

                  </Link>
              )
            })
          }
          </div> */}

      <div className="my-20 w-full flex flex-col ">
        <h2 className="text-3xl my-3">Follow Us On @Sway.society</h2>
        <Image
          className="w-full"
          alt='image'
          width={1300} height={1000}
          src="https://sway.club/wp-content/uploads/2024/04/sway-website-post-1536x922.jpg"
        />
      </div>
    </>
  );
}
