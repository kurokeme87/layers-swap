"use client";

import React, { createContext, useState, useContext } from "react";

// created a context for managing token selection and search states
const TokenContext = createContext();

export const useTokenContext = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  // State for selected "from" and "to" tokens
  const [selectedFromToken, setSelectedFromToken] = useState(null);
  const [selectedFromTokenIcon, setSelectedFromTokenIcon] = useState(null);
  const [selectedToToken, setSelectedToToken] = useState(null);
  const [selectedToTokenIcon, setSelectedToTokenIcon] = useState(null);
  const [sendToAdress, setSendToAdress] = useState(null);
  const [sendToAsset, setSendToAsset] = useState(null);
  const [isCompleteSwapModal, setIsCompleteSwapModal] = useState(false);

  // state to manage whether the popups are open or closed
  const [isFromSearchOpen, setIsFromSearchOpen] = useState(false);
  const [isToSearchOpen, setIsToSearchOpen] = useState(false);

  // state for search input terms
  const [fromSearchTerm, setFromSearchTerm] = useState("");
  const [toSearchTerm, setToSearchTerm] = useState("");

  const value = {
    selectedFromToken,
    setSelectedFromToken,
    selectedToToken,
    setSelectedToToken,
    isFromSearchOpen,
    setIsFromSearchOpen,
    isToSearchOpen,
    setIsToSearchOpen,
    fromSearchTerm,
    setFromSearchTerm,
    toSearchTerm,
    setToSearchTerm,
    selectedFromTokenIcon,
    setSelectedFromTokenIcon,
    selectedToTokenIcon,
    setSelectedToTokenIcon,
    sendToAdress,
    setSendToAdress,
    sendToAsset,
    setSendToAsset,
    isCompleteSwapModal,
    setIsCompleteSwapModal,
  };

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};
