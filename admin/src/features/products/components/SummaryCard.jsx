export const SummaryCard = ({
  icon: Icon,
  title,
  value,
  color,
  cardBg,
  textColor,
  mutedColor,
}) => (
  <div
    className={`p-5 rounded-2xl ${cardBg} border border-theme-line flex items-center gap-4 shadow-sm`}
  >
    <div
      className={`p-3 rounded-xl bg-theme-base border border-theme-line ${color}`}
    >
      <Icon size={24} />
    </div>
    <div>
      <p
        className={`text-[10px] font-black uppercase tracking-widest ${mutedColor}`}
      >
        {title}
      </p>
      <p className={`text-2xl font-black ${textColor}`}>
        {value?.toLocaleString()}
      </p>
    </div>
  </div>
);
