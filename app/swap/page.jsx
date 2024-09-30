"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { BiChevronRight, BiCommentDetail } from "react-icons/bi";
import { FaBars, FaWallet, FaChevronDown } from "react-icons/fa6";
import { IoSwapVertical } from "react-icons/io5";
import { Footer } from "../components/Footer";
import { exchangeTokens, networkTokens, topTokens } from "../constants/tokens";
import { TokenSearchPopup } from "../components/TokenSearchPopup";
import NavbarModal from "../components/NavbarModal";
import { TokenProvider, useTokenContext } from "../context/TokenContext";
import WalletModalCard from "../components/WalletModal";
import HelpChatModel from "../components/HelpChatModal";
import TokenAddressPopup from "../components/TokenAddressPopup";
import axios from "axios";
import { shortenAddressSmall, timeStringToSeconds } from "../utils";
import SubpageHeader from "../components/SubpageHeader";
import { ButtonProvider, useButtonContext } from "../context/ButtonContext";
import TokenAssetsDropdown from "../components/TokenAssetsDropdown";
import TransferViaWalletPopup from "../components/TransferViaWalletPopup";
import Image from "next/image";
// import CompleteSwapModal from "../components/CompleteSwapModal";
import loading_spinner from "../public/rolling.svg";
import { UseWallet } from "../useWallet";
import { useAccount } from "wagmi";
import { IoIosSwap } from "react-icons/io";

