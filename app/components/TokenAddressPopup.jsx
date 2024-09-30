import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaBitcoin, FaEthereum } from "react-icons/fa6";
import { GiRainbowStar } from "react-icons/gi";
import { IoIosCheckmarkCircle, IoMdAdd } from "react-icons/io";
import { useTokenContext } from "../context/TokenContext";
import LayerSwapConnectButton from "../components/global/LayerSwapConnectButton";
import { useAccount, useConnect } from "wagmi";
import { shortenAddressSmall } from "../utils";
import Image from "next/image";
import Web3 from "web3";

const TokenAddressPopup = ({ isOpen, onClose }) => {
  const MetaMask = "https://metamask.io/images/metamask-logo.png";
  const WalletConnect = "https://walletconnect.org/walletconnect-logo.png";
  const [allAccounts, setAccounts] = useState([]);
  const { sendToAdress, setSendToAdress, setSendToAsset } = useTokenContext();
  const { isConnected, connector, address } = useAccount();

  // Get account and connection information
  const { connector: activeConnector } = useAccount();

  // List of wallet connectors (MetaMask, WalletConnect, etc.)
  // const { connect, connectors, pendingConnector } = useConnect();

  // Function to dynamically get provider (connector) info
  const getProviderInfo = () => {
    if (activeConnector) {
      const connectorName = activeConnector.name; // The name of the connected wallet provider
      const connectorId = activeConnector.id; // The ID of the connected provider
      const providerLogo = activeConnector.iconUrl; // Use `iconUrl` to dynamically get the logo if available

      return {
        name: connectorName,
        logo: providerLogo || MetaMask || WalletConnect, // Use connector's logo if available, fallback to default
      };
    }
    return null;
  };

  const getAllConnectedWallets = async () => {
    // Check if the Ethereum provider is available (MetaMask or other)
    if (window.ethereum) {
      try {
        // Request all connected accounts from the user's wallet
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Create a Web3 instance
        const web3 = new Web3(window.ethereum);

        // Log all the connected accounts (wallet addresses)
        // console.log("Connected accounts:", accounts);

        // Optionally, retrieve the balance for each connected account
        for (const account of accounts) {
          const balance = await web3.eth.getBalance(account);
          // console.log(
          //   `Account: ${account}, Balance: ${web3.utils.fromWei(
          //     balance,
          //     "ether"
          //   )} ETH`
          // );
        }
        setAccounts(accounts); // Return all connected accounts (wallets)
      } catch (error) {
        // console.error("Error fetching connected wallets:", error);
      }
    } else {
      console.error(
        "No Ethereum browser extension detected. Install MetaMask or another wallet."
      );
    }
  };

  useEffect(() => {
    getAllConnectedWallets();
  }, []);

  const providerInfo = getProviderInfo();
  // console.log(allAccounts, "allAccounts");

  return (
    isOpen && (
      <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div
          className={`absolute inset-0 bg-[#14213d] border-t border-white border-opacity-5 rounded-md shadow-lg overflow-hidden transition-all duration-500 ease-out ${
            isOpen ? "popup-enter" : "popup-exit"
          }`}
        >
          <div className="h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-[#9fa9c4]">Send To</h2>
              <button
                onClick={onClose}
                className="text-[#9fa9c4] hover:text-white cursor-pointer text-lg md:text-2xl"
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <input
                type="text"
                placeholder="Send Address"
                onChange={(e) => setSendToAdress(e.target.value)}
                className="bg-[#111c36] rounded-md w-[100%] p-3 placeholder:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#e32474]"
              />
            </div>
            {isConnected ? null : (
              <div className="flex justify-center">
                <div className="flex items-center space-x-5 bg-[#111c36] rounded-md py-5 px-4 w-full">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 md:gap-x-3 place-items-center">
                    <div className="bg-purple-600 py-2 px-3 rounded-md">
                      <GiRainbowStar className="text-white" />
                    </div>
                    <div className="bg-orange-500 py-2 px-3 rounded-md">
                      <FaBitcoin className="text-white" />
                    </div>
                    <div className="bg-blue-500 py-2 px-3 rounded-md">
                      <FaEthereum className="text-white" />
                    </div>
                    <div className="bg-green-500 py-2 px-3 rounded-md">
                      <IoMdAdd className="text-white" />
                    </div>
                  </div>
                  <div className="space-y-2 flex-grow">
                    <p className="text-[#9fa9c4] text-sm font-semibold">
                      Connect your wallet to select a destination address
                    </p>
                    <LayerSwapConnectButton />
                  </div>
                </div>
              </div>
            )}

            {/* show connected accounts whe user connected their account */}
            {isConnected ? (
              <>
                <div className="w-full">
                  <div className="w-full justify-between items-center flex text-[#abb5d1]">
                    <h1 className="font-semibold text-sm">Connected wallets</h1>
                    <div className="pr-4">
                      <p className="text-xs">Switch Wallet</p>
                    </div>
                  </div>
                  {allAccounts?.map((item, id) => (
                    <div
                      key={id}
                      role="button"
                      onClick={() => {
                        setSendToAdress(item);
                        setSendToAsset({
                          address: item,
                          provider: {
                            name: providerInfo.name,
                            logo: providerInfo.logo,
                          },
                        });
                        onClose();
                      }}
                      className="mt-4 w-full rounded-md p-4 bg-[#0F192F]"
                    >
                      <div className="object-cover flex justify-between items-center">
                        <div className="object-cover flex justify-start items-center gap-3">
                          <svg x="0" y="0" width="36" height="36">
                            <rect
                              x="0"
                              y="0"
                              width="36"
                              height="36"
                              transform="translate(-0.4367415021797976 10.60472137173113) rotate(134.3 18 18)"
                              fill="#235CE1"
                            ></rect>
                            <rect
                              x="0"
                              y="0"
                              width="36"
                              height="36"
                              transform="translate(14.2919515813395 13.447995448694392) rotate(82.7 18 18)"
                              fill="#034C5E"
                            ></rect>
                            <rect
                              x="0"
                              y="0"
                              width="36"
                              height="36"
                              transform="translate(32.81043444558547 -11.962667489383712) rotate(506.0 18 18)"
                              fill="#FA8100"
                            ></rect>
                          </svg>

                          <div>
                            <p className="text-sm font-bold text-white">
                              {shortenAddressSmall(item)}
                            </p>
                            <div className="flex justify-start items-center gap-2">
                              <Image
                                alt={connector?.name}
                                width={15}
                                height={15}
                                src={connector?.icon}
                              />
                              <p className="text-sm text-[#abb5d1]">
                                {connector.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <IoIosCheckmarkCircle
                          color="#ABB5D1"
                          className="text-[#ABB5D1]"
                          size={24}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    )
  );
};

export default TokenAddressPopup;
