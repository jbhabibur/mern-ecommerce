import React from "react";
import { Plus } from "lucide-react";
import { usePromoManager } from "./hooks/usePromoManager";
import { PromoTable } from "./components/PromoTable";
import { PromoModal } from "./components/PromoModal";
import { useTheme } from "../../contexts/ThemeContext";

export const PromoManager = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    slots,
    categories,
    isModalOpen,
    setIsModalOpen,
    editingSlot,
    loading,
    form,
    setForm,
    handleImage,
    closeModal,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleActive,
  } = usePromoManager();

  return (
    <div
      className={`
      min-h-screen p-4 md:p-8 font-poppins transition-colors duration-300
      ${isDark ? "bg-[#0F0F0F] text-white" : "bg-white text-slate-900"}
    `}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 lg:mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-theme-front tracking-tight uppercase">
              Promotional Banners
            </h1>
            <p className="text-[10px] text-theme-muted uppercase font-bold tracking-[0.2em] mt-1 opacity-70">
              Real-time management & store insights
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="
              flex items-center justify-center gap-2 px-5 py-3 md:px-8 md:py-4 rounded-2xl font-bold shadow-xl transition-all text-sm md:text-base w-full md:w-auto active:scale-95
              bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20
            "
          >
            <Plus size={20} />
            <span>Create Promo</span>
          </button>
        </div>

        <div
          className={`
          rounded-[2rem] border transition-all duration-300 overflow-hidden
          ${
            isDark
              ? "bg-[#1A1A1A] border-white/5 shadow-2xl"
              : "bg-white border-slate-200 shadow-sm"
          }
        `}
        >
          <PromoTable
            slots={slots}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActive={handleActive}
          />
        </div>
      </div>

      {/* Form Modal Component */}
      {isModalOpen && (
        <PromoModal
          editingSlot={editingSlot}
          form={form}
          setForm={setForm}
          categories={categories}
          loading={loading}
          onClose={closeModal}
          onImageChange={handleImage}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
