import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";

interface BannerFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  onAddBannerClick: () => void;
  onClearFilters: () => void;
  hasBanners: boolean;
}

export const BannerFilters: React.FC<BannerFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  onAddBannerClick,
  onClearFilters,
  hasBanners,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
      <div className="relative flex-grow w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by content or type..."
          className="w-full pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Select value={filterType} onValueChange={setFilterType}>
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
        <Button onClick={onAddBannerClick} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New Banner
        </Button>
      </div>
      {!hasBanners && (searchTerm || filterStatus !== "all" || filterType !== "all") && (
        <div className="text-center py-4 text-muted-foreground w-full">
          <Filter className="h-8 w-8 mx-auto mb-2" />
          <p>No banner messages found matching your filters.</p>
          <Button onClick={onClearFilters} className="mt-2">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};