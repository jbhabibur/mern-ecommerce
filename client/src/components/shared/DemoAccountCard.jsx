import { useState } from "react";
import { User, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

export const DemoAccountCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const demoCredentials = {
    email: "habiburrahman24126@gmail.com",
    password: "habibur_as_client",
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-zinc-900 text-white text-xs relative z-[999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
        {/* Left side notice */}
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Testing Site</span>
        </div>

        {/* Right side Toggle Button / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-300 hover:text-white transition-colors cursor-pointer py-1"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo Credentials</span>
            {isOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          {/* Dropdown Card */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white text-zinc-900 border border-zinc-200 shadow-2xl rounded-lg p-3.5 space-y-3 z-[1000] animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Quick Login Info
                </span>
                <span className="text-[9px] text-zinc-400 font-medium">
                  Click to copy
                </span>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  Email
                </span>
                <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded text-xs font-medium text-zinc-800">
                  <span className="truncate pr-2">{demoCredentials.email}</span>
                  <button
                    onClick={() => handleCopy(demoCredentials.email, "email")}
                    className="text-zinc-500 hover:text-black transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  Password
                </span>
                <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded text-xs font-medium text-zinc-800">
                  <span className="truncate pr-2">
                    {demoCredentials.password}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(demoCredentials.password, "password")
                    }
                    className="text-zinc-500 hover:text-black transition-colors shrink-0 cursor-pointer"
                  >
                    {copiedField === "password" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
