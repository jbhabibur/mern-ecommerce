import { Outlet } from "react-router-dom";
import { HeaderProvider } from "../contexts/HeaderContext";

import { HeaderManager } from "../components/Header/HeaderManager";
import { Footer } from "../components/Footer";

export const MainLayout = () => {
  return (
    <HeaderProvider>
      <HeaderManager />
      <main>
        <Outlet />
      </main>
      <Footer />
    </HeaderProvider>
  );
};
