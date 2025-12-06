"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { BellRing } from "lucide-react";
import {
  useAdminBanners,
  DeliveryBannerMessage,
  BannerFormData,
} from "@/hooks/useAdminBanners";
import BannerTable from "@/components/admin/delivery-banners/BannerTable";
import BannerFormDialog from "@/components/admin/delivery-banners/BannerFormDialog";
import DeleteBannerAlertDialog from "@/components/admin/delivery-banners/DeleteBannerAlertDialog";

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
  const {
    banners,
    isLoadingBanners,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    currentPage,
    setCurrentPage,
    totalPages,
    totalFilteredBannersCount,
    bannersPerPage,
    addBanner,
    updateBanner,
    deleteBanner,
  } = useAdminBanners();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<DeliveryBannerMessage | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);
  const [deletingBannerContent, setDeletingBannerContent] = useState<string>("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const handleAddBannerClick = () => {
    setEditingBanner(null);
    setIsAddModalOpen(true);
  };

  const handleEditBannerClick = (banner: DeliveryBannerMessage) => {
    setEditingBanner(banner);
    setIsEditModalOpen(true);
  };

  const handleDeleteBannerClick = (bannerId: string, bannerContent: string) => {
    setDeletingBannerId(bannerId);
    setDeletingBannerContent(bannerContent);
    setIsDeleteAlertOpen(true);
  };

  const handleAddOrUpdateBanner = async (data: BannerFormData) => {
    setIsSubmittingForm(true);
    let success = false;
    if (editingBanner) {
      success = await updateBanner(editingBanner.id, data);
    } else {
      success = await addBanner(data);
    }
    setIsSubmittingForm(false);
    if (success) {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    }
  };

  const confirmDeleteBanner = async () => {
    if (deletingBannerId) {
      await deleteBanner(deletingBannerId);
      setIsDeleteAlertOpen(false);
      setDeletingBannerId(null);
      setDeletingBannerContent("");
    }
  };

  // Calculate pagination indices for passing to BannerTable
  const indexOfLastBanner = currentPage * bannersPerPage;
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;

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

      <BannerTable
        banners={banners}
        isLoadingBanners={isLoadingBanners}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        onAddBanner={handleAddBannerClick}
        onEditBanner={handleEditBannerClick}
        onDeleteBanner={handleDeleteBannerClick}
        currentPage={currentPage}
        totalPages={totalPages}
        goToFirstPage={() => setCurrentPage(1)}
        goToPrevPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        goToNextPage={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        goToLastPage={() => setCurrentPage(totalPages)}
        totalFilteredBannersCount={totalFilteredBannersCount}
        bannersPerPage={bannersPerPage}
        indexOfFirstBanner={indexOfFirstBanner} {/* Passed as prop */}
        indexOfLastBanner={indexOfLastBanner}   {/* Passed as prop */}
      />

      <BannerFormDialog
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddOrUpdateBanner}
        isSubmitting={isSubmittingForm}
      />

      <BannerFormDialog
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={editingBanner}
        onSubmit={handleAddOrUpdateBanner}
        isSubmitting={isSubmittingForm}
      />

      <DeleteBannerAlertDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={confirmDeleteBanner}
        bannerContent={deletingBannerContent}
      />
    </motion.div>
  );
};

export default DeliveryBannerManagement;