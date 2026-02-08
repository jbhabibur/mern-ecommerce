import React from "react";
import { Plus } from "lucide-react";
import { usePromoManager } from "./hooks/usePromoManager";
import { PromoTable } from "./components/PromoTable";
import { PromoModal } from "./components/PromoModal";

export const PromoManager = () => {
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
    /* Responsive padding: p-4 on mobile, p-8 on desktop */
    <div className="min-h-screen bg-theme-sub p-4 md:p-8 text-theme-front font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Header Section: Column on mobile, Row on tablet/desktop */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 lg:mb-12">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Promotional Banners
            </h1>
            <p className="text-theme-muted text-xs md:text-sm max-w-md">
              Banners will automatically navigate to the selected category on
              the storefront.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-theme-act text-theme-actfg px-5 py-3 md:px-6 md:py-3.5 rounded-2xl font-bold shadow-lg shadow-theme-act/20 hover:opacity-90 active:scale-95 transition-all text-sm md:text-base w-full md:w-auto"
          >
            <Plus size={20} />
            <span>Create Promo</span>
          </button>
        </div>

        {/* List View Component */}
        <div className="bg-theme-base rounded-3xl border border-theme-line overflow-hidden">
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
