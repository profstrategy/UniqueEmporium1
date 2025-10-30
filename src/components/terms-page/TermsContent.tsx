"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TermItem {
  question: string;
  answer: string;
}

const termItems: TermItem[] = [
  {
    question: "1. Acceptance of Terms",
    answer:
      "By accessing or using Unique Emporium's website and services, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to all of these terms, do not use our website or services.",
  },
  {
    question: "2. User Accounts",
    answer:
      "To access certain features of the website, such as wishlists and order history, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.",
  },
  {
    question: "3. Product Information and Pricing",
    answer:
      "We strive to ensure that all product descriptions, images, and pricing for our unique wears are accurate. However, errors may occur. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.",
  },
  {
    question: "4. Orders and Payment",
    answer:
      "All orders placed through the website are subject to our acceptance. We may refuse to accept or may cancel any order, whether or not the order has been confirmed, for any or no reason, and without liability to you or anyone else. Payment options include Debit/Credit Card and Bank Transfer.",
  },
  {
    question: "5. Shipping and Delivery",
    answer:
      "Our shipping and delivery terms for fashion items are outlined in our separate Shipping Policy. By placing an order, you agree to the terms and conditions of our Shipping Policy.",
  },
  {
    question: "6. Returns and Refunds",
    answer:
      "Our returns and refunds for unique wears are governed by our Returns & Refunds Policy. Please review this policy carefully before making a purchase, especially for thrift items.",
  },
  {
    question: "7. Intellectual Property",
    answer:
      "All content on this website, including text, graphics, logos, images, and software, is the property of Unique Emporium or its content suppliers and is protected by international copyright laws.",
  },
  {
    question: "8. Limitation of Liability",
    answer:
      "Unique Emporium shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses arising from the use of our fashion products or services.",
  },
  {
    question: "9. Governing Law",
    answer:
      "These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of Nigeria.",
  },
  {
    question: "10. Changes to Terms",
    answer:
      "We reserve the right to update, change, or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const TermsContent = () => {
  return (
    <section className="py-12 md:py-16 px-4 max-w-4xl mx-auto">
      <motion.h2
        className="font-poppins text-2xl md:text-3xl font-bold text-center mb-8 text-foreground"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        Our General Terms and Conditions
      </motion.h2>

      <motion.div
        className="w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {termItems.map((item, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <AccordionItem value={`item-${index + 1}`} className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4 text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pt-0 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};

export default TermsContent;