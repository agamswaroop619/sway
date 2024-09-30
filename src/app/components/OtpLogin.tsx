// 'use client';
// import { useRouter } from 'next/navigation';
// import React, { useState, useEffect, FormEvent, useTransition }  from "react";
// import {auth } from '../firebase.config';
// import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { verify } from 'crypto';


// const OtpLogin = () => {

//   const router= useRouter();
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [ error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isPending, startTransition] = useTransition();
//   const [resendCountdown, SetResendCountdown]= useState(0);

//   const [ recaptchaVerifier, setRecaptchaVerifier] = 
//   useState<RecaptchaVerifier | null>(null);

//   const [confirmationResult, setConfirmationResult] = 
//   useState<ConfirmationResult | null>(null);

//   useEffect( () => {
//     let timer: NodeJS.Timeout;
//     if( resendCountdown > 0 ){
//       timer= setTimeout(() => SetResendCountdown(resendCountdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   useEffect ( () => {
//     const recaptchaVerifier = new RecaptchaVerifier( 
//       auth, 
//       "recaptcha-container",
//       {
//         size: "invisible",
//       }
//       );
//       setRecaptchaVerifier(recaptchaVerifier);

//       return () => {
//         recaptchaVerifier.clear();
//       };
//   }, [auth])

//     const requestOtp = async ( e?: FormEvent<HTMLFormElement> ) => {
//         e?.preventDefault();

//         SetResendCountdown(60);

//         startTransition( async () => {
//             setError("");

//             if( !recaptchaVerifier) {
//                 return setError("RecaptchaVerifier is not initialized.")
//             }

//             console.log("phone no: ",phoneNumber);
//             console.log("auth: ", auth);
//             console.log("recaptchaVerifier: ", recaptchaVerifier);

//             try {
//                 const confirmationResult = await signInWithPhoneNumber(
//                     auth,
//                     phoneNumber,
//                     recaptchaVerifier
//                 );

//                 setConfirmationResult(confirmationResult);
//                 setSuccess("OTP sent successfully")
//             } catch (error: any ) {
//                 console.log(error);
//                 SetResendCountdown(0);

//                 if( error.code === 'auth/invalid-phone-number' ){
//                     setError("Invalid phone number. Plz check the phone number ")
//                 } else if( error.code === 'auth/too-many-requests') {
//                     setError("Too many requests. Please try again later.")
//                 } else{
//                     setError("Failed to send OTP. Please try again.")
//                 }
//             }
//         })

//     } 
    
//     useEffect( () => {
//         const hasEnteredAllDigits = otp.length === 6
//         if( hasEnteredAllDigits ){
//            verifyOtp()
//         }
//     }, [otp])

//     const verifyOtp = async () => {
//         startTransition( async() => {
//             setError("");

//             if( !confirmationResult) {
//                 setError("Please request OTP first")
//                 return;
//             }

//             try {
//                 await confirmationResult?.confirm(otp);
//                 router.replace("/");
//             } catch (error) {
//                 console.log(error);
//                 setError("Invalid OTP. Please check the OTP")
//             }
//         })
//     } 

//     const loadingIndicator = (
//         <div role="status" className='flex justify-center'>

//             <svg
//             aria-hidden="true"
//             className="w-8 h-8text-gray-200 animate-spin dark:text-gray-600 fill-green-600" 
//             viewBox="0 0 100 101"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg" >

// <path
// d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 050.590800 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50. 5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.
// 4013 9.67226 9.08144 27.9921 9.08144 50.59082"
// fill="currentColor"
// />
// <path
// d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28. 8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7. 41289069.5422 4.10194 63.2754 1.94025 56.7698 1.05124051.7666 0.367541 46.6976 0.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10. 0491060.8642 10.7766 65.9928 12.5457 70.6331 15.2552075.2735 17.9648 79.3347 21. 5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
// fill="currentFill"
// />
// </svg>
// </div>

//     )

//   return (
//     <div className=''>
//         {
//             !confirmationResult && (
//                 <form onSubmit={requestOtp} className='flex flex-col w-[30vw]'>
//                      <input className='p-2 text-black '  placeholder='Enter your phone no'
//                      type="tel" value={phoneNumber} 
//                      onChange={ (e) => setPhoneNumber(e.target.value)} />

//             <button 
//             disabled= { !phoneNumber || isPending || resendCountdown > 0 } 
//            className='my-4'
//             onClick={() => requestOtp()}>

//                 {
//                     resendCountdown > 0 ? `Resend in ${resendCountdown} seconds`
//                     : isPending ? "Sending OTP"
//                     : `Send OTP`

//                 }
                
//             </button>

//                 </form>
//             )
//         }

//        {
//         confirmationResult && (
//             <div className="flex flex-col items-center justify-center h-screen">
//                 <input className='tel' placeholder='Enter Otp' value={otp} onChange={ (e) => setOtp(e.target.value)} />
//             </div>
//             )
//        }
           

//         <div className='my-4 text-center'>
//             { error && <p className='text-red-500'> {error} </p>}
//             {success && <p className='text-green-500'>{success}</p>}
//         </div>
        
//         <div id="recaptcha-container" />

//     </div>
//   )
// }

// export default OtpLogin;
