import { DocumentReference } from "firebase/firestore"; // Firestore type import

interface ItemsUpdate {
    docRef: DocumentReference,
    docData: any

}