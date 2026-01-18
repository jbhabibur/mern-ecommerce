import React from "react";
import { BeatLoader } from "react-spinners";

export const PrimaryButton = ({ label, onClick, hasLoad = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center
        bg-[#212121] 
        hover:bg-black 
        text-white 
        font-bold 
        py-[12px]
        px-20
        tracking-widest 
        uppercase! 
        text-sm 
        transition-colors 
        duration-300
      `}
    >
      {hasLoad ? <BeatLoader size={15} color="#FFFFFF" /> : label}
    </button>
  );
};
