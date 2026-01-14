import { HeaderManager } from "../components/Header/HeaderManager";
import { Footer } from "../components/Footer";
import { MobileNav } from "../components/MobileNav";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "../contexts/HeaderContext";

export const MainLayout = () => {
  return (
    <HeaderProvider>
      <HeaderManager />
      <main>
        <Outlet />
      </main>
      <Footer />

      <div className="block md:hidden">
        <MobileNav />
      </div>
    </HeaderProvider>
  );
};
