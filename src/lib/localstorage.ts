// utils/localStorage.ts
import { User } from "./features/user/user";

interface UserDetails{
    userProfile: User | null,
    isLoggedIn: boolean
}

export const saveToLocalStorage = (key: string, value: UserDetails) => {
    try {
      const serializedState = JSON.stringify(value);
      localStorage.setItem(key, serializedState);
    } catch (e) {
     // console.error("Could not save state to localStorage", e);
    if(e instanceof Error){
      console.error("");
    }
     
    }
  };
  
  export const loadFromLocalStorage = (key: string) => {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    } catch (e) {
      //console.error("Could not load state from localStorage", e);
      if(e instanceof Error){
        console.error("");
      }
      return undefined;
    }
  };
  
  export const removeFromLocalStorage = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
     // console.error("Could not remove state from localStorage", e);
     if(e instanceof Error){
      console.error("");
    }
    }
  };
  