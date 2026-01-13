// QuickAddActionBtn Component
export const QuickAddActionBtn = ({ title, disabled }) => {
  return (
    <div className="w-full bg-white text-black border border-black py-3 uppercase font-bold text-center cursor-pointer text-xs tracking-widest">
      {title}
    </div>
  );
};
