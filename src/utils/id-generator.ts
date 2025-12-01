import { supabase } from "@/integrations/supabase/client"; // Import supabase client

// Define short codes for categories
const categoryShortCodes: { [key: string]: string } = {
  "Kids Patpat": "KP",
  "Shein Gowns": "SG",
  "Vintage Shirts": "VS",
  "Children Jeans": "CJ",
  "Children Shirts": "CS",
  "Men Vintage Shirts": "MVS",
  "Amazon Ladies": "AL",
  "Others": "OT",
  // Add more as needed, ensure these match your actual category names
};

const generateCategoryShortCode = (categoryName: string): string => {
  const mappedCode = categoryShortCodes[categoryName];
  if (mappedCode) return mappedCode;

  // Fallback: take first two letters, uppercase, or a generic code
  return categoryName.substring(0, 2).toUpperCase() || "XX";
};

// Utility function to generate a 5-digit random number, padded with leading zeros
const generateRandomFiveDigits = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Set to keep track of generated IDs to ensure uniqueness within a session
// For true uniqueness across sessions/deployments, always check the database.
const usedProductIds = new Set<string>();

/**
 * Generates a unique product ID based on the category name and 5 random digits.
 * Format: UP-XX-##### (e.g., UP-KP-45789)
 * @param categoryName The name of the product category.
 * @returns A unique product ID string.
 */
export const generateProductId = async (categoryName: string): Promise<string> => {
  const shortCode = generateCategoryShortCode(categoryName);
  
  let newId: string;
  let isUnique = false;
  let attempts = 0;
  
  do {
    const randomDigits = generateRandomFiveDigits();
    newId = `UP-${shortCode}-${randomDigits}`;
    attempts++;

    // Check uniqueness in Supabase
    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('id', newId);

    if (error) {
      console.error("Error checking product ID uniqueness:", error);
      // Fallback if database check fails
      return `UP-${shortCode}-${Date.now()}`;
    }

    isUnique = (count === 0) && !usedProductIds.has(newId); // Also check session uniqueness
    if (attempts > 100) { // Fallback if we somehow run out of unique IDs
      console.error("Failed to generate a unique product ID after 100 attempts.");
      return `UP-${shortCode}-${Date.now()}`;
    }
  } while (!isUnique);

  usedProductIds.add(newId);
  return newId;
};