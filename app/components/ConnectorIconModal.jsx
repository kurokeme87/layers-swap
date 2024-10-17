"use client";

import { useAccount } from "wagmi";
// import metaImage from "../public/layerswap_logo.png";
import Image from "next/image";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { GrClose } from "react-icons/gr";
import { BiPlus } from "react-icons/bi";
import { shortenAddressSmall } from "../utils";
import { disconnect, getAccount } from "@wagmi/core";
import { config } from "../web3Config";
import { toast } from "react-toastify";

const ConnectorIconModal = ({ component }) => {
  const { address, isConnected, connector } = useAccount();
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);
  const { connector: connectr } = getAccount(config);

  const togglOpen = () => setOpen(!open);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDisconnect = async () => {
    try {
      if (isConnected) {
        await disconnect(config, { connector: connectr }).then((res) => {
          setOpen(false);
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  if (!isConnected) return;
  return (
    <div className="">
      {component ? (
        <div onClick={togglOpen}>{component}</div>
      ) : (
        <button
          onClick={togglOpen}
          className="rounded-md hover:bg-[#162546] ease transition-all p-1"
        >
          <Image
            src={connector?.icon}
            width={25}
            height={25}
            alt={connector?.name}
            className="rounded-full"
          />
        </button>
      )}

      {open ? (
        <div className="fixed inset-0 bg-[#00000080] z-50 backdrop-blur-sm"></div>
      ) : null}

      {/* Dropdown conntent */}
      <div
        ref={modalRef}
        className={`${
          open
            ? "translate-y-0 opacity-100 flex flex-col"
            : "opacity-0 translate-y-10 hidden"
        } bg-[#0F192F] z-[999] h-max transition-transform duration-300 ease-in-out top-[40%] left-[50%] fixed -translate-x-[50%] -translate-y-[50%] grid w-full gap-4 rounded-t-lg p-4 shadow-lg rounded-lg sm:max-w-[425px]`}
      >
        <div className="flex justify-between items-center w-full">
          <p className="text-[#FEFFFE] w-full font-normal text-lg text-center">
            Wallets
          </p>

          <button
            onClick={togglOpen}
            className="rounded-full bg-[#162546] p-1 border border-[#1C2759]"
          >
            <GrClose size={12} color="white" />
          </button>
        </div>

        <div className="w-full border border-[#1C2759] rounded-md py-4 px-3 bg-[#111D36] flex justify-between items-center">
          <div className="flex justify-start items-center gap-3">
            <Image
              src={connector?.icon}
              width={28}
              height={28}
              alt="connector image"
              className="rounded-full"
            />
            <p className="font-normal text-white text-sm">
              {shortenAddressSmall(address)}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="hover:opacity-60 text-[#ABB5D1] text-xs"
          >
            Disconnect
          </button>
        </div>

        <button className="w-full flex justify-end items-center gap-3 text-[#ABB5D1]">
          <BiPlus />
          <p className="text-sm">Link a new wallet</p>
        </button>
      </div>
    </div>
  );
};

export default ConnectorIconModal;
