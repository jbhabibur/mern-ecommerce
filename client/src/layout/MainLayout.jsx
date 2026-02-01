import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "../contexts/HeaderContext";
import { SearchTrigger } from "../components/search/SearchTrigger";
import { HeaderManager } from "../components/Header/HeaderManager";
import { Footer } from "../components/Footer";
import { BottomNavigation } from "../components/shared/BottomNavigation";
import { CartDrawer } from "../components/Cart/CartDrawer";
import { AuthDrawer } from "../features/auth/components/AuthDrawer";

export const MainLayout = () => {
  const { isOpen } = useSelector((state) => state.authDrawer);

  return (
    <HeaderProvider>
      <div
        className={`relative transition-transform duration-500 ease-in-out ${
          // Shift only happens on desktop (md:). On mobile, it stays at 0.
          isOpen ? "md:-translate-x-[50px] translate-x-0" : "translate-x-0"
        }`}
      >
        <SearchTrigger />
        <HeaderManager />
        {/* Add padding bottom so content isn't hidden by the fixed BottomNav on mobile */}
        <main className="pb-16 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <BottomNavigation />
      </div>

      <CartDrawer />
      <AuthDrawer />
    </HeaderProvider>
  );
};
