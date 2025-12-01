"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  ShoppingBag,
  User as UserIcon,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { mockOrders } from "@/data/accountData.ts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

// Define the AdminUser interface based on your database structure
export interface AdminUser {
  id: string; // Supabase UUID
  custom_user_id: string; // NEW: Custom ID for display
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
  // last_login_at: string; // Removed for client-side security
  total_orders: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

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

// Form Schema for Add/Edit User
const userFormSchema = z.object({
  id: z.string().optional(), // For editing (Supabase UUID)
  custom_user_id: z.string().optional(), // NEW: For display, not directly editable via form
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required").max(15, "Phone number is too long"),
  role: z.enum(["customer", "admin"]).default("customer"),
  status: z.enum(["active", "inactive"]).default("active"),
  password: z.string().optional(), // Optional for edit, but required for add (handled in onSubmit)
});

type UserFormData = z.infer<typeof userFormSchema>;

const UsersManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: "customer",
      status: "active",
    }
  });

  const currentStatus = watch("status");
  const currentRole = watch("role");

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        custom_user_id, -- NEW: Select custom_user_id
        first_name,
        last_name,
        email,
        phone,
        role,
        status
      `)
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      toast.error("Failed to load users.", { description: profilesError.message });
      setUsers([]);
      setIsLoadingUsers(false);
      return;
    }

    const usersWithOrders: AdminUser[] = await Promise.all(
      profiles.map(async (profile: any) => {
        const { count: totalOrders, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        if (ordersError) {
          console.error(`Error fetching orders for user ${profile.id}:`, ordersError);
        }

        return {
          id: profile.id,
          custom_user_id: profile.custom_user_id || 'N/A', // NEW: Assign custom_user_id
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          status: profile.status,
          total_orders: totalOrders || 0,
        };
      })
    );
    setUsers(usersWithOrders);
    setIsLoadingUsers(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.custom_user_id.toLowerCase().includes(searchTerm.toLowerCase()) // NEW: Search by custom_user_id
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (user) => user.status === filterStatus
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter(
        (user) => user.role === filterRole
      );
    }

    return filtered;
  }, [users, searchTerm, filterStatus, filterRole]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // New pagination functions
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleAddUserClick = () => {
    reset(); // Clear form fields
    setIsAddModalOpen(true);
  };

  const handleEditUserClick = (user: AdminUser) => {
    setEditingUser(user);
    reset({
      id: user.id,
      custom_user_id: user.custom_user_id, // NEW: Set custom_user_id for display
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      password: "", // Never pre-fill passwords
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUserClick = (userId: string) => {
    setDeletingUserId(userId);
    setIsDeleteAlertOpen(true);
  };

  const handleViewDetailsClick = async (user: AdminUser) => {
    setViewingUser(user);
    setIsViewDetailsModalOpen(true);
  };

  const handleAddOrUpdateUser = async (data: UserFormData) => {
    if (editingUser) {
      // Update existing user profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          role: data.role,
          status: data.status,
        })
        .eq('id', editingUser.id);

      if (error) {
        toast.error("Failed to update user.", { description: error.message });
      } else {
        toast.success(`User "${data.first_name} ${data.last_name}" updated successfully!`);
        setIsEditModalOpen(false);
        setEditingUser(null);
        fetchUsers(); // Re-fetch users to update the list
      }
    } else {
      // Add new user (sign up)
      if (!data.password) {
        toast.error("Password is required for new users.");
        return;
      }
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      });

      if (authError) {
        toast.error("Failed to add user.", { description: authError.message });
        return;
      }

      if (authData.user) {
        // After auth.signUp, the handle_new_user trigger creates the basic profile.
        // Now update the role and phone in the profiles table.
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            phone: data.phone,
            role: data.role,
            status: data.status,
          })
          .eq('id', authData.user.id);

        if (profileUpdateError) {
          console.error("Error updating new user's profile after signup:", profileUpdateError);
          toast.error("User added, but failed to set profile details.", { description: profileUpdateError.message });
        } else {
          toast.success(`User "${data.first_name} ${data.last_name}" added successfully!`);
          setIsAddModalOpen(false);
          fetchUsers(); // Re-fetch users to update the list
        }
      }
    }
  };

  const confirmDeleteUser = useCallback(async () => {
    if (deletingUserId) {
      // Soft delete: set user status to 'inactive'
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', deletingUserId);

      if (error) {
        toast.error("Failed to deactivate user.", { description: error.message });
      } else {
        toast.info(`User ${deletingUserId} deactivated.`);
        setDeletingUserId(null);
        setIsDeleteAlertOpen(false);
        fetchUsers(); // Re-fetch users to update the list
      }
    }
  }, [deletingUserId, fetchUsers]);

  const getStatusBadgeVariant = (status: AdminUser["status"]) => {
    return status === "active" ? "default" : "destructive";
  };

  const getRoleBadgeVariant = (role: AdminUser["role"]) => {
    return role === "admin" ? "default" : "secondary";
  };

  const getUserRecentOrders = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('id, status')
      .eq('user_id', userId)
      .order('order_date', { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching recent orders for user:", error);
      return [];
    }
    return data;
  }, []);

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Users Management
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Manage all registered user accounts and their roles.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 p-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Name, Email, or Phone..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddUserClick} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </div>
          </div>

          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No users found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); setFilterRole("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">User ID</TableHead> {/* NEW: Display custom_user_id */}
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell className="font-medium text-xs">{user.custom_user_id}</TableCell> {/* NEW: Display custom_user_id */}
                        <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.total_orders}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => handleViewDetailsClick(user)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => handleEditUserClick(user)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit User</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <AlertDialog>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="icon" onClick={() => handleDeleteUserClick(user.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>Deactivate User</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will deactivate the user "{user.first_name} {user.last_name}". They will no longer be able to log in.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDeleteUser}>
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredUsers.length > usersPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex"
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" /> Add New User
            </DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateUser)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...register("first_name")} className={cn(errors.first_name && "border-destructive")} />
                {errors.first_name && <p className="text-destructive text-sm">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register("last_name")} className={cn(errors.last_name && "border-destructive")} />
                {errors.last_name && <p className="text-destructive text-sm">{errors.last_name.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className={cn(errors.email && "border-destructive")} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register("phone")} className={cn(errors.phone && "border-destructive")} />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setValue("role", value as "customer" | "admin")} value={currentRole}>
                  <SelectTrigger className={cn(errors.role && "border-destructive")}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} className={cn(errors.password && "border-destructive")} />
                {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="status-toggle"
                checked={currentStatus === "active"}
                onCheckedChange={(checked) => setValue("status", checked ? "active" : "inactive")}
              />
              <Label htmlFor="status-toggle">Account Status: {currentStatus === "active" ? "Active" : "Inactive"}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Add User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" /> Edit User
            </DialogTitle>
            <DialogDescription>
              Update the details for this user account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateUser)} className="space-y-6 py-4">
            <input type="hidden" {...register("id")} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...register("first_name")} className={cn(errors.first_name && "border-destructive")} />
                {errors.first_name && <p className="text-destructive text-sm">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register("last_name")} className={cn(errors.last_name && "border-destructive")} />
                {errors.last_name && <p className="text-destructive text-sm">{errors.last_name.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className={cn(errors.email && "border-destructive")} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register("phone")} className={cn(errors.phone && "border-destructive")} />
              {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setValue("role", value as "customer" | "admin")} value={currentRole}>
                <SelectTrigger className={cn(errors.role && "border-destructive")}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="status-toggle-edit"
                  checked={currentStatus === "active"}
                  onCheckedChange={(checked) => setValue("status", checked ? "active" : "inactive")}
                />
                <Label htmlFor="status-toggle-edit">Account Status: {currentStatus === "active" ? "Active" : "Inactive"}</Label>
              </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={isViewDetailsModalOpen} onOpenChange={setIsViewDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-primary" /> User Details: {viewingUser?.first_name} {viewingUser?.last_name}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this user's account and activity.
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Custom User ID</p> {/* NEW: Display custom_user_id */}
                  <p className="font-medium text-foreground">{viewingUser.custom_user_id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Supabase UUID</p> {/* Keep UUID for reference */}
                  <p className="font-medium text-foreground text-xs">{viewingUser.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{viewingUser.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{viewingUser.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant={getRoleBadgeVariant(viewingUser.role)}>
                    {viewingUser.role.charAt(0).toUpperCase() + viewingUser.role.slice(1)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <Badge variant={getStatusBadgeVariant(viewingUser.status)}>
                    {viewingUser.status.charAt(0).toUpperCase() + viewingUser.status.slice(1)}
                  </Badge>
                </div>
                {/* Removed Last Login for client-side display */}
                {/* <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium text-foreground">
                    {viewingUser.last_login_at !== 'N/A' ? new Date(viewingUser.last_login_at).toLocaleString() : 'N/A'}
                  </p>
                </div> */}
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" /> Recent Orders ({viewingUser.total_orders})
                </h3>
                {viewingUser.total_orders > 0 ? (
                  <React.Suspense fallback={<p className="text-sm text-muted-foreground">Loading recent orders...</p>}>
                    <RecentOrdersList userId={viewingUser.id} />
                  </React.Suspense>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent orders found.</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Helper component to fetch and display recent orders for a user
const RecentOrdersList = ({ userId }: { userId: string }) => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setIsLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, order_date')
        .eq('user_id', userId)
        .order('order_date', { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching recent orders:", error);
        setRecentOrders([]);
      } else {
        setRecentOrders(data);
      }
      setIsLoadingOrders(false);
    };
    fetchRecentOrders();
  }, [userId]);

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending": return "bg-[#3B82F6] text-white";
      case "processing": return "bg-[#F59E0B] text-white";
      case "completed": return "bg-[#16A34A] text-white";
      case "cancelled": return "bg-[#DC2626] text-white";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  if (isLoadingOrders) {
    return <p className="text-sm text-muted-foreground">Loading recent orders...</p>;
  }

  if (recentOrders.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent orders found.</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {recentOrders.map((order) => (
        <li key={order.id} className="flex justify-between items-center">
          <span>Order {order.id} ({new Date(order.order_date).toLocaleDateString()})</span>
          <Badge className={getOrderStatusBadgeClass(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </li>
      ))}
    </ul>
  );
};

export default UsersManagement;