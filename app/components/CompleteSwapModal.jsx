"use client";

import React from "react";
import { AiOutlineClose, AiOutlineRight } from "react-icons/ai";
import { RiTwitterXLine, RiChatNewFill, RiServiceFill } from "react-icons/ri";
import { GrDocumentTransfer } from "react-icons/gr";
import { FaGift, FaBookOpen } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdPeopleAlt } from "react-icons/md";
import {
  BsExclamationCircleFill,
  BsShieldShaded,
  BsGithub,
  BsDiscord,
  BsYoutube,
  BsSubstack,
  BsMapFill,
} from "react-icons/bs";
import { PiSignInBold } from "react-icons/pi";
import { useAccount, useConnect } from "wagmi";
import WagmiConnectButton from "../components/global/WagmiConnectButton";
import Link from "next/link";

const CompleteSwapModal = ({ isOpen, onClose }) => {
  const { address, isConnected } = useAccount(); // Get account address and connection status
  const { connectors, connectedConnector } = useConnect();

  // if (!isOpen) return null;

  const walletIcon = connectedConnector?.options?.icon;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Modal content */}
      <div
        className={`absolute inset-0 bg-[#14213d] border-t border-white border-opacity-5 rounded-md shadow-lg overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "popup-enter" : "popup-exit"
        }`}
      >
        <div className="text-white h-full flex flex-col">
          {/* Modal Header */}
          <header className="flex justify-between items-center text-[#9fa9c4] p-4 sticky top-0 z-10">
            <span className="text-base md:text-lg font-semibold">Menu</span>
            <AiOutlineClose
              onClick={onClose}
              className="cursor-pointer text-xl md:text-2xl"
            />
          </header>

          <div className="flex-grow overflow-y-auto">
            <div className="py-5">
              {/* Connect a Wallet */}
              {/* <div className="bg-[#381836] w-[94%] px-4 py-2 rounded-lg flex items-center mx-auto justify-between cursor-pointer">
                {isConnected ? (
                  <>
                    {walletIcon && (
                      <Image
                        src={walletIcon}
                        alt="wallet icon"
                        height={24}
                        width={24}
                      />
                    )}
                    <span onClick={() => open()}>{address}</span>{" "}
                   
                  </>
                ) : (
                  <>
                    <RiWallet3Line className="text-[#e32474] text-2xl" />

                    <span
                      className="w-full font-bold text-sm tracking-wide text-center text-[#e32474]"
                      onClick={() => open()}
                    >
                      Connect a wallet
                    </span>
                  </>
                )}
              </div> */}
              <WagmiConnectButton />

              <div className="space-y-4 p-4">
                <div className="bg-[#111c36] rounded">
                  {/* transfers & campaigns*/}
                  <Link
                    href={"/swap/transactions"}
                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <GrDocumentTransfer className="font-bold" />
                      <span className="text-sm font-semibold">Transfers</span>
                    </div>
                    <AiOutlineRight className="text-sm" />
                  </Link>
                  <div className="border-t border-[#2C3A57]"></div>
                  <Link
                    href={"/swap/campaigns"}
                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <FaGift />
                      <span className="text-sm font-semibold">Campaigns</span>
                    </div>
                    <AiOutlineRight className="text-sm" />
                  </Link>
                </div>

                {/* help, docs of users, docs of partners*/}
                <div className="bg-[#111c36] rounded">
                  <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <BsExclamationCircleFill />
                      <span className="text-sm font-semibold">Help</span>
                    </div>
                    <AiOutlineRight className="text-sm" />
                  </div>
                  <div className="border-t border-[#2C3A57]"></div>
                  <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <FaBookOpen />
                      <span className="text-sm font-semibold">
                        Docs for Users
                      </span>
                    </div>
                    <HiOutlineExternalLink className="text-sm" />
                  </div>
                  <div className="border-t border-[#2C3A57]"></div>
                  <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <MdPeopleAlt />
                      <span className="text-sm font-semibold">
                        Docs for Partners
                      </span>
                    </div>
                    <HiOutlineExternalLink className="text-sm" />
                  </div>
                </div>

                {/* privacy policy & terms of service*/}
                <div className="bg-[#111c36] rounded">
                  <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <BsShieldShaded />
                      <span className="text-sm font-semibold">
                        Privacy Policy
                      </span>
                    </div>
                    <HiOutlineExternalLink className="text-sm" />
                  </div>
                  <div className="border-t border-[#2C3A57]"></div>
                  <div className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <RiServiceFill />
                      <span className="text-sm font-semibold">
                        Terms of Service
                      </span>
                    </div>
                    <HiOutlineExternalLink className="text-sm" />
                  </div>
                </div>

                {/* Suggest a Feature */}
                <div className="flex justify-between items-center bg-[#111c36] p-2 rounded cursor-pointer hover:bg-[#1c2e5a] transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <RiChatNewFill />
                    <span className="text-sm font-semibold">
                      Suggest a Feature
                    </span>
                  </div>
                  <AiOutlineRight className="text-sm" />
                </div>
              </div>

              <div className="mx-4 border-t border-[#2C3A57]"></div>

              {/* media links & suggestions */}
              <div className="p-4">
                <h3 className="text-[#9fa9c4] text-[14px] font-semibold text-center mb-4">
                  Media links & suggestions:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-[#111c36] p-2 flex items-center justify-center space-x-2 rounded-lg hover:bg-[#1c2e5a] transition-colors duration-200">
                    <RiTwitterXLine className="text-lg" />
                    <span className="text-[15px]">Twitter</span>
                  </button>
                  <button className="bg-[#111c36] p-2 flex items-center justify-center space-x-2 rounded-lg hover:bg-[#1c2e5a] transition-colors duration-200">
                    <BsGithub className="text-lg" />
                    <span className="text-[15px]">GitHub</span>
                  </button>
                  <button className="bg-[#111c36] p-2 flex items-center justify-center space-x-2 rounded-lg hover:bg-[#1c2e5a] transition-colors duration-200">
                    <BsDiscord className="text-lg" />
                    <span className="text-[15px]">Discord</span>
                  </button>
                  <button className="bg-[#111c36] p-2 flex items-center justify-center space-x-2 rounded-lg hover:bg-[#1c2e5a] transition-colors duration-200">
                    <BsYoutube className="text-lg" />
                    <span className="text-[15px]">YouTube</span>
                  </button>
                  <button className="bg-[#111c36] p-2 flex items-center justify-center space-x-2 rounded-lg hover:bg-[#1c2e5a] transition-colors duration-200">
                    <BsSubstack className="text-lg" />
                    <span className="text-[15px]">Substack</span>
                  </button>
                  <button className="bg-[#111c36] p-2 flex items-center justify-center space-x-2 rounded-lg hover:bg-[#1c2e5a] transition-colors duration-200">
                    <BsMapFill className="text-lg" />
                    <span className="text-[15px]">Roadmap</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Section */}
          <div className="bg-[#0c1526] sticky bottom-0 left-0 right-0 z-20 pb-4 pt-2">
            <div className="border-t border-[#2C3A57] mb-4"></div>
            <nav
              onClick={onClose}
              className="bg-[#111c36] w-[94%] mx-auto p-4 flex justify-between items-center cursor-pointer rounded-md"
            >
              <div className="flex items-center space-x-3">
                <PiSignInBold />
                <span className="text-[15px]">Sign In</span>
              </div>
              <AiOutlineRight />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteSwapModal;
