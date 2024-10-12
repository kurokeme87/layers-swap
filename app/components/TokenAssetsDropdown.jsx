import Image from "next/image";
import React, { useEffect, useRef } from "react";

const TokenAssetsDropdown = ({ assets, onSelect, onClose }) => {
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // console.log(assets, "assets");
  return (
    <div
      ref={dropdownRef}
      className="bg-[#0c1526] border border-white border-opacity-5 absolute right-[1px] top-[54px] md:top-[54px] p-2 rounded-lg w-[150px] max-h-[200px] animate-slideDown flex flex-col items-center z-50 overflow-y-auto"
    >
      {assets?.map((crypto, index) => (
        <button
          key={index}
          className="relative flex items-center justify-center w-full mb-2 last:mb-0 rounded-md p-1 transition-colors duration-200 group"
          onClick={() => onSelect(crypto)}
        >
          <div className="absolute inset-0 rounded-md group-hover:bg-[#1c2d4a] transition-colors duration-200"></div>
          <div className="flex items-center justify-start relative z-10 gap-2 w-full">
            <Image
              width={24}
              height={34}
              src={crypto.logo}
              alt={crypto.display_asset}
              className="w-6 rounded-md"
            />
            <span className="text-[#7a839e] text-sm">
              {crypto.display_asset}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TokenAssetsDropdown;
