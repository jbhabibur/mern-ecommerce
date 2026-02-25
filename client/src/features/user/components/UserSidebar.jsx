import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  User,
  MapPin,
  CreditCard,
  Package,
  RotateCcw,
  XCircle,
  Settings,
  Heart,
  Star,
} from "lucide-react";

export const UserSidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const menuData = [
    {
      title: "Manage My Account",
      icon: <Settings size={18} />,
      path: "/account",
      links: [
        {
          name: "My Profile",
          path: "/account/profile",
          icon: <User size={16} />,
        },
        {
          name: "Address Book",
          path: "/account/address",
          icon: <MapPin size={16} />,
        },
        {
          name: "Payment Options",
          path: "/account/payment",
          icon: <CreditCard size={16} />,
        },
      ],
    },
    {
      title: "My Orders",
      path: "/account/orders",
      icon: <Package size={18} />,
      links: [
        {
          name: "My Returns",
          path: "/account/returns",
          icon: <RotateCcw size={16} />,
        },
        {
          name: "My Cancellations",
          path: "/account/cancellations",
          icon: <XCircle size={16} />,
        },
      ],
    },
    {
      title: "My Wishlist",
      path: "/account/wishlist",
      icon: <Heart size={18} />,
      links: [],
    },
    {
      title: "My Reviews",
      path: "/account/reviews",
      icon: <Star size={18} />,
      links: [],
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-[260px] p-4  border border-gray-100 rounded-xl shadow-sm">
      {/* Profile Header: Minimalist Black & White */}
      <div className="flex items-center gap-x-4 mb-10 border-b border-gray-50">
        <div className="relative group">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-lg font-medium transition-transform duration-300 group-hover:scale-105">
            {user?.firstName ? (
              user.firstName[0].toUpperCase()
            ) : (
              <User size={24} />
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
            Welcome
          </span>
          <span className="font-bold! text-gray-900 truncate text-base!">
            {user?.firstName || "Guest"} {user?.lastName || ""}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-y-4">
        {menuData.map((section, idx) => {
          const isLastTwo = idx >= menuData.length - 2;
          return (
            <div
              key={idx}
              className={`flex flex-col ${isLastTwo ? "gap-y-0" : "gap-y-4"}`}
            >
              {/* Section Heading */}
              <NavLink
                to={section.path || "#"}
                end
                className={({ isActive }) =>
                  `flex items-center justify-between no-underline! group transition-all duration-300 ${
                    isActive && section.path
                      ? "text-black"
                      : "text-gray-400 hover:text-black"
                  }`
                }
              >
                <div className="flex items-center gap-x-2">
                  <span className="text-black transition-transform duration-300 group-hover:rotate-12">
                    {section.icon}
                  </span>
                  <h3 className="font-bold! text-xs! text-black uppercase tracking-tighter m-0">
                    {section.title}
                  </h3>
                </div>
              </NavLink>

              {/* Links with Modern Hover State */}
              <ul className="flex flex-col list-none p-0 m-0">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center gap-x-3 text-[13.5px] text-black no-underline! py-1 px-3 rounded-lg transition-all duration-300 group ${
                          isActive
                            ? "bg-black text-white shadow-md shadow-gray-200"
                            : "text-gray-600 hover:bg-gray-100 hover:text-black"
                        }`
                      }
                    >
                      <span
                        className={`transition-colors duration-300 font-bold text-xs ${link.icon ? "block" : "hidden"}`}
                      >
                        {link.icon}
                      </span>
                      <span className="flex-1 font-light! text-xs! m-0">
                        {link.name}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
