"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Easing } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext.tsx";
import ProfileSettings from "@/components/account/ProfileSettings.tsx";
import OrderHistory from "@/components/account/OrderHistory.tsx";
import { toast } from "sonner";
import LoadingPage from "@/components/common/LoadingPage.tsx";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const AccountDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Please log in to view your account dashboard.");
      navigate("/auth/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate("/");
    }
  };

  if (loading || !user) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <User className="h-7 w-7 text-primary" /> Welcome, {user.email}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex flex-col sm:flex-row w-full justify-start h-auto p-0 bg-transparent border-b">
                <TabsTrigger
                  value="profile"
                  className="flex-1 sm:flex-none sm:w-auto py-3 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-colors"
                >
                  <Settings className="mr-2 h-4 w-4" /> Profile Settings
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="flex-1 sm:flex-none sm:w-auto py-3 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-colors"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Order History
                </TabsTrigger>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none sm:ml-auto sm:w-auto py-3 px-4 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="profile">
                  <motion.div
                    key="profile-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProfileSettings />
                  </motion.div>
                </TabsContent>
                <TabsContent value="orders">
                  <motion.div
                    key="orders-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OrderHistory />
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccountDashboard;