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
} from "lucide-react"; // Standard feather-style icons

export const UserSidebar = () => {
  // Access auth state from Redux
  const { user } = useSelector((state) => state.auth);

  // Structured menu data with icons for a professional look
  const menuData = [
    {
      title: "Manage My Account",
      icon: <Settings size={18} />,
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
  ];

  return (
    <div className="flex flex-col items-start gap-y-8 w-full max-w-[250px] p-0">
      {/* Profile Header Section */}
      <div className="flex items-center gap-x-3 mb-2 px-2">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
          {/* Display first initial or fallback to User icon */}
          {user?.firstName ? (
            user.firstName[0].toUpperCase()
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Hello,</span>
          <span className="font-semibold text-gray-900 truncate max-w-[150px]">
            {user?.firstName || "Guest User"} {user?.lastName || ""}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-y-7">
        {menuData.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-y-3">
            {/* Section Title */}
            <div className="flex items-center gap-x-2 px-2 text-gray-900">
              <span className="opacity-70">{section.icon}</span>
              <h3 className="font-bold text-[15px]! m-0">{section.title}</h3>
            </div>

            {/* Navigation Links */}
            <ul className="flex flex-col gap-y-1">
              {section.links.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-x-3 text-sm text-black! no-underline! py-2.5 px-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "text-blue-600 font-medium bg-blue-50 border-r-4 border-[#1b1b1b]"
                          : "text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                      }`
                    }
                  >
                    <span className={`${link.icon ? "block" : "hidden"}`}>
                      {link.icon}
                    </span>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};
