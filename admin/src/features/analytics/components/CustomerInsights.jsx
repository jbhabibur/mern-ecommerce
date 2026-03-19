import React, { useState } from "react";
import { Users, UserPlus, UserCheck, TrendingUp, Loader2 } from "lucide-react";
import { useCustomerAnalytics } from "../hooks/useCustomerAnalytics";
import { StatCard } from "./StatCard";
import { GrowthChart } from "./GrowthChart";
import { RetentionChart } from "./RetentionChart";
import { CustomerTable } from "./CustomerTable";
import { CustomerDetailsModal } from "./CustomerDetailsModal";

export const CustomerInsights = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Destructure everything from your custom hook
  const {
    stats,
    growthData,
    retentionData,
    customers,
    pagination,
    isLoading,
    isFetchingMore,
    loadMore,
  } = useCustomerAnalytics();

  // Initial loading state
  if (isLoading && customers.length === 0) {
    return (
      <div className="p-20 text-center animate-pulse text-theme-muted font-black tracking-widest uppercase text-xs">
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-poppins">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers}
          change="+4.3%"
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="New Acquisitions"
          value={stats?.newAcquisitions}
          change="+12.1%"
          icon={<UserPlus size={20} />}
          color="emerald"
        />
        <StatCard
          title="Returning Rate"
          value={`${stats?.returningRate}%`}
          change="-2.4%"
          icon={<UserCheck size={20} />}
          color="purple"
        />
        <StatCard
          title="Conversion"
          value={`${stats?.conversionRate}%`}
          change="+0.8%"
          icon={<TrendingUp size={20} />}
          color="amber"
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GrowthChart data={growthData} />
        <RetentionChart data={retentionData} rate={stats?.returningRate} />
      </div>

      {/* 3. Combined Customer Table */}
      <div className="space-y-6">
        <CustomerTable
          customers={customers}
          onDetailClick={(c) => {
            setSelectedCustomer(c);
            setIsModalOpen(true);
          }}
        />

        {/* Load More Trigger */}
        {pagination?.hasMore && (
          <div className="flex justify-center pt-4">
            <button
              onClick={loadMore}
              disabled={isFetchingMore}
              className="group flex items-center gap-3 px-10 py-4 bg-theme-base border border-theme-line rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-theme-front hover:bg-theme-act hover:text-white hover:border-theme-act transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isFetchingMore ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Customers"
              )}
            </button>
          </div>
        )}
      </div>

      {/* 4. Details Modal */}
      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};
