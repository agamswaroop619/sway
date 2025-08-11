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
    <>
      {!confirmation && (
        <div className="w-full pb-10 h-full p-2 bg-gray-300 flex justify-center ">
          <form className="p-2 pb-8 bg-white text-black flex flex-col mt-5   w-80">
            <h2 className="text-xl text-center ">Sign up</h2>

            <label className="" htmlFor="name">
         
              Name<sup className="text-red-600 text-md">*</sup>{" "}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              type="text"
              className="border-2 focus:outline-none  px-2 py-1   my-1"
              placeholder="Your name"
              required
            />

            <label className="" htmlFor="email">
          
              Email<sup className="text-red-600 text-md">*</sup>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="text"
              className="border-2  px-2 py-1  focus:outline-none my-1"
              placeholder="abc@xyz.com"
              required
            />

            <label htmlFor="Phone">
              Mobile<sup className="text-red-600 text-md">*</sup>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-2 px-2 py-1   focus:outline-none my-1"
              type="tel"
              id="phone"
              placeholder="01234 56789"
              required
            />

            <label htmlFor="password">
              Password<sup className="text-red-600 text-md">*</sup>
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 px-2 py-1  focus:outline-none my-1"
              type="password"
              id="password"
              placeholder="password"
              required
            />

            <p className="text-red-500 h-6">{error}</p>

            <button
              onClick={handleRegister}
              className="w-full my-1 text-white bg-black text-center p-2 rounded-md"
            >
         
              Create Account
            </button>

            <div className="bg-gray-400 h-[2px] mt-1 w-full border "></div>

            <div className=" w-full">
              <p className="text-center">
                Already have an account?
                <Link
                  className="group ml-1 text-blue-400 transition-all duration-100 ease-in-out"
                  href="/login"
                >
                  <span className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
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
                className="group text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span
                  className="cursor-pointer mx-1 bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Terms & Conditions
                </span>
              </Link>
              and
              <Link
                className="group mx-1 text-blue-400 transition-all duration-100 ease-in-out"
                href="#"
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Privacy Policy
                </span>
              </Link>
            </p>
          </div>
          </form>
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
