export const SocialIcon = ({ icon }) => (
  <div
    className="bg-white p-2.5 rounded-full cursor-pointer 
               transition-all duration-200
               outline-0 outline-white outline-offset-0
               hover:outline-3 hover:outline-offset-6"
  >
    <div className="text-black">
      {" "}
      {/* আইকন দেখার জন্য কালার অ্যাড করা হয়েছে */}
      {icon}
    </div>
  </div>
);
