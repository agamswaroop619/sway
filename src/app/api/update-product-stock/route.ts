import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/app/firebase.config";
import { collection, getDocs, doc, updateDoc, query, where, DocumentData } from "firebase/firestore";

// Fuzzy search function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match gets highest score
  if (s1 === s2) return 1.0;
  
  // Check if one string contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Calculate Levenshtein distance for similarity
  const matrix = [];
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const maxLength = Math.max(s1.length, s2.length);
  return maxLength === 0 ? 1 : (maxLength - matrix[s1.length][s2.length]) / maxLength;
}

export async function POST(req: NextRequest) {
  try {
    const { name, collection: collectionName, color, quantity } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Product name is required" },
        { status: 400 }
      );
    }

    // Find the product by name (title field) - case insensitive with fuzzy search
    const productsRef = collection(firestore, "products");
    const q = query(productsRef, where("title", "==", name));
    const querySnapshot = await getDocs(q);

    let productDoc = null;
    let bestMatch = null;
    let bestScore = 0;
    
    // If exact match not found, try case-insensitive search and fuzzy search
    if (querySnapshot.empty) {
      const allProductsSnapshot = await getDocs(productsRef);
      for (const doc of allProductsSnapshot.docs) {
        const data = doc.data();
        if (data.title) {
          const title = data.title.toLowerCase();
          const searchName = name.toLowerCase();
          
          // Case-insensitive exact match
          if (title === searchName) {
            productDoc = doc;
            break;
          }
          
          // Fuzzy search with similarity scoring
          const similarity = calculateSimilarity(data.title, name);
          if (similarity > 0.6 && similarity > bestScore) { // Threshold for fuzzy matching
            bestMatch = doc;
            bestScore = similarity;
          }
        }
      }
      
      // Use best fuzzy match if no exact match found
      if (!productDoc && bestMatch) {
        productDoc = bestMatch;
      }
    } else {
      productDoc = querySnapshot.docs[0];
    }

    if (!productDoc) {
      return NextResponse.json(
        { 
          success: false, 
          productFound: false,
          message: `Product with name "${name}" not found. Try checking the spelling or use a similar product name.` 
        },
        { status: 404 }
      );
    }

    // Get the first matching document
    const productRef = doc(firestore, "products", productDoc.id);
    const matchedProductName = productDoc.data().title;

    // Prepare update data
    const updateData: DocumentData = {
      updatedAt: new Date().toISOString()
    };

    // Update quantity array [S, M, L, XL, XXL]
    if (quantity) {
      updateData.quantity = [
        quantity.small || 0,
        quantity.medium || 0,
        quantity.large || 0,
        quantity.xl || 0,
        quantity.xxl || 0
      ];
    }

    // Update other fields if provided
    if (collectionName) updateData.collection = collectionName;
    if (color) updateData.color = color;

    // Update the document
    await updateDoc(productRef, updateData);

    return NextResponse.json({
      success: true,
      message: `Product "${name}" matched with "${matchedProductName}" and updated successfully`,
      productId: productDoc.id,
      matchedName: matchedProductName,
      similarity: bestScore > 0 ? bestScore : 1.0,
      updatedFields: Object.keys(updateData)
    });

  } catch (error) {
    console.error("Error updating product stock:", error);
    return NextResponse.json(
      { 
        success: false, 
        productFound: true,
        message: "Failed to update product",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 