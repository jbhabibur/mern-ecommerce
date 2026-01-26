import React from "react";
import { Breadcrumb } from "../components/atoms/Breadcrumb";

export const ContactPage = () => {
  return (
    <div className="max-w-[76rem] mx-auto px-4 py-8 font-sans">
      {/* Breadcrumb */}
      <Breadcrumb />

      <h1 className="text-xl! font-bold! my-10! tracking-tight">CONTACT</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left Side: Contact Form */}
        <div>
          <p className="text-gray-700 mb-6">
            Have a question or comment? <br />
            Use the form below to send us a message or contact us by mail at:
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="6"
                className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition-colors resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#222] text-white hover:text-black! px-10 py-3 font-bold text-sm tracking-widest hover:bg-white! border border-black transition-colors duration-500"
            >
              SUBMIT CONTACT
            </button>
          </form>
        </div>

        {/* Right Side: Contact Details */}
        <div className="space-y-6 text-sm text-gray-800">
          <div>
            <h3 className="font-bold text-lg mb-4">Get In Touch!</h3>
            <p className="leading-relaxed mb-6">
              We'd love to hear from you – please use the form to <br />
              send us your message or ideas. Or simply pop in for a <br />
              cup of fresh tea and a cookie:
            </p>

            <p className="leading-relaxed italic text-gray-600">
              Ambia Tower (7th Floor), 4/1 Simson Road, Kotwali , <br />
              Dhaka, Bangladesh, 1100.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="leading-loose">
              If you have any question, please contact us . Hotline: 02- <br />
              57390880 Email: info@beman.com.bd
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
