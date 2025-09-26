"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Jane Doe",
    role: "CEO & Founder",
    bio: "Visionary leader passionate about tech innovation and customer experience.",
    image: "/public/placeholder.svg",
  },
  {
    name: "John Smith",
    role: "Chief Technology Officer",
    bio: "Architect of our digital infrastructure, ensuring seamless operations.",
    image: "/public/placeholder.svg",
  },
  {
    name: "Emily White",
    role: "Head of Product Curation",
    bio: "Expert in identifying the next big thing in electronics.",
    image: "/public/placeholder.svg",
  },
  {
    name: "David Green",
    role: "Customer Relations Lead",
    bio: "Dedicated to providing exceptional support and building lasting relationships.",
    image: "/public/placeholder.svg",
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

const AboutTeam = () => {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Badge variant="outline" className="mb-4 text-sm">Meet the Team</Badge>
        <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-6 text-foreground">
          The Minds Behind ElectroPro
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-12">
          Our diverse team of experts is united by a shared passion for technology and a commitment to your satisfaction.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {teamMembers.map((member, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="h-full flex flex-col rounded-2xl">
              <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 text-left flex-grow">
                <h3 className="text-base font-semibold mb-1 text-foreground">{member.name}</h3>
                <p className="text-xs text-primary mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutTeam;