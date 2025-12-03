"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const ContactFormMap = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    toast.success("Message sent successfully!", {
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  };

  // URL-encoded address for Google Maps search
  const mapAddress = encodeURIComponent("No 4 crescent Street opposite Ace supermarket unity, Ilorin, Kwara State, Nigeria");
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`;

  return (
    <section className="py-12 md:py-20 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Contact Form */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-bold text-foreground">Send Us a Message</CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Fill out the form below, and we'll get back to you shortly.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 (906) 554-5572"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Unique Emporium Inc."
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full rounded-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Placeholder & Showroom Info */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <Card className="h-full rounded-2xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg md:text-2xl font-bold text-foreground">Visit Our Showroom</CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Experience our unique collections firsthand at our state-of-the-art showroom.
              </p>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="relative h-64 md:h-96 rounded-lg bg-muted mb-6 flex items-center justify-center overflow-hidden">
                <img src="/public/placeholder.svg" alt="Map Placeholder" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <MapPin className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-3 md:mb-4" />
                  <p className="text-lg font-semibold">Map Coming Soon!</p>
                  <p className="text-sm">Interactive map integration will be available here.</p>
                </div>
              </div>

              <div className="mb-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Find us at: <span className="font-semibold text-foreground">No 4 crescent Street opposite Ace supermarket unity, Ilorin, Kwara State, Nigeria</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (Appointments recommended for personalized styling sessions)
                </p>
              </div>

              <div className="mt-auto">
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-foreground">Showroom Features:</h3>
                <ul className="space-y-3 text-xs md:text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Live styling consultations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Exclusive bundle previews
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Personalized shopping experience
                  </li>
                </ul>
                <Button className="w-full mt-8 rounded-full" variant="outline">
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactFormMap;