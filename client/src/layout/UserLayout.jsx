import { Outlet } from "react-router-dom";
import { UserSidebar } from "../features/user/components/UserSidebar";
import { SectionLayout } from "./SectionLayout";

export const UserLayout = () => {
  return (
    <SectionLayout bgColor="bg-[#F4F4F4]">
      <div className="min-h-screen py-8">
        <div className="flex gap-4">
          {/* Left Side: Sidebar */}
          <aside className="w-1/5 hidden md:block">
            <UserSidebar />
          </aside>

          {/* Right Side: Dynamic Content */}
          <main className="w-full md:w-4/5 bg-white p-3 shadow-sm rounded-sm">
            {/* Outlet-e nested routes gulo render hobe (e.g., ManageAccount, MyOrders) */}
            <Outlet />
          </main>
        </div>
      </div>
    </SectionLayout>
  );
};
