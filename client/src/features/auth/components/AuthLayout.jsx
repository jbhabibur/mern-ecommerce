export const AuthLayout = ({ children, breadcrumb, status, title }) => {
  return (
    <div className="min-h-screen bg-white font-sans p-4 md:p-10">
      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto mb-12">{breadcrumb}</nav>

      {/* Global Status Message */}
      {status && (
        <div
          className={`max-w-6xl mx-auto mb-8 p-4 text-center border animate-in fade-in duration-500 ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* Page Title */}
      <h1 className="text-center text-2xl! font-bold! mb-16 text-black uppercase">
        {title}
      </h1>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-16 lg:gap-32">
        {children}
      </div>
    </div>
  );
};
