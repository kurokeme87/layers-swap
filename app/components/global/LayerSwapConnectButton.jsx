import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
// import { RiWallet3Line } from "react-icons/ri";
// import useApp from "../../hooks/useApp";

const LayerSwapConnectButton = ({ component, connect, isWithAccount }) => {
  // const { setDisplayBalance } = useApp();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            role="button"
            onClick={connected ? null : openConnectModal}
            // className="bg-[#381836] w-[94%] px-4 py-2 rounded-lg flex items-center mx-auto justify-between cursor-pointer"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div
                    role="button"
                    className="w-full"
                    onClick={isWithAccount ? openConnectModal : null}
                  >
                    {connect}
                  </div>
                );
              }
              if (connected) {
                return (
                  <div role="button" onClick={openAccountModal}>
                    {component}
                  </div>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return null;
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default LayerSwapConnectButton;
