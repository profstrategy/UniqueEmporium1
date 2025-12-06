"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BellRing, Loader2 } from "lucide-react";
import { useBanners, DeliveryBannerMessage, BannerFormData } from "./delivery-banner-management/hooks/useBanners";
import { BannerFilters } from "./delivery-banner-management/components/BannerFilters";
import { BannerTable } from "./delivery-banner-management/components/BannerTable";
import { BannerFormDialog } from "./delivery-banner-management/components/BannerFormDialog";

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

const DeliveryBannerManagement = () => {
  const { banners, isLoadingBanners, addBanner, updateBanner, deleteBanner } = useBanners();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const bannersPerPage = 10;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<DeliveryBannerMessage | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const filteredBanners = useMemo(() => {
    let filtered = banners;

    if (searchTerm) {
      filtered = filtered.filter(
        (banner) =>
          banner.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          banner.message_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          banner.link_text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (banner) => banner.is_active === (filterStatus === "active")
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(
        (banner) => banner.message_type === filterType
      );
    }

    return filtered;
  }, [banners, searchTerm, filterStatus, filterType]);

  // Pagination logic
  const indexOfLastBanner = currentPage * bannersPerPage;
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirstBanner, indexOfLastBanner);
  const totalPages = Math.ceil(filteredBanners.length / bannersPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleAddBannerClick = () => {
    setEditingBanner(null);
    setIsFormModalOpen(true);
  };

  const handleEditBannerClick = (banner: DeliveryBannerMessage) => {
    setEditingBanner(banner);
    setIsFormModalOpen(true);
  };

  const handleDeleteBannerClick = (bannerId: string) => {
    setDeletingBannerId(bannerId);
    setIsDeleteAlertOpen(true);
  };

  const handleFormSubmit = useCallback(async (data: BannerFormData) => {
    setIsSubmittingForm(true);
    let success = false;
    if (editingBanner) {
      success = await updateBanner(editingBanner.id, data);
    } else {
      success = await addBanner(data);
    }
    setIsSubmittingForm(false);
    if (success) {
      setIsFormModalOpen(false);
    }
  }, [editingBanner, addBanner, updateBanner]);

  const confirmDeleteBanner = useCallback(async () => {
    if (deletingBannerId) {
      await deleteBanner(deletingBannerId);
      setDeletingBannerId(null);
      setIsDeleteAlertOpen(false);
    }
  }, [deletingBannerId, deleteBanner]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterType("all");
    setCurrentPage(1);
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Delivery Banner Management
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Manage the scrolling banner messages displayed to visitors.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" /> All Banner Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BannerFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterType={filterType}
            setFilterType={setFilterType}
            onAddBannerClick={handleAddBannerClick}
            onClearFilters={handleClearFilters}
            hasBanners={banners.length > 0}
          />

          {isLoadingBanners ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading banners...</p>
            </div>
          ) : filteredBanners.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No banner messages found matching your filters.</p>
            </div>
          ) : (
            <BannerTable
              banners={currentBanners}
              isLoading={isLoadingBanners}
              onEdit={handleEditBannerClick}
              onDelete={handleDeleteBannerClick}
              onConfirmDelete={confirmDeleteBanner}
              deletingBannerId={deletingBannerId}
              currentPage={currentPage}
              totalPages={totalPages}
              goToFirstPage={goToFirstPage}
              goToLastPage={goToLastPage}
              goToPrevPage={goToPrevPage}
              goToNextPage={goToNextPage}
              totalFilteredBanners={filteredBanners.length}
              bannersPerPage={bannersPerPage}
              indexOfFirstBanner={indexOfFirstBanner} // Pass the prop
              indexOfLastBanner={indexOfLastBanner}   // Pass the prop
            />
          )}
        </CardContent>
      </Card>

      <BannerFormDialog
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        editingBanner={editingBanner}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmittingForm}
      />
    </motion.div>
  );
};

export default DeliveryBannerManagement;