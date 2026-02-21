export const ComponentLoader = ({
  color = "#1a1a1a",
  headerHeight = "130px",
}) => {
  return (
    <div
      className="w-full flex flex-col items-center justify-center bg-white transition-opacity duration-700"
      // Fills the remaining viewport height perfectly below your 130px header
      style={{ minHeight: `calc(100vh - ${headerHeight})` }}
    >
      {/* The Progress Bar:
         A hair-thin 1px line that provides subtle feedback 
         without cluttering the interface with text.
      */}
      <div className="relative w-32 h-[1px] bg-slate-100 overflow-hidden">
        <div
          className="absolute h-full w-1/4 animate-modern-slide"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Cubic-bezier animation creates a premium 'velocity' effect 
         where the line accelerates and decelerates smoothly.
      */}
      <style>{`
        @keyframes modern-slide {
          0% { left: -30%; }
          100% { left: 110%; }
        }
        .animate-modern-slide {
          animation: modern-slide 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
    </div>
  );
};
