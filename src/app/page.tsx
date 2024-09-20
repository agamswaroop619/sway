import Image from "next/image";

export default function Home() {
  const data = [
    {
      id: 1,
      title: "Image 1",
      image1:
        "https://media.istockphoto.com/id/618976674/photo/fashion-woman-shopping.jpg?s=1024x1024&w=is&k=20&c=OVwkrGYD2ylReVjw_bs2rBQWt4QnP7cNbffJWoUCWWI=",
      image2:
        "https://media.istockphoto.com/id/1462655622/photo/beautiful-woman-in-a-leather-suit-looking-masculine.jpg?s=1024x1024&w=is&k=20&c=nFOAF-146OMBFNaETqvTywaxWj15KA8WpbXtyhCCDxw=",
    },
    {
      id: 2,
      title: "Image 2",
      image1:
        "https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600",
      image2:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 3,
      title: "Image 3",
      image1:
        "https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=600",
      image2:
        "https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    // {
    //   id: 4,
    //   title: "Image 4",
    //   image1: "https://images.pexels.com/photos/1034859/pexels-photo-1034859.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   image2: "https://images.pexels.com/photos/972804/pexels-photo-972804.jpeg?auto=compress&cs=tinysrgb&w=600",
    // },
    // {
    //   id: 5,
    //   title: "Image 5",
    //   image1: "https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   image2: "https://images.pexels.com/photos/413959/pexels-photo-413959.jpeg?auto=compress&cs=tinysrgb&w=600",
    // }
  ];

  return (
    <>
      <div className="relative w-[100vw] ">
        <img
          className="w-[100vw] "
          src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="hero"
        />
        <h3 className="absolute bottom-24 text-center left-40 text-3xl text-black">
          Slay with sway
        </h3>
        <button className="absolute bottom-12 text-center left-40 bg-slate-500 p-2 rounded-full">
          New In
        </button>
      </div>

      
      
      {/* // slider cards */}
      <div className="flex w-full my-24 justify-between">
        {data.map((item) => (
          <div key={item.id} className="w-3/12 h-[90vh] relative group">
            <div className="w-[100%] h-[70vh] relative overflow-hidden">
              <img
                src={item.image1}
                alt="image1"
                className="w-[100%] h-[100%] object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
              />
              <img
                src={item.image2}
                alt="image2"
                className="w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
              />
            </div>

            <div className="p-2 text-center">
              <h3 className="">{item.title}</h3>
              <p>
                 ₹699.00
              </p>
              <button className="bg-[#0a0a23] p-2 rounded-md">
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Featured Products */}
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

      <div className="my-20 w-full flex flex-col ">
        <h2 className="text-3xl my-3">Follow Us On @Sway.society</h2>
        <img
          className="w-full"
          src="https://sway.club/wp-content/uploads/2024/04/sway-website-post-1536x922.jpg"
        />
      </div>
    </>
  );
}
