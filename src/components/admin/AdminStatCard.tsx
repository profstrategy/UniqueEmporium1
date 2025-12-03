"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconColorClass?: string;
  delay?: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const AdminStatCard = ({ title, value, description, icon: Icon, iconColorClass = "text-primary", delay = 0 }: AdminStatCardProps) => {
  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay, duration: 0.5 }}>
      <Card className="rounded-xl shadow-lg border border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className={cn("h-4 w-4", iconColorClass)} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminStatCard;