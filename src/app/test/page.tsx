'use client'
import { useEffect, useState } from "react";
import { firestore } from '@/app/firebase.config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';


const TestPage = () => {
  
  const getData = async () => {
      const docRef =  doc(firestore, "products", "5zx1GpSmh4SwS8CTSdNj");

      console.log("Data fetched : ", docRef);

      try {
        // Fetch the document data
        const docSnap = await getDoc(docRef);
    
        // Check if the document exists
        if (docSnap.exists()) {
          // Access the document data
          console.log("Document data:", docSnap);
        } else {
          // The document does not exist
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }


      // Data you want to update
      const updatedData = {
         title: "new value",  // The field and the new value you want to update
      };

    try {
    // Update the field
    await updateDoc(docRef, updatedData);
    console.log("Document field updated successfully!");
  } catch (error) {
    console.error("Error updating document field: ", error);
  }
  }

  // Log data when it changes
  useEffect(() => {

    getData()

  }, []);

  return (
    <div>
      Results
    
    </div>
  );
};

export default TestPage;