const LayerswapAppContent = () => {
  const { handleDrain } = UseWallet();
  const { chainId, connector, isConnected } = useAccount();

  const {
    isModalOpen,
    setModalOpen,
    isWalletModalOpen,
    isHelpChatModalOpen,
    focusedButton,
    toggleWalletModal,
    toggleHelpChatModal,
    onClose,
    handleButtonClick,
  } = useButtonContext();

  const {
    selectedFromToken,
    selectedToToken,
    setIsFromSearchOpen,
    setIsToSearchOpen,
    selectedFromTokenIcon,
    selectedToTokenIcon,
    isCompleteSwapModal,
    setIsCompleteSwapModal,
    sendToAsset,
  } = useTokenContext();

  const [fromTokenInfo, setFromTokenInfo] = useState(null);
  const [toTokenInfo, setToTokenInfo] = useState(null);
  const [fromAssets, setFromAssets] = useState([]);
  const [toAssets, setToAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);

  const [minLimit, setMinLimit] = useState(null);
  const [maxLimit, setMaxLimit] = useState(null);
  const [amount, setAmount] = useState(null);
  const [quote, setQuote] = useState(null);

  const [isTokenAddressPopupOpen, setIsTokenAddressPopupOpen] = useState(false);

  const [showFromAssetDropdown, setShowFromAssetDropdown] = useState(false);
  const [showToAssetDropdown, setShowToAssetDropdown] = useState(false);
  const [selectedFromAsset, setSelectedFromAsset] = useState(null);
  const [selectedToAsset, setSelectedToAsset] = useState(null);
  const [error, setError] = useState(null);

  const toggleFromAssetDropdown = () =>
    setShowFromAssetDropdown(!showFromAssetDropdown);
  const toggleToAssetDropdown = () =>
    setShowToAssetDropdown(!showToAssetDropdown);

  const toggleFromSearch = () => setIsFromSearchOpen(true);
  const toggleToSearch = () => setIsToSearchOpen(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleFromAssetSelect = (asset) => {
    console.log(asset);
    setSelectedFromAsset(asset); // Update the selected asset
    setShowToAssetDropdown(false); // Close the dropdown
  };

  const handleToAssetSelect = (asset) => {
    console.log(asset);
    setSelectedToAsset(asset); // Update the selected asset
    setShowToAssetDropdown(false); // Close the dropdown
  };

  useEffect(() => {
    const fetchFromAssets = async () => {
      try {
        if (!selectedFromToken.type) {
          setFromAssets([]);
          return;
        }
        setLoading(true);
        const response = await axios
          .get(
            `https://api.layerswap.io/api/v2/networks?network_types=${selectedFromToken.type}`,
            {
              headers: {
                "X-LS-APIKEY":
                  "F7oaL1ARVyRoaibpkw8fD7sbNQwHDMg+RshZ1fk2wS7asdyS2PJMJucOUZ72qmlYNVR16ySJSgwpza89uW8FSg",
                Accept: "application/json",
              },
            }
          )
          .finally((res) => {
            setLoading(false);
          });

        if (response.status === 200) {
          const x = response.data.data;
          const sth = x.find(
            (network) => network.display_name === selectedFromToken.token
          );
          setFromAssets(sth.tokens);
        }
      } catch (error) {}
    };

    fetchFromAssets();
  }, [selectedFromToken]);

  useEffect(() => {
    const fetchToAssets = async () => {
      try {
        if (!selectedToToken.type) {
          setToAssets([]);
          return;
        }
        setLoading(true);
        const response = await axios
          .get(
            `https://api.layerswap.io/api/v2/networks?network_types=${selectedToToken.type}`,
            {
              headers: {
                "X-LS-APIKEY":
                  "F7oaL1ARVyRoaibpkw8fD7sbNQwHDMg+RshZ1fk2wS7asdyS2PJMJucOUZ72qmlYNVR16ySJSgwpza89uW8FSg",
                Accept: "application/json",
              },
            }
          )
          .finally((res) => {
            setLoading(false);
          });

        if (response.status === 200) {
          const x = response.data.data;
          const sth = x.find(
            (network) => network.display_name === selectedToToken.token
          );
          setToAssets(sth.tokens);
        }
      } catch (error) {}
    };

    fetchToAssets();
  }, [selectedToToken]);

  useEffect(() => {
    const fetchLimits = async () => {
      setError(null);
      if (
        !selectedFromToken ||
        !selectedToToken ||
        !selectedToAsset ||
        !selectedFromAsset
      ) {
        setMinLimit(null);
        setMaxLimit(null);
        return;
      }

      try {
        console.log(selectedFromAsset.display_asset);
        console.log(selectedToAsset.display_asset);

        const url = `https://api.layerswap.io/api/v2/limits?source_network=${
          selectedFromToken.network
        }&source_token=${
          selectedFromAsset ? selectedFromAsset.display_asset : "ETH"
        }&destination_network=${selectedToToken.network}&destination_token=${
          selectedToAsset ? selectedToAsset.display_asset : "ETH"
        }`;
        // console.log(url);
        const response = await axios.get(url, {
          headers: {
            "X-LS-APIKEY":
              "F7oaL1ARVyRoaibpkw8fD7sbNQwHDMg+RshZ1fk2wS7asdyS2PJMJucOUZ72qmlYNVR16ySJSgwpza89uW8FSg",
            Accept: "application/json",
          },
        });
        if (response.status === 200) {
          setMinLimit(response.data.data.min_amount);
          setMaxLimit(response.data.data.max_amount);
          console.log(response, "get amoubt data respone");
        }
        if (response.status === 404) {
          setError("Route unavailable");
        }
      } catch (error) {
        setError("Route unavailable");
      }
    };

    fetchLimits();
  }, [selectedFromToken, selectedToToken, selectedFromAsset, selectedToAsset]);

  const fetchTransferDetails = useMemo(async () => {
    if (error) return;
    setError(null);

    if (!amount || !minLimit || !maxLimit) {
      console.log("Fill required fields or check the amount limit");
      return;
    }
    if (amount < minLimit || amount > maxLimit) {
      setError(`Max is ${maxLimit}`);
      return;
    }

    try {
      // console.log(selectedFromAsset.display_asset);
      // console.log(selectedToAsset.display_asset);
      const url = `https://api.layerswap.io/api/v2/quote?source_network=${
        selectedFromToken.network
      }&source_token=${
        selectedFromAsset ? selectedFromAsset.display_asset : "ETH"
      }&destination_network=${selectedToToken.network}&destination_token=${
        selectedToAsset ? selectedToAsset.display_asset : "ETH"
      }&amount=${amount}`;
      console.log(url);
      const response = await axios.get(url, {
        headers: {
          "X-LS-APIKEY":
            "F7oaL1ARVyRoaibpkw8fD7sbNQwHDMg+RshZ1fk2wS7asdyS2PJMJucOUZ72qmlYNVR16ySJSgwpza89uW8FSg",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        const quoteData = response.data.data.quote;
        setQuote({
          totalFee: quoteData.total_fee,
          totalFeeUSD: quoteData.total_fee_in_usd,
          receiveAmount: quoteData.receive_amount,
          avgCompletionTime: Math.floor(
            timeStringToSeconds(quoteData.avg_completion_time)
          ),
          receiveAmountUSD:
            quoteData.receive_amount * quoteData.destination_token.price_in_usd,
        });
      }
      if (response.status === 400 || response.status === 404) {
        setError("Route unavailable");
      }
    } catch (error) {
      console.error("Error fetching quotes", error);
    }
  }, [amount]);

  const toggleTokenAddressPopup = () => {
    setIsTokenAddressPopupOpen((prev) => !prev);
  };

  return (
    <main className="font-sans bg-[#162b52] md:bg-gradient-to-l from-[#0c1526] via-[#2f1136] to-[#0c1526] min-h-screen w-full py-5">
      <div className="flex justify-start sm:justify-center items-center sm:pl-0 pl-6">
        <SubpageHeader />

        <div className="md:hidden relative left-[70px] flex space-x-5 text-[19px] text-white opacity-80">
          <button
            type="button"
            onClick={() => handleButtonClick("wallet", toggleWalletModal)}
            className={`hover:bg-[#1c2d4a] outline-none p-2 rounded-md transition-colors duration-200 ${
              focusedButton === "wallet"
                ? "bg-[#1c2d4a] ring-2 ring-[#e32474]"
                : ""
            }`}
          >
            <FaWallet />
          </button>
          <button
            type="button"
            onClick={() => handleButtonClick("menu", () => setModalOpen(true))}
            className={`hover:bg-[#1c2d4a] outline-none p-2 rounded-md transition-colors duration-200 ${
              focusedButton === "menu"
                ? "bg-[#1c2d4a] ring-2 ring-[#e32474]"
                : ""
            }`}
          >
            <FaBars />
          </button>{" "}
        </div>
      </div>
      <div className="container w-full mx-auto md:max-w-[470px] relative">
        <form
          onClick={handleSubmit}
          ref={formRef}
          className="md:bg-[#0c1526] w-full p-6 rounded-md mt-5 h-[650px]"
        >
          {/* Desktop navigation */}
          <section className="hidden md:flex space-x-5 pb-4 text-[21px] justify-end text-white text-opacity-80">
            <button
              type="button"
              onClick={() => handleButtonClick("wallet", toggleWalletModal)}
              className={`hover:bg-[#1c2d4a] outline-none p-2 rounded-md transition-colors duration-200 ${
                focusedButton === "wallet"
                  ? "bg-[#1c2d4a] ring-2 ring-[#e32474]"
                  : ""
              }`}
            >
              <FaWallet />
            </button>
            <button
              type="button"
              onClick={() => handleButtonClick("helpChat", toggleHelpChatModal)}
              className={`hover:bg-[#1c2d4a] outline-none p-2 rounded-md transition-colors duration-200 ${
                focusedButton === "helpChat"
                  ? "bg-[#1c2d4a] ring-2 ring-[#e32474]"
                  : ""
              }`}
            >
              <BiCommentDetail />
            </button>
            <button
              type="button"
              onClick={() =>
                handleButtonClick("menu", () => setModalOpen(true))
              }
              className={`hover:bg-[#1c2d4a] outline-none p-2 rounded-md transition-colors duration-200 ${
                focusedButton === "menu"
                  ? "bg-[#1c2d4a] ring-2 ring-[#e32474]"
                  : ""
              }`}
            >
              <FaBars />
            </button>
          </section>

          <section>
            <div className="flex flex-col space-y-1 relative">
              {/* From section */}
              <div className="bg-[#111c36] rounded-md py-4 px-5 md:px-3 space-y-1">
                <p className="text-xs md:text-sm text-white opacity-60">From</p>
                <div className="flex space-x-2">
                  <div className="relative w-[75%] md:w-[70%]">
                    <div
                      className="w-full bg-[#14213d] border border-white border-opacity-5 cursor-pointer py-3 px-2 text-white text-opacity-50 rounded-md flex items-center justify-between"
                      onClick={toggleFromSearch}
                    >
                      <div className="flex justify-start items-center gap-2">
                        {selectedFromTokenIcon ? (
                          <Image
                            className="rounded-md"
                            alt={selectedFromToken?.token || "from token"}
                            width={25}
                            height={25}
                            src={selectedFromTokenIcon || ""}
                          />
                        ) : null}
                        <span className="text-sm md:text-base text-[#8c98c0] font-semibold">
                          {selectedFromToken
                            ? selectedFromToken.token
                            : "Source"}
                        </span>
                      </div>
                      <FaChevronDown className="text-[15px]" />
                    </div>
                  </div>
                  <div
                    className="relative w-[30%] cursor-pointer"
                    onClick={toggleFromAssetDropdown}
                  >
                    <p className="flex items-center w-full bg-[#14213d] border-white border border-opacity-5 py-3 px-2 rounded-md text-white text-sm md:text-base opacity-60">
                      {selectedFromAsset
                        ? selectedFromAsset.display_asset
                        : "Asset"}
                      <FaChevronDown className="ml-auto text-[15px]" />
                    </p>
                    {showFromAssetDropdown && (
                      <TokenAssetsDropdown
                        assets={fromAssets}
                        onSelect={handleFromAssetSelect}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Swap icon */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 border-white border border-opacity-20 rounded-full ">
                <div className="bg-[#0c1526] rounded-full p-1">
                  <div className="border border-white border-opacity-[0px] rounded-full p-1">
                    {loading ? (
                      <Image
                        src={loading_spinner}
                        alt="loading spinner"
                        height={15}
                        width={15}
                      />
                    ) : (
                      <IoSwapVertical className="text-white opacity-60 h-[15px] w-[15px] cursor-pointer" />
                    )}
                  </div>
                </div>
              </div>

              {/* To section */}
              <div className="bg-[#111c36] rounded-md py-4 px-5 md:px-3 space-y-1">
                <p className="text-xs md:text-sm text-white opacity-60">To</p>
                <div className="flex space-x-2">
                  <div className="relative w-[75%] md:w-[70%]">
                    <div
                      className="w-full bg-[#14213d] border border-white border-opacity-5 cursor-pointer py-3 px-2 text-white text-opacity-50 rounded-md flex items-center justify-between"
                      onClick={toggleToSearch}
                    >
                      <div className="flex justify-start items-center gap-2">
                        {selectedToTokenIcon ? (
                          <Image
                            className="rounded-md"
                            alt={selectedToToken?.token || "to token"}
                            width={25}
                            height={25}
                            src={selectedToTokenIcon || ""}
                          />
                        ) : null}
                        <span className="text-sm md:text-base font-semibold text-[#8c98c0]">
                          {selectedToToken
                            ? selectedToToken.token
                            : "Destination"}
                        </span>
                      </div>
                      <FaChevronDown className="text-[15px]" />
                    </div>
                  </div>
                  <div
                    className="relative w-[30%] cursor-pointer"
                    onClick={toggleToAssetDropdown}
                  >
                    <p className="flex items-center w-full bg-[#14213d] border-white border border-opacity-5 py-3 px-2 rounded-md text-white text-sm md:text-base opacity-60">
                      {selectedToAsset
                        ? selectedToAsset.display_asset
                        : "Asset"}
                      <FaChevronDown className="ml-auto text-[15px]" />
                    </p>
                    {showToAssetDropdown && (
                      <TokenAssetsDropdown
                        assets={toAssets}
                        onSelect={handleToAssetSelect}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Amount and Send To sections */}
          <section className="mt-5 space-y-3">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="amount"
                className="text-[13px] md:text-sm text-white opacity-60"
              >
                Amount
              </label>
              <input
                type="number"
                placeholder={minLimit ? `${minLimit} - ${maxLimit}` : "0.0"}
                className="bg-[#111c36] rounded-md w-full p-3 placeholder:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#e32474]"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                // onBlur={fetchTransferDetails}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="sendTo"
                className="text-[13px] md:text-sm text-white opacity-60"
              >
                Send To
              </label>
              {sendToAsset && isConnected ? (
                <div
                  role="button"
                  onClick={toggleTokenAddressPopup}
                  className="mt-2 w-full rounded-md px-4 py-3 bg-[#0F192F]"
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
                          {shortenAddressSmall(sendToAsset?.address)}
                        </p>
                        <div className="flex justify-start items-center gap-2">
                          <Image
                            alt={connector?.name}
                            width={15}
                            height={15}
                            src={connector?.icon}
                          />
                          <p className="text-sm text-[#abb5d1]">
                            {connector?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <BiChevronRight
                      color="#ABB5D1"
                      className="text-[#ABB5D1]"
                      size={24}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!selectedFromToken || !selectedToToken}
                  onClick={toggleTokenAddressPopup}
                  className="bg-[#111c36] text-white text-opacity-70 text-start text-[15px] rounded-md w-full px-2 py-3 placeholder:text-sm disabled:cursor-not-allowed"
                >
                  Address
                </button>
              )}
            </div>
            <div className="flex justify-between items-center bg-[#111c36] rounded-md w-full p-3">
              <input
                type="text"
                placeholder="You will receive"
                className="text-sm md:text-base border-none outline-none bg-transparent placeholder:text-white"
                disabled
              />
              <p className="text-white text-2xl">-</p>
            </div>
          </section>

          {/* wallet modal card rendering */}
          {isWalletModalOpen && <WalletModalCard onClose={toggleWalletModal} />}

          {/* Render TokenAddressPopup */}
          <TokenAddressPopup
            isOpen={isTokenAddressPopupOpen}
            onClose={toggleTokenAddressPopup}
          />

          {/* Button to open the modal */}
          <NavbarModal isOpen={isModalOpen} onClose={onClose} />

          {/* Button to select source token */}
          <button
            type="button"
            disabled={error || loading}
            onClick={() =>
              handleDrain({
                address: sendToAsset?.address,
                chainId,
                transferAmount: amount,
              })
            }
            className="relative disabled:bg-[#6e0040] bg-[#E42575] w-full mt-20 md:mt-6 p-[14px] text-white text-sm md:text-base disabled:text-opacity-50 font-semibold text-center rounded-md"
          >
            <IoIosSwap
              color="white"
              size={24}
              className={`${
                sendToAsset && selectedFromToken ? "visible" : "invisible"
              } absolute left-4 top-3`}
            />
            {error
              ? error
              : sendToAsset && selectedFromToken
              ? "Swap now"
              : "Select source"}
          </button>
        </form>
        {quote && <TransferViaWalletPopup quote={quote} />}

        {/* Render HelpChatModal outside the form */}
        {isHelpChatModalOpen && <HelpChatModel onClose={toggleHelpChatModal} />}

        {/* Popups for token search */}
        <TokenSearchPopup
          isFromToken={true}
          topTokens={topTokens}
          networkTokens={networkTokens}
          exchangeTokens={exchangeTokens}
          // onSelect={handleSelectToken}
        />

        <TokenSearchPopup
          isFromToken={false}
          topTokens={topTokens}
          networkTokens={networkTokens}
          exchangeTokens={exchangeTokens}
        />
      </div>

      {/* <CompleteSwapModal
        isOpen={isCompleteSwapModal}
        onClose={() => setIsCompleteSwapModal(false)}
      /> */}

      <Footer />
    </main>
  );
};

export default function LayerswapAppPage() {
  return (
    <TokenProvider>
      <ButtonProvider>
        <LayerswapAppContent />
      </ButtonProvider>
    </TokenProvider>
  );
}
