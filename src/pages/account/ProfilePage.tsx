"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext.tsx";
import { supabase } from "@/integrations/supabase/client";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const ProfilePage = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "", // Changed from fullName
    lastName: "",  // New field
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    // Fetch profile data using the correct column names
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, phone') // Select 'first_name' and 'last_name'
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.", { description: error.message });
      // Fallback to user's auth email if profile fetch fails
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    } else if (data) {
      setFormData((prev) => ({
        ...prev,
        firstName: data.first_name || "", // Use 'first_name'
        lastName: data.last_name || "",   // Use 'last_name'
        email: data.email || user.email || "",
        phone: data.phone || "",
      }));
    }
    setIsLoadingProfile(false);
  }, [user]);

  useEffect(() => {
    if (!isLoadingAuth && user) {
      fetchUserProfile();
    } else if (!isLoadingAuth && !user) {
      setIsLoadingProfile(false);
    }
  }, [user, isLoadingAuth, fetchUserProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    setIsSaving(true);
    toast.loading("Saving profile...", { id: "profile-save" });

    // Password change validation
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.dismiss("profile-save");
        toast.error("New passwords do not match.");
        setIsSaving(false);
        return;
      }
      toast.info("Password change functionality is mocked. In a real app, current password verification would be needed.");
    }

    // Update profile data in Supabase using the correct column names
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: formData.firstName, // Update 'first_name'
        last_name: formData.lastName,   // Update 'last_name'
        phone: formData.phone,
      })
      .eq('id', user.id);

    if (profileError) {
      toast.dismiss("profile-save");
      toast.error("Failed to update profile.", { description: profileError.message });
    } else {
      toast.dismiss("profile-save");
      toast.success("Profile updated successfully!", {
        description: "Your information has been saved.",
      });
      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      fetchUserProfile(); // Re-fetch to ensure latest data is displayed
    }
    setIsSaving(false);
  };

  if (isLoadingAuth || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your personal details and password.</p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed directly here. It's linked to your authentication.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <h3 className="font-semibold text-lg pt-4 border-t border-border mt-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Password Management
            </h3>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={formData.confirmNewPassword} onChange={handleChange} />
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;