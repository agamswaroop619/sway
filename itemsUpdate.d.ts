import { DocumentReference } from "firebase/firestore"; // Firestore type import

interface ItemsUpdate {
    itemRef: FirebaseFirestore.DocumentReference; 
    itemData: any
}