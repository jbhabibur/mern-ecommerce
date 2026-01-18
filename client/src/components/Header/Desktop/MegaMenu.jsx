import React from "react";
import { SubMenu } from "./SubMenu";

import { NAVIGATION_DATA_DESKTOP } from "../../../constants/navigationData";

export const MegaMenu = () => {
  return (
    <nav className="bg-black text-white px-4">
      <div className="flex flex-wrap items-center justify-center content-start gap-x-4 text-[12px] font-bold tracking-wider">
        {NAVIGATION_DATA_DESKTOP.map((item) => (
          <SubMenu key={item.id} item={item} />
        ))}
      </div>
    </nav>
  );
};
