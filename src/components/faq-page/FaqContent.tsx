"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. We also offer installment plans through our financing partners.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3-5 business days. Expedited shipping options are available at checkout for faster delivery, usually within 1-2 business days.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day hassle-free return policy for most products. Items must be in their original condition and packaging. Please refer to our full Returns & Exchanges policy for more details.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to many international destinations. Shipping costs and delivery times vary by country. You can check if we ship to your location and estimate costs during checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number on our website's 'Track Order' page or directly on the courier's website.",
  },
  {
    question: "Do products come with a warranty?",
    answer:
      "All new products come with a manufacturer's warranty, typically for one year. Extended warranty options are also available for purchase on select items.",
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
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const FaqContent = () => {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <motion.h2
        className="font-poppins text-xl md:text-3xl font-bold text-center mb-8 text-foreground"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        Common Questions
      </motion.h2>

      <motion.div
        className="w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <AccordionItem value={`item-${index + 1}`} className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4 text-left">
                  <span className="mr-2 text-primary">{index + 1}.</span> {item.question}
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

export default FaqContent;