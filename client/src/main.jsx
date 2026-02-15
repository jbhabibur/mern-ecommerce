import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { QueryClientProvider } from "@tanstack/react-query";

import router from "./routes/AppRoutes.jsx";
import { queryClient } from "./config/reactQuery.js";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
