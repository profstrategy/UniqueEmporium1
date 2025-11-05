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
      "We accept all major debit/credit cards (Visa, MasterCard), bank transfers, and mobile money options. We aim to provide convenient payment solutions for our Nigerian customers.",
  },
  {
    question: "How long does shipping take within Nigeria?",
    answer:
      "Standard shipping within Nigeria typically takes 3-7 business days, depending on your location. Expedited shipping options may be available for faster delivery in select cities.",
  },
  {
    question: "What is your return policy for fashion items?",
    answer:
      "We offer a 7-day hassle-free return policy for most fashion items, provided they are in their original condition with tags attached. For thrift items, returns are accepted only if the item is significantly not as described. Please refer to our full Returns & Exchanges policy for more details.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we focus on serving our Nigerian customers with nationwide delivery. We are exploring international shipping options for the future.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a confirmation email with a tracking number. You can use this number on our website's 'Track Order' page or directly on the courier's website.",
  },
  {
    question: "Are your thrift items truly high-quality?",
    answer:
      "Yes! We pride ourselves on curating only premium luxury thrift items. Each piece undergoes a rigorous inspection process to ensure it meets our high standards for quality, condition, and style.",
  },
  {
    question: "How do your fashion bundles work?",
    answer:
      "Our fashion bundles are carefully curated collections of complementary items (e.g., a top, a bottom, and an accessory) designed to create a complete, stylish outfit at an unbeatable price. They are perfect for refreshing your wardrobe effortlessly.",
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

const FaqContent = () => {
  return (
    <section className="py-12 md:py-16 px-4 max-w-4xl mx-auto">
      <motion.h2
        className="font-poppins text-2xl md:text-3xl font-bold text-center mb-8 text-foreground"
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
                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4 text-left pl-0">
                  <div className="flex items-start w-full">
                    <span className="mr-2 text-primary flex-shrink-0">{index + 1}.</span>
                    <span className="flex-grow text-left">{item.question}</span>
                  </div>
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