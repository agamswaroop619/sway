import React from 'react'

const page = () => {

    

  return (
    <div className='mx-10 text-[#2BD920]'>
        
        <h2 className='text-xl my-4'> <em>GET IN TOUCH</em> </h2>
        
        <h1 className='text-5xl tracking-wider my-4'>CONTACT US !</h1>

        <div className='flex gap-4 my-4 '>
            <span className='p-2 rounded-full border border-[#2BD920]'>slaywithsway@gmail.com</span>
            <span className='p-2 rounded-full border border-[#2BD920]'>Phone no</span>
        </div>

        <div className='flex justify-between lg:flex-row md:flex-row xl:flex-row sm:flex-col-reverse xs:flex-col-reverse'>

            <img src="https://sway.club/wp-content/uploads/2024/04/Slide1.jpg" className='lg:w-[40vw] md:w-[40vw] xl:w-[40vw] w-[40vw]
            sm:w-full xs:w-full ' alt="Logo" />
            <div className='px-10 py-6 text-white'>
                <p className='text-lg mt-4  font-semibold'>Address: Sway Clothing , Maharajganj Chowk , Jamui , BIHAR 811307</p>
                <p className='text-lg mt-4  '> <span>HOURS:</span> <span> Mon-Fri 9:00AM - 5:00PM </span> </p>
                <p className='text-lg mt-4  font-semibold'>Phone: </p>
                <p className='text-lg mt-4  font-semibold'>Email: slaywithsway@gmail.com</p>

            </div>
        </div>
        
        <div className='flex my-5 justify-between lg:flex-row md:flex-row xl:flex-row sm:flex-col xs:flex-col'>
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d463171.84328269376!2d85.96277970703127!3d24.91400768887048!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f22b13eeca8c75%3A0x133ea243a8e4c9ac!2sMaharajganj%20jamui!5e0!3m2!1sen!2sus!4v1728851349253!5m2!1sen!2sus" className='h-[50vh] lg:w-[40vw] md:w-[40vw] xl:w-[40vw] w-[40vw]
         sm:w-full xs:w-full'  loading="lazy" ></iframe>
        

        <form className='w-[50vw]  sm:mt-10 xs:mt-10   px-5 flex flex-col lg:w-[50vw] md:w-[50vw] xl:w-[50vw] 
            sm:w-full xs:w-full'>
            <label className='text-white'  htmlFor="name">Name</label>
            <input className='mb-2 text-black p-2 rounded-sm'  type="text" id="name" placeholder='Name'/>

            <label className='text-white'  htmlFor="phone">Phone No</label>
            <input className='mb-2 p-2 text-black rounded-sm'  type="tel" id='phone' placeholder='+91 01234 56789' />

            <label className='text-white'  htmlFor="message">Message</label>
            <textarea  className='mb-2 p-2 text-black rounded-sm h-[20vh]'  id='message' placeholder='Message'/>

            <button className='w-full my-4 text-center border p-2 rounded-md text-white bg-gray-600'> Send</button>

        </form>
        </div>



    </div>
  )
}

export default page
