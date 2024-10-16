import Image from "next/image";
import { useEffect, useRef } from "react";
import { useAccount, useBalance } from "wagmi";
import { config } from "../web3Config";
import { formatCurrency } from "../utils";

const TokenAssetsDropdown = ({ assets, onSelect, onClose, selected }) => {
  const dropdownRef = useRef(null);
  const { chainId, address } = useAccount();
  const { data } = useBalance({
    address,
    config,
    chainId,
    formatUnits: "gwei",
    watch: true,
  });

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
      className="bg-[#0F192F] border border-white border-opacity-5 absolute right-[1px] top-[54px] md:top-[54px] p-2 rounded-lg w-[200px] h-max max-h-[450px] animate-slideDown flex flex-col items-center z-50 overflow-y-auto dropdown"
    >
      {assets?.map((crypto, index) => (
        <button
          key={index}
          className={` ${
            selected === crypto.display_asset ? "bg-[#111D36]" : ""
          }
            relative flex items-center justify-center w-full mb-2 last:mb-0 rounded-md py-2 pr-2 pl-4 duration-200 group hover:bg-[#111D36] ease`}
          onClick={() => onSelect(crypto)}
        >
          {/* <div className="absolute inset-0 rounded-md group-hover:bg-[#1c2d4a] transition-colors duration-200"></div> */}
          <div className="flex items-center justify-start relative z-10 gap-2 w-full">
            <Image
              width={24}
              height={34}
              src={crypto.logo}
              alt={crypto.display_asset}
              className="w-6 rounded-md"
            />
            <span className="text-[#7a839e] text-sm group-hover:text-white">
              {crypto.display_asset}
            </span>
            <span className="text-[#7a839e] text-sm ml-auto">
              {data?.symbol?.toLowerCase() === crypto?.symbol?.toLowerCase()
                ? formatCurrency(data?.formatted)
                : 0}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TokenAssetsDropdown;
