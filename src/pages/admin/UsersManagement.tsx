"use client";

import React, { useState, useMemo, useCallback } from "react";
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
  User as UserIcon, // Renamed to avoid conflict with Users icon
} from "lucide-react";
import { mockAdminUsers, AdminUser } from "@/data/adminData.ts";
import { mockOrders } from "@/data/accountData.ts"; // Corrected import path for mockOrders
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  id: z.string().optional(), // For editing
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required").max(15, "Phone number is too long"),
  role: z.enum(["customer", "admin"]).default("customer"),
  status: z.enum(["active", "inactive"]).default("active"),
  password: z.string().optional(), // Optional for edit, but required for add (handled in onSubmit)
});

type UserFormData = z.infer<typeof userFormSchema>;

const UsersManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
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

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddUserClick = () => {
    reset(); // Clear form fields
    setIsAddModalOpen(true);
  };

  const handleEditUserClick = (user: AdminUser) => {
    setEditingUser(user);
    reset({
      id: user.id,
      name: user.name,
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

  const handleViewDetailsClick = (user: AdminUser) => {
    setViewingUser(user);
    setIsViewDetailsModalOpen(true);
  };

  const handleAddOrUpdateUser = async (data: UserFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUserData: AdminUser = {
      id: data.id || `user-${Date.now()}`, // Generate new ID if adding
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      lastLogin: editingUser?.lastLogin || new Date().toISOString().split('T')[0], // Preserve or set current date
      totalOrders: editingUser?.totalOrders || 0, // Preserve or default to 0
    };

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === newUserData.id ? newUserData : u))
      );
      toast.success(`User "${newUserData.name}" updated successfully!`);
      setIsEditModalOpen(false);
      setEditingUser(null);
    } else {
      // For adding, ensure password is provided (client-side check)
      if (!data.password) {
        toast.error("Password is required for new users.");
        return;
      }
      setUsers((prev) => [...prev, newUserData]);
      toast.success(`User "${newUserData.name}" added successfully!`);
      setIsAddModalOpen(false);
    }
  };

  const confirmDeleteUser = useCallback(async () => {
    if (deletingUserId) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUsers((prev) => prev.filter((u) => u.id !== deletingUserId));
      toast.info(`User ${deletingUserId} deleted.`);
      setDeletingUserId(null);
      setIsDeleteAlertOpen(false);
    }
  }, [deletingUserId]);

  const getStatusBadgeVariant = (status: AdminUser["status"]) => {
    return status === "active" ? "default" : "destructive";
  };

  const getRoleBadgeVariant = (role: AdminUser["role"]) => {
    // Changed "primary" to "default" as "primary" is not a valid Shadcn Badge variant
    return role === "admin" ? "default" : "secondary";
  };

  const getUserRecentOrders = (userId: string) => {
    // This is dummy logic. In a real app, you'd filter mockOrders by userId.
    // For now, it filters by name, which is not robust but works for mock data.
    return mockOrders.filter(order => order.shippingAddress.name === viewingUser?.name).slice(0, 3);
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-3xl font-bold text-foreground" variants={fadeInUp}>
          Users Management
        </motion.h1>
        <motion.p className="text-lg text-muted-foreground" variants={fadeInUp}>
          Manage all registered user accounts and their roles.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 min-w-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 border-b">
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

          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No users found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); setFilterRole("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full"> {/* Added w-full to ensure the container takes full width */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">User ID</TableHead>
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
                        <TableCell className="font-medium text-xs">{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.totalOrders}</TableCell>
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
                                  <TooltipContent>Delete User</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user "{user.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDeleteUser}>
                                    Continue
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

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="flex items-center justify-end space-x-2 py-4 pr-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
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
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateUser)} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
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
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateUser)} className="space-y-6 py-4">
            <input type="hidden" {...register("id")} />
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
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
                <Label htmlFor="password">New Password (Optional)</Label>
                <Input id="password" type="password" {...register("password")} className={cn(errors.password && "border-destructive")} />
                {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                <p className="text-xs text-muted-foreground">Leave blank to keep current password.</p>
              </div>
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
              <UserIcon className="h-6 w-6 text-primary" /> User Details: {viewingUser?.name}
            </DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium text-foreground">{viewingUser.id}</p>
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
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium text-foreground">{viewingUser.lastLogin}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" /> Recent Orders ({viewingUser.totalOrders})
                </h3>
                {getUserRecentOrders(viewingUser.id).length > 0 ? (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {getUserRecentOrders(viewingUser.id).map((order) => (
                      <li key={order.id} className="flex justify-between items-center">
                        <span>Order {order.id}</span>
                        <Badge variant="secondary">{order.status}</Badge>
                      </li>
                    ))}
                  </ul>
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

export default UsersManagement;