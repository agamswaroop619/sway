export function generateUniqueString(productTitle: string) {
    // Get the current date in YYYYMMDD format
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // e.g., 20241102 for Nov 2, 2024
  
    // Convert product title to a unique hash (for simplicity, using base64 encoding of the title)
    const titleHash = btoa(productTitle).slice(0, 5); // Shorten the hash for brevity
  
    // Add a random 4-digit number to ensure uniqueness
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  
    // Concatenate to form the unique string
    return `${formattedDate}-${titleHash}-${randomSuffix}`;
  }