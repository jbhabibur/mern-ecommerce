export const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2.5 border-b border-theme-line/50 last:border-0">
    <span className="text-theme-muted text-sm font-medium">{label}</span>
    <span className="text-theme-front font-semibold text-sm">
      {value || "N/A"}
    </span>
  </div>
);
