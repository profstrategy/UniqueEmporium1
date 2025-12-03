"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility

interface ContactInfo {
  icon: React.ElementType;
  title: string;
  details: string[];
}

const contactInfos: ContactInfo[] = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@uniqueemporium.com", "We typically respond within 24 hours."],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 (906) 554-5572", "Mon-Fri, 9 AM - 5 PM WAT"],
  },
  {
    icon: MapPin,
    title: "Our Showroom",
    details: ["No 4 crescent Street opposite Ace supermarket unity", "Ilorin, Kwara State, Nigeria"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon-Sat: 9 AM - 5 PM", "Sun: Closed"], // Corrected business hours
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

const ContactInfoCards = () => {
  return (
    <section className="py-12 md:py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {contactInfos.map((info, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="p-4 md:p-6 h-full rounded-2xl text-center">
              <motion.div
                className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 text-primary"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut" as Easing,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}
              >
                {React.createElement(info.icon, { className: "h-full w-full" })}
              </motion.div>
              <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-3 text-foreground">{info.title}</h3>
              <div className="space-y-1 text-[0.65rem] md:text-sm text-muted-foreground">
                {info.details.map((detail, i) => (
                  <p 
                    key={i} 
                    className={cn(
                      info.title === "Email Us" && i === 0 && "break-all" // Apply break-all specifically to the email address
                    )}
                  >
                    {detail}
                  </p>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ContactInfoCards;