"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Lock, Loader2, KeyRound } from "lucide-react"; // Added KeyRound icon
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
    customUserId: "", // NEW: Add customUserId to form data
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    newEmail: "", // New field for email change
    confirmNewEmail: "", // New field for email change confirmation
    currentPassword: "", // For password change (not directly used for Supabase password update)
    newPassword: "",
    confirmNewPassword: "",
  });

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, phone, custom_user_id') // NEW: Select custom_user_id
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.", { description: error.message });
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        customUserId: user.custom_user_id || "", // NEW: Set customUserId from auth context
      }));
    } else if (data) {
      setFormData((prev) => ({
        ...prev,
        customUserId: data.custom_user_id || "", // NEW: Set customUserId from fetched data
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        newEmail: "", // Clear new email fields on load
        confirmNewEmail: "",
        currentPassword: "", // Clear password fields on load
        newPassword: "",
        confirmNewPassword: "",
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

    // Update profile data in Supabase using the correct column names
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
      })
      .eq('id', user.id);

    if (profileError) {
      toast.dismiss("profile-save");
      toast.error("Failed to update profile.", { description: profileError.message });
    } else {
      toast.dismiss("profile-save");
      toast.success("Profile updated successfully!", {
        description: "Your personal information has been saved.",
      });
      fetchUserProfile(); // Re-fetch to ensure latest data is displayed
    }
    setIsSaving(false);
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to change your email.");
      return;
    }

    if (!formData.newEmail || !formData.confirmNewEmail) {
      toast.error("Please enter and confirm your new email address.");
      return;
    }
    if (formData.newEmail !== formData.confirmNewEmail) {
      toast.error("New email addresses do not match.");
      return;
    }
    if (formData.newEmail === formData.email) {
      toast.info("New email is the same as current email.");
      return;
    }

    setIsSaving(true);
    toast.loading("Updating email...", { id: "email-update" });

    const { error } = await supabase.auth.updateUser({ email: formData.newEmail });

    if (error) {
      toast.dismiss("email-update");
      toast.error("Failed to update email.", { description: error.message });
    } else {
      toast.dismiss("email-update");
      toast.success("Email update initiated!", {
        description: "Please check your NEW email to confirm the change.",
      });
      // Clear new email fields and update current email optimistically
      setFormData((prev) => ({
        ...prev,
        email: formData.newEmail, // Optimistically update
        newEmail: "",
        confirmNewEmail: "",
      }));
      fetchUserProfile(); // Re-fetch to ensure latest data is displayed
    }
    setIsSaving(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to reset your password.");
      return;
    }

    if (!formData.newPassword || !formData.confirmNewPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    toast.loading("Sending password reset link...", { id: "password-reset" });

    // Supabase's `updateUser` with `password` field is for *authenticated* users changing their own password.
    // If the user forgot their password, they would use the "Forgot password?" flow on the login page.
    // For simplicity in this profile page, we'll simulate a password change for an authenticated user.
    // In a real app, you might require the `currentPassword` for security.
    const { error } = await supabase.auth.updateUser({ password: formData.newPassword });

    if (error) {
      toast.dismiss("password-reset");
      toast.error("Failed to update password.", { description: error.message });
    } else {
      toast.dismiss("password-reset");
      toast.success("Password updated successfully!", {
        description: "Your password has been changed.",
      });
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
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
        <p className="text-muted-foreground text-lg">Manage your personal details, email, and password.</p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customUserId">Unique User ID</Label> {/* NEW: Display custom_user_id */}
              <Input id="customUserId" name="customUserId" value={formData.customUserId} disabled />
              <p className="text-xs text-muted-foreground">Your unique identifier in the system.</p>
            </div>
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

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Personal Info"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Email Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeEmail} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Current Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} disabled />
              <p className="text-xs text-muted-foreground">Your current registered email address.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email</Label>
                <Input id="newEmail" name="newEmail" type="email" value={formData.newEmail} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewEmail">Confirm New Email</Label>
                <Input id="confirmNewEmail" name="confirmNewEmail" type="email" value={formData.confirmNewEmail} onChange={handleChange} />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Change Email"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input id="confirmNewPassword" name="confirmNewPassword" type="password" value={formData.confirmNewPassword} onChange={handleChange} />
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;