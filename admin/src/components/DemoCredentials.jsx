import React from "react";
import { UserCheck, ShieldCheck, FileEdit } from "lucide-react";

export const DemoCredentials = ({ onSelect }) => {
  const accounts = [
    {
      role: "Super Admin",
      email: "admin@mensfashion.com",
      pass: "admin123",
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      role: "Store Manager",
      email: "manager@mensfashion.com",
      pass: "manager123",
      icon: <UserCheck className="w-4 h-4 text-indigo-600" />,
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
    {
      role: "Editor",
      email: "editor@mensfashion.com",
      pass: "editor123",
      icon: <FileEdit className="w-4 h-4 text-emerald-600" />,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
  ];

  return (
    <div className="w-full mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
          Demo Access for Showcase
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {accounts.map((acc) => (
          <button
            key={acc.role}
            type="button"
            onClick={() => onSelect(acc.email, acc.pass)}
            className={`group flex items-center justify-between p-3.5 ${acc.bgColor} border ${acc.borderColor} rounded-2xl hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm leading-none">
                {acc.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                  {acc.role}
                </p>
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {acc.email}
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-gray-400 font-bold uppercase">
                Pass
              </p>
              <p className="text-xs font-mono font-bold text-gray-600">
                {acc.pass}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
