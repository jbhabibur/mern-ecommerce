import majorCard from "../../../assets/images/Major-Cards.png";

export const PaymentSection = ({ paymentMethod, setPaymentMethod }) => {
  // Custom Donut Radio Button Style
  const customRadio = (isSelected) => (
    <div
      className={`relative flex items-center justify-center w-5 h-5 rounded-full border transition-all ${
        isSelected ? "border-[#0066CC]! border-[6px]!" : "border-gray-300"
      }`}
    />
  );

  return (
    <section>
      <h2 className="text-xl! font-semibold! text-gray-800 mb-1">Payment</h2>
      <p className="text-sm text-gray-500 mb-4">
        All transactions are secure and encrypted.
      </p>

      <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
        {/* SSLCOMMERZ Option */}
        <div
          className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all border! rounded-t-md ${
            paymentMethod === "ssl"
              ? "bg-[#F5F6FF] border-[#005BD1] z-10"
              : "bg-white border-transparent border-b-gray-200 hover:bg-gray-50"
          }`}
          onClick={() => setPaymentMethod("ssl")}
        >
          <div className="flex items-center gap-3">
            {customRadio(paymentMethod === "ssl")}
            <span className="text-sm font-medium text-gray-700">
              SSLCOMMERZ
            </span>
          </div>
          <div className="flex gap-1">
            <img className="w-32 object-contain" src={majorCard} alt="Card" />
          </div>
        </div>

        {/* Dynamic Content for SSLCOMMERZ */}
        <div
          className={`overflow-hidden transition-all duration-300 bg-gray-50 text-center text-sm text-gray-600 border-b ${
            paymentMethod === "ssl" ? "max-h-20 p-6" : "max-h-0"
          }`}
        >
          You'll be redirected to SSLCOMMERZ to complete your purchase.
        </div>

        {/* COD Option */}
        <div
          className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all border! rounded-b-md ${
            paymentMethod === "cod"
              ? "bg-[#F5F6FF] border-[#005BD1] z-10"
              : "bg-white border-transparent hover:bg-gray-50"
          }`}
          onClick={() => setPaymentMethod("cod")}
        >
          {customRadio(paymentMethod === "cod")}
          <span
            className={`text-sm font-medium ${
              paymentMethod === "cod" ? "text-gray-800" : "text-gray-400"
            }`}
          >
            Cash on Delivery (COD)
          </span>
        </div>
      </div>
    </section>
  );
};
