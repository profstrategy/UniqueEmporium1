"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Database, BarChart2, Lock, UserCheck, Cookie, Share2 } from "lucide-react";

interface PrivacyInfo {
  icon: React.ElementType;
  title: string;
  description: string;
}

const policyInfos: PrivacyInfo[] = [
  {
    icon: Database,
    title: "Data Collection",
    description: "We collect necessary data to process orders and enhance your fashion shopping experience.",
  },
  {
    icon: BarChart2,
    title: "Data Usage",
    description: "Your data is used for order fulfillment, customer support, and personalized style recommendations.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    description: "We employ robust security measures to protect your personal information from unauthorized access.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    description: "You have the right to access, modify, or delete your personal data at any time.",
  },
  {
    icon: Cookie,
    title: "Cookie Policy",
    description: "We use cookies to enhance site functionality, analyze traffic, and personalize content and offers.",
  },
  {
    icon: Share2,
    title: "Third-Party Disclosure",
    description: "We do not sell or trade your personal information with outside parties, except for trusted partners necessary for service delivery.",
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

const PrivacyPolicyCards = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {policyInfos.map((info, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="h-full p-4 text-center rounded-2xl">
              <motion.div
                className="h-8 w-8 mx-auto mb-3 text-primary"
                animate={{
                  y: [0, -5, 0],
                  rotateX: [0, 5, 0],
                  rotateZ: [0, 2, 0],
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
              <h3 className="text-base font-semibold mb-2 text-foreground">{info.title}</h3>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PrivacyPolicyCards;