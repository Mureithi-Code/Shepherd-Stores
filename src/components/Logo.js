import React from "react";
import Shepherd1 from "../asset/icons/Shepherd1.png";

const Logo = ({ w = 90, h = 50 }) => {
  return (
    <img
      src={Shepherd1}
      alt="Shepherd Logo"
      width={w}
      height={h}
      className="object-contain"
      bg="white"
    />
  );
};

export default Logo;
