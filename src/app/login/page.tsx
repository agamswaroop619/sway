'use client';
import {  useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { setUser } from "@/lib/features/user/user";
import { useAppDispatch } from "@/lib/hooks";
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import GoogleLogin from "../components/GoogleLogin";
import toast from "react-hot-toast";
import {  sendPasswordResetEmail } from "firebase/auth";

const userLoginInfo = (state: RootState) => state.user.isLoggedIn;

const LoginPage = () => {

  const [email, setEmail ] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useAppSelector(userLoginInfo);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [ status, setStatus ] = useState("login");

  
  if (isLoggedIn) {
    return null; // Ensure no unnecessary rendering
  }
  
  

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (email === "" || password === "") {
      setError("Please fill all the required fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        const registrationData = localStorage.getItem("registrationData");
        const { name = "", phone = "" } = registrationData ? JSON.parse(registrationData) : {};



      
        // Check if user data exists in Firestore
        const userDoc = await getDoc(doc(firestore, "users", user.uid));

        if (!userDoc.exists()) {
          // Save user data to Firestore
          await setDoc(doc(firestore, "users", user.uid), {
            name,
            email: user.email,
            address: "",
            phone ,
            orders: [],

          });

          // Save user data in Redux store
        const userData = {
          name: name || user.displayName || "",
          email: user.email || "",
          userId: user.uid,
          
          refreshToken: user.refreshToken || "",
          accessToken: "",
          phone: "",
          orders: [] ,

          delivery: {
            address: "",
            apartment: "",
            city: "",
            postalCode: "",
            state: "",
            country: ""
          },
          wishlist: [],
          cart: [],
        };

        dispatch(setUser(userData));

        }
        else {
          // If user data exists, update Redux store with existing data
          const userData = {
            name: userDoc.data().name ,
            email: userDoc.data().email ,
            userId: userDoc.data().uid,
            refreshToken: "",
            accessToken: "",
            phone: userDoc.data().phone,
            orders: [],

            delivery: {
              address: "",
              apartment: "",
              city: "",
              postalCode: "",
              state: "",
              country: ""
            },
            wishlist: [],
            cart: [],
          }

          dispatch( setUser(userData));

        }

        // Redirect to the profile section
        toast.success("User logged in successfully...")
        router.push("/profile");

      } else {
        setError("Please verify your email before logging in.");
      }

      setEmail("");

    } catch (error) {

      toast.error("Something went wrong. Plz try again later");
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const resetPassword = async (e: React.FormEvent) => {

    e.preventDefault();

    setError(null);


    if( email.trim() === "" ) {
      setError("Plz enter the email");
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Please check your inbox.");
      setEmail("");
    } catch (error) {

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };
  

  return (
    <div className="w-full  bg-gray-300 pb-10 flex justify-center">

      { status === "login" && 
      <form className="p-4 bg-white text-black flex flex-col mt-6  w-80" onSubmit={handleLogin}>
        <h2 className="text-center text-xl">Login</h2>

    
        <label htmlFor="email">Email<sup className="text-red-600">*</sup></label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
          className="border-2 px-2 py-1 focus:outline-none my-1"
          placeholder="abc@xyz.com"
          required
        />

        <label htmlFor="password">Password<sup className="text-red-600">*</sup></label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 px-2 py-1 focus:outline-none my-1"
          type="password"
          id="password"
          placeholder="password"
          required
        />


      <p onClick={ () => setStatus("password-reset")}  className="group text-blue-400 transition-all duration-100 ease-in-out"
            
            >
              <span
                className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
              >
                Forget your password
              </span>
            </p>


        {error && <p className="text-red-500 h-10">{error}</p>}

        <button
          type="submit"
          className="w-full my-2 text-white bg-black text-center p-2 rounded-md "
        >
          Login
        </button>

        <div className="bg-gray-400 h-[2px] w-full border "></div>

        <p className="text-center my-1">
          Don{`'`}t have an account
          <Link
              className="group ml-1 text-blue-400 transition-all duration-100 ease-in-out"
              href="/register"
            >
              <span
                className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
              >
                Sign up
              </span>
            </Link>
        </p>

        <div className="w-full flex justify-between mb-2">

          < GoogleLogin />
            
        </div>

        <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
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
    }

    {
      status === "password-reset" &&  <form className="p-4 bg-white text-black flex flex-col mt-6 pb-8 w-80" onSubmit={resetPassword}>
      <h2 className="text-center text-xl">Password reset</h2>

  
      <label htmlFor="email">Email<sup className="text-red-600">*</sup></label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        id="email"
        type="email"
        className="border-2 px-2 py-1 focus:outline-none my-1"
        placeholder="abc@xyz.com"
        required
      />


    <p onClick={ () => setStatus("login")}  className="group text-blue-400 transition-all duration-100 ease-in-out"
          
          >
            <span
              className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
            >
              sign in
            </span>
          </p>


      {error && <p className="text-red-500 h-10">{error}</p>}

      <button
        type="submit"
        className="w-full my-2 text-white bg-black text-center p-2 rounded-md "
      >
        Reset
      </button>

      <div className="bg-gray-400 h-[2px] w-full border "></div>

      <p className="text-center my-1">
        Don{`'`}t have an account
        <Link
            className="group ml-1 text-blue-400 transition-all duration-100 ease-in-out"
            href="/register"
          >
            <span
              className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
            >
              Sign up
            </span>
          </Link>
      </p>

      <div className="w-full flex justify-between mb-2">

        < GoogleLogin />
          
      </div>

      <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
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
    }
 

    </div>
  );
};

export default LoginPage;
