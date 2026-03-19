import { Package, ShieldCheck } from "lucide-react";

export const AdminLogo = () => {
  return (
    <div className="flex items-center gap-3 group cursor-default">
      {/* Icon Wrapper */}
      <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
        <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
      </div>

      {/* Text Content */}
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
          MENS <span className="text-blue-600">FASHION</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Admin Control
        </span>
      </div>
    </div>
  );
};
