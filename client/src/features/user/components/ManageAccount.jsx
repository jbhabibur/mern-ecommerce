import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../../api/apiConfig";
import { RecentOrdersTable } from "../components/RecentOrdersTable";

/**
 * ManageAccount Component
 * Fetches real-time addresses and orders using React Query.
 */
export const ManageAccount = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // Fetch Addresses API
  const fetchAddresses = async () => {
    const res = await axios.get(`${BASE_URL}/api/address`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  };

  // Address Query
  const {
    data: addresses = [],
    isLoading: isAddrLoading,
    isError: isAddrError,
  } = useQuery({
    queryKey: ["addresses", user?._id],
    queryFn: fetchAddresses,
    enabled: !!user && !!token,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const defaultShipping = addresses.find((addr) => addr.isDefaultShipping);
  const defaultBilling = addresses.find((addr) => addr.isDefaultBilling);

  if (isAddrError) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load account data. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-[#212121]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl! md:text-2xl! mb-4 text-[#424242] font-normal">
          Manage My Account
        </h1>

        {/* GRID UPDATE: 
            grid-cols-1: Single column for mobile
            md:grid-cols-2: Two columns for tablets
            lg:grid-cols-3: Three columns for desktop
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {/* Section 1: Personal Profile */}
          <div className="bg-white overflow-hidden p-2 lg:p-4 h-auto min-h-[160px] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base! font-normal! m-0">Personal Profile</h2>
              <button
                onClick={() => navigate("/account/profile")}
                className="text-[#1a9cb7] text-xs uppercase font-medium hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="text-sm space-y-1 break-words">
              <p className="text-gray-800 font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-800 break-all">{user?.email}</p>
              <div className="flex items-center gap-2 mt-auto pt-4">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="accent-[#f57224] h-4 w-4 shrink-0"
                />
                <span className="text-xs text-gray-600">
                  Receive marketing SMS
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white overflow-hidden p-2 lg:p-4 h-auto min-h-[160px] shadow-sm md:border-l md:border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base! font-normal! m-0">Address Book</h2>
              <button
                onClick={() => navigate("/account/address")}
                className="text-[#1a9cb7] text-xs uppercase font-medium hover:underline"
              >
                Edit
              </button>
            </div>
            <p className="text-[10px] uppercase text-gray-400 mb-2 tracking-wide font-semibold">
              Default Shipping Address
            </p>
            <div className="text-sm space-y-1">
              {isAddrLoading ? (
                <p className="text-gray-400 animate-pulse">Loading...</p>
              ) : defaultShipping ? (
                <>
                  <p className="font-bold text-gray-800 break-words min-w-0">
                    {" "}
                    {/* Added break-words */}
                    {defaultShipping.fullName}
                  </p>
                  <p className="text-gray-600 leading-relaxed break-words min-w-0">
                    {" "}
                    {/* Added break-words */}
                    {defaultShipping.houseAddress}
                  </p>
                  <p className="text-gray-600 break-words">
                    {" "}
                    {/* Added break-words */}
                    {defaultShipping.city} - {defaultShipping.zone}
                  </p>
                  <p className="text-gray-800 mt-2 font-medium">
                    (+880) {defaultShipping.phoneNumber}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No default shipping address.
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Billing Address */}
          <div className="bg-white overflow-hidden p-2 lg:p-4 h-auto min-h-[160px] shadow-sm lg:border-l lg:border-gray-100 flex flex-col">
            <div className="mb-4 h-6 hidden lg:block"></div>
            <p className="text-[10px] uppercase text-gray-400 mb-2 tracking-wide font-semibold">
              Default Billing Address
            </p>
            <div className="text-sm space-y-1">
              {isAddrLoading ? (
                <p className="text-gray-400 animate-pulse">Loading...</p>
              ) : defaultBilling ? (
                <>
                  <p className="font-bold text-gray-800 break-words">
                    {" "}
                    {/* Added break-words */}
                    {defaultBilling.fullName}
                  </p>
                  <p className="break-words min-w-0">
                    {defaultBilling.houseAddress}
                  </p>{" "}
                  {/* Added break-words */}
                  <p className="text-gray-600 break-words">
                    {" "}
                    {/* Added break-words */}
                    {defaultBilling.city} - {defaultBilling.zone}
                  </p>
                  <p className="text-gray-800 mt-2 font-medium">
                    (+880) {defaultBilling.phoneNumber}
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No default billing address.
                </p>
              )}
            </div>
          </div>
        </div>
        <RecentOrdersTable />
      </div>
    </div>
  );
};
