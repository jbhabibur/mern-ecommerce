import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { store } from "./redux/store.js";
import router from "./routes/AppRoutes.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import "./index.css";

// Create a QueryClient instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Optional: prevents auto-refresh when switching tabs
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap everything with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
