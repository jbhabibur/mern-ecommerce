import { Info } from "lucide-react";
import { useCartTimer } from "../../../hooks/useCartTimer";

export const TimerAlert = ({ isEmpty = false }) => {
  const { formattedTime } = useCartTimer(40);
  return (
    <div className="bg-[#fcf3e1] py-3 px-4 flex items-center justify-center gap-2 mb-8">
      <Info size={18} className="text-[#3c3c3c] shrink-0" />

      <p className="text-[#3c3c3c] text-[13px] md:text-[14px] leading-tight md:leading-none mb-0">
        {isEmpty ? (
          <>
            Please, hurry! The product is being sold at a shocking promotional
            price. We'll keep it for you for{" "}
          </>
        ) : (
          <>
            Please, hurry! Someone has placed an order on one of the items you
            have in the cart. We'll keep it for you for{" "}
          </>
        )}
        <span className="font-bold text-black whitespace-nowrap">
          {formattedTime}
        </span>{" "}
        minutes.
      </p>
    </div>
  );
};
