import { Outlet } from "react-router-dom";
import { UserSidebar } from "../features/user/components/UserSidebar";
import { SectionLayout } from "./SectionLayout";

export const UserLayout = () => {
  return (
    <SectionLayout bgColor="bg-[#F4F4F4]">
      <div className="min-h-screen py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 lg:w-1/5 hidden lg:block">
            <UserSidebar />
          </aside>

          {/* Dynamic Content Area */}
          <main className="flex-1 min-w-0 bg-white p-3 lg:p-6! shadow-sm rounded-2xl border border-gray-100">
            <Outlet />
          </main>
        </div>
      </div>
    </SectionLayout>
  );
};
