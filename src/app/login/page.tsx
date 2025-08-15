"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { setUser } from "@/lib/features/user/user";
import { useAppDispatch } from "@/lib/hooks";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import GoogleLogin from "../components/GoogleLogin";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";

const userLoginInfo = (state: RootState) => state.user.isLoggedIn;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useAppSelector(userLoginInfo);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState("login");

  if (isLoggedIn) {
    router.push("/profile"); // Ensure no unnecessary rendering
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (email === "" || password === "") {
      setError("Please fill all the required fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        const registrationData = localStorage.getItem("registrationData");
        const { name = "", phone = "" } = registrationData
          ? JSON.parse(registrationData)
          : {};

        // Check if user data exists in Firestore
        const userDoc = await getDoc(doc(firestore, "users", user.uid));

        if (!userDoc.exists()) {
          // Save user data to Firestore
          await setDoc(doc(firestore, "users", user.uid), {
            name,
            email: user.email,
            address: "",
            phone,
            lastName: "",
            orders: [],
            userId: user.uid,
          });

          // Save user data in Redux store
          const userData = {
            name: name || user.displayName || "",
            email: user.email || "",
            userId: user.uid,
            lastName: "",

            refreshToken: user.refreshToken || "",
            accessToken: "",
            phone: "",
            orders: [],

            delivery: {
              address: "",
              apartment: "",
              city: "",
              postalCode: "",
              state: "",
              country: "",
            },
            wishlist: [],
            cart: [],
          };

          dispatch(setUser(userData));
        } else {
          // If user data exists, update Redux store with existing data
          const userInfo = userDoc.data();

          const userData = {
            name: userInfo.name,
            email: userInfo.email,
            lastName: userInfo?.lastName || "",
            userId: userInfo.userId,
            refreshToken: "",
            accessToken: "",
            phone: userInfo?.phone || "",
            orders: userInfo?.orders || [],

            delivery: {
              address: userInfo?.delivery?.address || "",
              apartment: userInfo?.delivery?.apartment || "",
              city: userInfo?.delivery?.city || "",
              postalCode: userInfo?.delivery?.postalCode || "",
              state: userInfo?.delivery?.state || "",
              country: userInfo?.delivery?.country || "",
            },
            wishlist: userInfo?.wishlist || [],
            cart: [],
          };

          dispatch(setUser(userData));
        }

        // Redirect to the profile section
        toast.success("User logged in successfully...");
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

    if (email.trim() === "") {
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
    <div className="min-h-screen bg-gradient-to-b from-black to-green-950 flex justify-center items-center responsive-padding">
      <div className="w-full max-w-md">
        {status === "login" && (
          <form
            className="bg-white/10 backdrop-blur-sm text-white rounded-2xl p-6 xs:p-8 sm:p-8 md:p-8 lg:p-8 xl:p-8 border border-white/20 shadow-2xl"
            onSubmit={handleLogin}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-300 text-sm xs:text-base sm:text-base">
                Sign in to your account
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 transition-colors duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 transition-colors duration-300"
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStatus("password-reset")}
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 text-sm font-medium underline"
                >
                  Forgot your password?
                </button>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 text-lg"
              >
                Sign In
              </button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleLogin />
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 font-medium underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-xs">
                By signing in, you agree to our{" "}
                <Link
                  href="/terms-conditions"
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        )}

        {status === "password-reset" && (
          <form
            className="bg-white/10 backdrop-blur-sm text-white rounded-2xl p-6 xs:p-8 sm:p-8 md:p-8 lg:p-8 xl:p-8 border border-white/20 shadow-2xl"
            onSubmit={resetPassword}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl xs:text-3xl sm:text-3xl font-bold text-white mb-2">
                Reset Password
              </h2>
              <p className="text-gray-300 text-sm xs:text-base sm:text-base">
                Enter your email to receive reset instructions
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="reset-email"
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 transition-colors duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStatus("login")}
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 text-sm font-medium underline"
                >
                  Back to sign in
                </button>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 text-lg"
              >
                Send Reset Link
              </button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleLogin />
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 font-medium underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-xs">
                By signing in, you agree to our{" "}
                <Link
                  href="/terms-conditions"
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-green-400 hover:text-green-300 transition-colors duration-300 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
