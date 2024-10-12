import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { RiWallet3Line } from "react-icons/ri";
import useApp from "../../hooks/useApp";

const LayerSwapConnectButton = ({ component }) => {
  const { setDisplayBalance } = useApp();
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

        useEffect(() => {
          // if (mounted) {
          setDisplayBalance(account.displayBalance);
          // }
        }, [mounted]);
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
                  <button
                    onClick={openConnectModal}
                    className="bg-[#381836] w-full text-sm tracking-wide text-center rounded-md font-semibold text-[#e32474] p-2"
                  >
                    Connect Now
                  </button>
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
