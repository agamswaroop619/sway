'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { setUser } from "@/lib/features/user/user";
import { useAppDispatch } from "@/lib/hooks";
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';

const userLoginInfo = (state: RootState) => state.user.isLoggedIn;

const LoginPage = () => {

  const [email, setEmail ] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useAppSelector(userLoginInfo);
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redirect if already logged in
  if (isLoggedIn) {
    router.replace("/profile");
    return null; // Prevent rendering the login form if already logged in
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
        const { name = "", email: storedEmail = "" } = registrationData ? JSON.parse(registrationData) : {};

// Optional check to log or compare storedEmail
if (storedEmail && storedEmail !== user.email) {
  console.log("Stored email doesn't match the current user email.");
}


        // Check if user data exists in Firestore
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          // Save user data to Firestore
          await setDoc(doc(firestore, "users", user.uid), {
            name,
            email: user.email,
            address: "",
            phone: "",
          });
        }

        // Save user data in Redux store
        const userData = {
          name: name || user.displayName || "",
          email: user.email,
          userId: user.uid,
          address: "",
          refreshToken: user.refreshToken || "",
          accessToken: "",
          phone: "",
        };

        dispatch(setUser(userData));

        // Redirect to profile page
        router.replace("/profile");
      } else {
        setError("Please verify your email before logging in.");
      }

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gray-400 flex justify-center">
      <form className="p-4 bg-white text-black flex flex-col mt-10 h-[65vh] w-80" onSubmit={handleLogin}>
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

        {error && <p className="text-red-500 h-10">{error}</p>}

        <button
          type="submit"
          className="w-full my-2 text-white bg-black text-center p-2 rounded-md"
        >
          Login
        </button>

        <div className="bg-gray-500 h-[1px] w-full my-2"></div>

        <p className="text-center">
          Don{`'`}t have an account?
          <Link href="/register" className="text-blue-600">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
