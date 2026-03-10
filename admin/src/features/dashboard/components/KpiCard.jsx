export const KpiCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    teal: "text-teal-500 bg-teal-500/10 border-teal-500/20",
  };
  return (
    <div className="bg-theme-sub border border-theme-line rounded-3xl p-6 hover:translate-y-[-2px] transition-transform">
      <div className={`p-2 w-fit rounded-xl border ${colors[color]}`}>
        {icon}
      </div>
      <h2 className="text-2xl font-black mt-4 text-theme-front tracking-tight">
        {value}
      </h2>
      <p className="text-xs text-theme-muted font-bold uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};
