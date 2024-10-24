
import { firestore } from '@/app/firebase.config';
import { Item } from '@/lib/features/items/items';
import { collection, getDocs } from 'firebase/firestore';
import { Timestamp } from "firebase/firestore";


export async function getData(): Promise<Item[] | null> {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      
      // Map through Firestore data
      const res = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt instanceof Timestamp)
        ? doc.data().createdAt.toMillis() // Convert Firestore Timestamp to milliseconds
        : doc.data().createdAt.createdAt,
      }));

      querySnapshot.docs.map( (doc) => {
        console.log("Item id : ", doc.id);
        console.log("data : ", doc.data());
      })

      console.log('res :', res);
  
      // Check if res is an array
      if (Array.isArray(res) && res.length > 0)  {
          return res as Item[]; // Type assertion once confirmed
        } else {
          console.error('Data fetched does not match the expected Item structure.');
          return null;
        }
  
      
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
      return null;
    }
  }