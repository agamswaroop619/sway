
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firestore, auth } from "../firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/user/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Link from "next/link";

const GoogleLogin = () => {

    const dispatch= useAppDispatch();
    const router = useRouter();

   const login = async () => {
        try {

            const googleAuth = new GoogleAuthProvider();
            const result= await signInWithPopup( auth, googleAuth);

            const uid = result.user.uid;

            const userDoc = await getDoc(doc(firestore, "users", uid));

            const userData= userDoc.data();

            if (!userDoc.exists()) {
            
                // Save user data to Firestore
                await setDoc(doc(firestore, "users", uid), {
                    name: result.user.displayName,
                    email: result.user.email,
                    userId: uid,
                    delivery: {
                        address: "",
                        apartment: "",
                        city: "",
                        postalCode: "",
                        state: "",
                        country: ""
                      },
                    phone: "" ,
                    lastName: "",
                    orders: [],
                    wishlist: []
                });
            
                const user = {
                    userId: result.user.uid,
                    name: result.user.displayName || "",
                    email: result.user.email || "",
                    lastName: "",
                    delivery: {
                        address: "",
                        apartment: "",
                        city: "",
                        postalCode: "",
                        state: "",
                        country: ""
                      },
                    phone: "",
                    orders: [],
                    refreshToken: result.user.refreshToken || "",
                    accessToken: "",
                    wishlist: [],
                    cart: []
                };
            
                dispatch(setUser(user));
            
            } else {
            
                const user = {
                    userId: result.user.uid,
                    name: userData?.name || "",
                    email: userData?.email || "",
                    delivery: {
                        address: userData?.delivery?.address || "",
                        apartment: userData?.delivery?.apartment || "",
                        city: userData?.delivery?.apartment || "",
                        postalCode: userData?.delivery?.postalCode || "",
                        state: userData?.delivery?.state || "",
                        country: userData?.delivery?.country || ""
                      },
                    phone: userData?.phone || "",
                    orders: userData?.orders || [],
                    refreshToken: result.user.refreshToken || "",
                    lastName: userData?.lastName || "",
                    accessToken: "",
                    wishlist: userData?.wishlist || [],
                    cart: []
                };     
                dispatch(setUser(user)); // You may want to add this dispatch for consistency
            }
            
            toast.success("User login in successfully");
            router.push("/profile");

        } catch (error) {
            throw new Error(`Google authentication failed : ${error}`)
            //if( error instanceof Error)
           //console.log("error has occured ")
        }
   }

    return(
        <div className="w-[300px] flex  justify-center items-center">

             <Link href="#" onClick={ login}
              className=" flex p-2  rounded-md hover:scale-105 transition duration-300 ease-in-out border shadow"> 
              <img
                className="max-w-[25px] mr-1"
                src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                alt="Google"
              />
              Continue With Google
          </Link>

        </div>
    )
}

export default GoogleLogin;
