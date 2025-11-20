"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

const categories: Category[] = [
  {
    id: "shein-gowns",
    name: "SHEIN Gowns",
    image: "/shein-gowns.webp",
    productCount: 120,
  },
  {
    id: "kidswear",
    name: "Kidswear",
    image: "/kidswear.webp",
    productCount: 85,
  },
  {
    id: "vintage-shirts",
    name: "Vintage Shirts",
    image: "/vintage-shirts.webp",
    productCount: 50,
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/accessories.webp",
    productCount: 30,
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CategoriesSection = () => {
  return (
    <section className="relative py-[0.4rem] bg-primary/10 rounded-3xl"> {/* Applied bg-primary/10 and rounded-3xl here */}
      <motion.div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
          "py-8 md:py-12"
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
          variants={itemVariants}
        >
          Shop by Category
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
              variants={itemVariants}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {category.productCount} products
                  </p>
                  <Link to={`/products?category=${category.id}`}>
                    <Button
                      variant="secondary"
                      className="mt-3 px-4 py-2 text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      View Category
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="mt-12">
          <Link to="/products">
            <Button size="lg" className="rounded-full">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CategoriesSection;