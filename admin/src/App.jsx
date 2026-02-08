import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AddCategory from "./components/AddCategory";
import AdminDashboard from "./components/AdminDashboard";

// 1️⃣ Create a QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    // 2️⃣ Wrap the app with QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <div>
        <AdminDashboard />
        {/* You can also render AddCategory here if needed */}
        {/* <AddCategory /> */}
      </div>
    </QueryClientProvider>
  );
};

export default App;
