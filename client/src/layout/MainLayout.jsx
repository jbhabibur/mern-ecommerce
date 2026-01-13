import { HeaderManager } from "../components/Header/HeaderManager";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "../contexts/HeaderContext";

export const MainLayout = () => {
  return (
    <HeaderProvider>
      <HeaderManager />
      <main>
        <Outlet />
      </main>
    </HeaderProvider>
  );
};