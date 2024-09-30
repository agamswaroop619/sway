'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { api } from "../services/api";  
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore} from "../firebase.config"
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";

const LoginPage = () => {

  const [email, setEmail ] = useState("");
  const [password, setPassword] = useState("");
  const [ error, setError ] = useState< string | null >(null);
  
  const router = useRouter();

  const handleLogin = async ( event : React.FormEvent) => {

    event.preventDefault();
    setError(null);

    if( email === "" || password === "" ) {
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

       if( user.emailVerified ) {
          // Retrieve user data from local storage
          const registrationData = localStorage.getItem("registrationData");
          const {
            name = "",
            email = "",
          } = registrationData ? JSON.parse( registrationData ) : {};

          console.log(email);

          // check is user data exists in Firestore
          const userDoc = await getDoc( doc(firestore, "users", user.uid) );
          if( !userDoc.exists() ) {
            // save user data to Firestore after email verification
            await setDoc( doc(firestore, "users", user.uid), {
              name,
              email: user.email
            } );
       }

       router.replace("/"); 
       } else{
        setError("Please verify your email before logging in. ");

       }

    } catch (error) {
    
      if( error instanceof Error ) {
        setError(error.message);
      } else{
        setError("An unknown error occurred");
      }

    }

  }

  return (
    <div className="w-full h-screen bg-gray-400 flex justify-center ">

       
        
        <form className="p-4 bg-white text-black flex flex-col mt-10 h-[65vh] w-80">
            
        <h2 className="text-center text-xl">Login </h2>
           
                <label className="" htmlFor="email"> Email<sup className="text-red-600 text-md">*</sup></label>
                <input 
                value={email} onChange={(e) => setEmail(e.target.value)}
                id="email" type="text" className="border-2  px-2 py-1  focus:outline-none my-1" 
                placeholder="abc@xyz.com" required/>

            <label htmlFor="password" >Password<sup className="text-red-600 text-md">*</sup></label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} 
            className="border-2 px-2 py-1  focus:outline-none my-1" type="password" id="password"
            placeholder="password" required />

             <p className="text-red-500 h-10  ">{error}</p>
          
           
             <button
             onClick={ handleLogin}
              className="w-full my-2 text-white bg-black text-center p-2 rounded-md"> Login</button>
            
            <div className="bg-gray-500 h-[1px] w-full my-2">

            </div>
           
            <div className="">
              <p className="text-center">Dont have an account? <Link href="/register" 
              className="text-blue-600">Create account</Link> </p>
            </div>
          

        </form>
        
    </div>
  )
}

export default LoginPage
