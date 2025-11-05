// Utility function to generate a 5-digit random number
const generateRandomDigits = (): string => {
  // Generate a number between 10000 and 99999
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Set to keep track of generated IDs to ensure uniqueness within a session
const usedIds = new Set<string>();

/**
 * Generates a unique product ID based on the category name and 5 random digits.
 * Format: category-xxxxx (e.g., shein-28653)
 * @param categoryName The name of the product category.
 * @returns A unique product ID string.
 */
export const generateProductId = (categoryName: string): string => {
  const prefix = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  
  let newId: string;
  let attempts = 0;
  
  do {
    const digits = generateRandomDigits();
    newId = `${prefix}-${digits}`;
    attempts++;
    if (attempts > 100) {
      // Fallback if we somehow run out of unique IDs (highly unlikely for 5 digits)
      console.error("Failed to generate a unique ID after 100 attempts.");
      return `${prefix}-${Date.now()}`;
    }
  } while (usedIds.has(newId));

  usedIds.add(newId);
  return newId;
};