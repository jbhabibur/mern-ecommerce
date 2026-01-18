import { HeaderManager } from "../components/Header/HeaderManager";
import { Footer } from "../components/Footer";
import { MobileNav } from "../components/MobileNav";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "../contexts/HeaderContext";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { SearchTrigger } from "../components/search/SearchTrigger";
import { BottomNavigation } from "../components/shared/BottomNavigation";
import { CartDrawer } from "../components/Cart/CartDrawer";

export const MainLayout = () => {
  return (
    <Provider store={store}>
      <HeaderProvider>
        {/* Global rendering */}
        <SearchTrigger />
        <HeaderManager />
        <main>
          <Outlet />
        </main>
        <Footer />
        {/* Global Bottom Nav */}
        <BottomNavigation />
        <CartDrawer /> {/* Global Sidebar */}
      </HeaderProvider>
    </Provider>
  );
};
