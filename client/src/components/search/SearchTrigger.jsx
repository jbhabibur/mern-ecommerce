import { useSelector } from "react-redux";
import { MobileSearchOverlay } from "./MobileSearchOverlay";

export const SearchTrigger = () => {
  const { isClicked } = useSelector((state) => state.search);

  return <div className="">{isClicked && <MobileSearchOverlay />}</div>;
};
