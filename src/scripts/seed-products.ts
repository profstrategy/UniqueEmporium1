import 'dotenv/config'; // Load environment variables from .env
import { supabase } from "../integrations/supabase/serverClient.ts";
import { mockProducts } from "../data/products.ts";

async function seedProducts() {
  console.log("Starting product seeding...");

  for (const product of mockProducts) {
    // Prepare product data for insertion, ensuring JSONB fields are handled correctly
    const productToInsert = {
      id: product.id,
      name: product.name,
      category: product.category,
      images: product.images, // Array of text
      price: product.price,
      original_price: product.originalPrice, // Map to snake_case for DB
      discount_percentage: product.discountPercentage, // Map to snake_case
      rating: product.rating,
      review_count: product.reviewCount, // Map to snake_case
      tag: product.tag,
      tag_variant: product.tagVariant, // Map to snake_case
      limited_stock: product.limitedStock, // Map to snake_case
      min_order_quantity: product.minOrderQuantity, // Map to snake_case
      status: product.status,
      full_description: product.fullDescription, // Map to snake_case
      key_features: product.keyFeatures, // Array of text
      style_notes: product.styleNotes, // Map to snake_case
      detailed_specs: product.detailedSpecs, // JSONB
      reviews: product.reviews, // JSONB
      related_products: product.relatedProducts, // Array of text
      created_at: new Date().toISOString(), // Add created_at for new entries
    };

    const { error } = await supabase
      .from('products')
      .upsert(productToInsert, { onConflict: 'id' }); // Upsert based on 'id'

    if (error) {
      console.error(`Error upserting product ${product.name} (${product.id}):`, error);
      // If an error occurs, we should probably stop or at least log it clearly
      // and potentially re-throw if it's a critical setup error.
      // For now, just logging and continuing.
    } else {
      console.log(`Successfully upserted product: ${product.name}`);
    }
  }

  console.log("Product seeding complete.");
}

seedProducts().catch((err) => {
  console.error("An unhandled error occurred during product seeding:");
  console.error("Error object:", err);
  if (err instanceof Error) {
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
  } else if (typeof err === 'object' && err !== null) {
    try {
      console.error("JSON stringified error:", JSON.stringify(err, null, 2));
    } catch (e) {
      console.error("Could not stringify error object.");
    }
  }
});