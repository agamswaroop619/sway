"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase.config";
import toast from "react-hot-toast";
import GoogleLogin from "../components/GoogleLogin";
import {  useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

import { RootState } from '@/lib/store';
const userLoginInfo = (state: RootState) => state.user.isLoggedIn;


const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>("");
  const [success, setSuccess] = useState<string | null>("");
  const [confirmation, setConfirmation] = useState(false);
  const [phone, setPhone] = useState("");

  // Handle registration
  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (email === "" || name === "" || password === "" || phone === "") {
      setError("Please fill all the required fields");
      return;
    }

    {
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      // Temporarily store user data in local storage
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          name,
          email,
          phone,
        })
      );

      setSuccess(
        "Registration Successful ! Please check your email for verification"
      );
      toast.success("User registered successfully...");
      setConfirmation(true);

      // clear form fiels
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const isLoggedIn = useAppSelector(userLoginInfo);
  const router = useRouter();
  

  
  if (isLoggedIn) {
    router.push('/profile') ; // Ensure no unnecessary rendering
  }

  return (
    < >
      {!confirmation && (
        <div className="min-h-screen bg-gradient-to-b from-black to-green-950 flex justify-center items-center responsive-padding ">
          <div className="w-full max-w-md">
             <form className="bg-white/10 backdrop-blur-sm text-white rounded-2xl p-6 xs:p-8 sm:p-8 md:p-8 lg:p-8 xl:p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-white mb-2 text-center ">Sign up</h2>

           <div className="">
             <div className="mb-4">
              <label className=" block text-sm font-medium text-gray-300 mb-2" 
              htmlFor="name">
         
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              type="text"
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 transition-colors duration-300"
              placeholder="Your name"
              required
            />
             </div>

            <div className="mb-4">
              <label className=" block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
          
              Email <span className="text-red-500">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="text"
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 transition-colors duration-300"
              placeholder="abc@xyz.com"
              required
            />
            </div>

            <div className="mb-4">
              <label className=" block text-sm font-medium text-gray-300 mb-2" htmlFor="phone">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 transition-colors duration-300"
              type="tel"
              id="phone"
              placeholder="01234 56789"
              required
            />
            </div>

            <div className="mb-6"> <label className=" block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 transition-colors duration-300"
              type="password"
              id="password"
              placeholder="password"
              required
            />
            </div>

          {error && (
            <div className="my-3 text-red-500 text-md text-center">
              {error}
            </div>
          )}

            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 text-lg"
            >
         
              Create Account
            </button>
           </div>

            <div className="bg-gray-400 mt-4 mb-4 h-[2px] mt-1 w-full border "></div>

            <div className=" w-full">
              <p className="text-center">
                Already have an account?
                <Link
                  className="group ml-1 text-green-400 transition-all duration-100 ease-in-out"
                  href="/login"
                >
                  <span className="bg-left-bottom bg-gradient-to-r text-sm from-green-400 to-green-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                    Login
                  </span>
                </Link>
              </p>

              <div className="w-full flex justify-between my-1">

                < GoogleLogin />
  
              </div>

            </div>

            <div className="text-gray-500 flex text-center flex-col mt-1 items-center text-sm"
          >
            <p className="cursor-default">
              By signing in, you agree to our
              <Link
                className="group text-green-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span
                  className="cursor-pointer mx-1 bg-left-bottom bg-gradient-to-r from-green-400 to-green  -400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Terms & Conditions
                </span>
              </Link>
              and
              <Link
                className="group mx-1 text-green-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-green-400 to-green-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Privacy Policy
                </span>
              </Link>
            </p>
          </div>
          </form>
           </div>
        </div>
      )}

      {confirmation && (
        <div className="flex pb-10 justify-center mt-20">
          <p> {success} </p>
        </div>
      )}

      
 
    </>
    
  );
};

export default RegisterPage;
