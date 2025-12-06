import React from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { DeliveryBannerMessage } from "../hooks/useBanners";

interface BannerTableProps {
  banners: DeliveryBannerMessage[];
  isLoading: boolean;
  onEdit: (banner: DeliveryBannerMessage) => void;
  onDelete: (bannerId: string) => void;
  onConfirmDelete: () => void;
  deletingBannerId: string | null;
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  totalFilteredBanners: number;
  bannersPerPage: number;
  indexOfFirstBanner: number;
  indexOfLastBanner: number;
}

const getMessageTypeBadgeVariant = (type: string) => {
  switch (type.toLowerCase()) {
    case "delivery": return "secondary";
    case "promo": return "default";
    case "discount": return "secondary";
    case "alert": return "destructive";
    default: return "outline";
  }
};

export const BannerTable: React.FC<BannerTableProps> = ({
  banners,
  isLoading,
  onEdit,
  onDelete,
  onConfirmDelete,
  deletingBannerId,
  currentPage,
  totalPages,
  goToFirstPage,
  goToLastPage,
  goToPrevPage,
  goToNextPage,
  totalFilteredBanners,
  bannersPerPage,
  indexOfFirstBanner,
  indexOfLastBanner,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading banners...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return null; // Rendered by parent if no banners after filtering
  }

  return (
    <>
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
                            <Button variant="outline" size="icon" onClick={() => onEdit(banner)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Banner</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialog>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => onDelete(banner.id)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Delete Banner</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will permanently delete the banner message: "{banner.content}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onConfirmDelete}>
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

      {/* Pagination Controls */}
      {totalFilteredBanners > bannersPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstBanner + 1} to {Math.min(indexOfLastBanner, totalFilteredBanners)} of {totalFilteredBanners} banners
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
    </>
  );
};