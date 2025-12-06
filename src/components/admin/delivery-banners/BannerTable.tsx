"use client";

import React from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BellRing,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ChevronFirst,
  ChevronLast,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DeliveryBannerMessage } from "@/hooks/useAdminBanners";

interface BannerTableProps {
  banners: DeliveryBannerMessage[];
  isLoadingBanners: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  onAddBanner: () => void;
  onEditBanner: (banner: DeliveryBannerMessage) => void;
  onDeleteBanner: (bannerId: string, bannerContent: string) => void;
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  totalFilteredBannersCount: number;
  bannersPerPage: number;
  indexOfFirstBanner: number; // Added
  indexOfLastBanner: number;   // Added
}

const getStatusBadgeVariant = (isActive: boolean) => {
  return isActive ? "default" : "destructive";
};

const getMessageTypeBadgeVariant = (type: string) => {
  switch (type.toLowerCase()) {
    case "delivery": return "secondary";
    case "promo": return "default";
    case "discount": return "secondary";
    case "alert": return "destructive";
    default: return "outline";
  }
};

const BannerTable = ({
  banners,
  isLoadingBanners,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterType,
  onFilterTypeChange,
  onAddBanner,
  onEditBanner,
  onDeleteBanner,
  currentPage,
  totalPages,
  goToFirstPage,
  goToPrevPage,
  goToNextPage,
  goToLastPage,
  totalFilteredBannersCount,
  bannersPerPage,
  indexOfFirstBanner, // Destructured
  indexOfLastBanner,   // Destructured
}: BannerTableProps) => {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" /> All Banner Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by content or type..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={filterType} onValueChange={onFilterTypeChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="promo">Promotion</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={onFilterStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onAddBanner} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add New Banner
            </Button>
          </div>
        </div>

        {isLoadingBanners ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading banners...</p>
          </div>
        ) : totalFilteredBannersCount === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-4" />
            <p>No banner messages found matching your filters.</p>
            <Button onClick={() => { onSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>); onFilterStatusChange("all"); onFilterTypeChange("all"); }} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {banners.map((banner) => (
                    <motion.tr
                      key={banner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>
                        <Badge variant={getMessageTypeBadgeVariant(banner.message_type)}>
                          {banner.message_type.charAt(0).toUpperCase() + banner.message_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{banner.content}</TableCell>
                      <TableCell>
                        {banner.is_active ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>{banner.priority}</TableCell>
                      <TableCell className="text-xs">
                        {banner.start_date && new Date(banner.start_date).toLocaleDateString()}
                        {banner.start_date && banner.end_date && " - "}
                        {banner.end_date && new Date(banner.end_date).toLocaleDateString()}
                        {!banner.start_date && !banner.end_date && "Always"}
                      </TableCell>
                      <TableCell>
                        {banner.link_url ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                  <LinkIcon className="h-4 w-4" /> {banner.link_text || "View Link"}
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>{banner.link_url}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => onEditBanner(banner)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Banner</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => onDeleteBanner(banner.id, banner.content)}>
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Delete Banner</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
        {totalFilteredBannersCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {indexOfFirstBanner + 1} to {Math.min(indexOfLastBanner, totalFilteredBannersCount)} of {totalFilteredBannersCount} banners
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
  );
};

export default BannerTable;