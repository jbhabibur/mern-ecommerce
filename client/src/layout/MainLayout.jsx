import { HeaderManager } from "../components/Header/HeaderManager";
import { Outlet } from "react-router-dom";
import { HeaderProvider } from "../contexts/HeaderContext";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { SearchTrigger } from "../components/search/SearchTrigger";

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
      </HeaderProvider>
    </Provider>
  );
};
