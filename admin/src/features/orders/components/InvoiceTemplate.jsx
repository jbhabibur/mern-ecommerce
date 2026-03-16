import React, { forwardRef } from "react";

export const InvoiceTemplate = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div
      ref={ref}
      id="printable-invoice"
      className="hidden print:block p-10 bg-white text-black min-h-screen"
    >
      {/* Header */}
      <div className="flex justify-between border-b-2 border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Invoice
          </h1>
          <p className="text-sm mt-1 text-gray-600 font-mono">
            ID: #{order._id?.toUpperCase()}
          </p>
          <p className="text-sm text-gray-600">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <h2 className="font-bold text-xl uppercase tracking-widest">
            Fashion Commerce
          </h2>
          <p className="text-xs text-gray-500 italic">Official Order Summary</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-10 mt-10">
        <div>
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
            Customer Details
          </h3>
          <p className="font-bold text-lg">{order.billingAddress?.fullName}</p>
          <p className="text-sm">{order.billingAddress?.phoneNumber}</p>
          <p className="text-sm">{order.customer?.email}</p>
        </div>
        <div className="text-right">
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
            Shipping Address
          </h3>
          <p className="text-sm leading-relaxed">
            {order.billingAddress?.address ||
              order.billingAddress?.houseAddress}
            <br />
            {order.billingAddress?.city}, {order.billingAddress?.zone}
          </p>
          <p className="text-xs font-bold mt-1 uppercase text-gray-500">
            Method: {order.payment?.method}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mt-12 border-collapse">
        <thead>
          <tr className="border-b-2 border-black text-left">
            <th className="py-3 text-[10px] font-black uppercase tracking-widest">
              Item Description
            </th>
            <th className="py-3 text-[10px] font-black uppercase tracking-widest">
              Size
            </th>
            <th className="py-3 text-[10px] font-black uppercase tracking-widest text-center">
              Qty
            </th>
            <th className="py-3 text-[10px] font-black uppercase tracking-widest text-right">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items?.map((item, i) => (
            <tr key={i}>
              <td className="py-4 font-medium">{item.name}</td>
              <td className="py-4 text-sm uppercase">{item.size}</td>
              <td className="py-4 text-center font-mono">{item.quantity}</td>
              <td className="py-4 text-right font-mono">
                ৳{item.priceAtCheckout}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-10 ml-auto w-72 pt-4 border-t-2 border-black">
        <div className="flex justify-between text-sm py-1">
          <span className="text-gray-500 uppercase font-bold text-[10px]">
            Subtotal:
          </span>
          <span className="font-mono font-bold">
            ৳{order.financials?.subtotal || order.priceAtCheckout}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 mt-2 bg-gray-50 px-2 rounded">
          <span className="text-xs font-black uppercase tracking-tighter">
            Total Amount:
          </span>
          <span className="font-mono text-xl font-black">
            ৳{order.financials?.totalAmount || order.priceAtCheckout}
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-32 text-center border-t border-gray-100 pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Thank you for your order
        </p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
