import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "./context";
import WagmiRainbowKitProvider from "./components/Providers/WagmiRainbowKitProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "./components/Providers/AppProviders";

export const metadata = {
  title: "layerswap",
  description:
    "Layerswap is a reliable solution for transferring crypto assets across various blockchains and Centralized Exchanges in a matter of minutes.",
  keywords: "layerswap, layer swap",
};

export default function RootLayout({ children }) {
  const cookies = headers().get("cookie");
  return (
    <html lang="en">
      <body>
        <WagmiRainbowKitProvider>
          <ToastContainer
            autoClose={2000}
            hideProgressBar={true}
            theme="colored"
          />
          <AppProvider>
            <ContextProvider cookies={cookies}>{children}</ContextProvider>
          </AppProvider>
        </WagmiRainbowKitProvider>
      </body>
    </html>
  );
}
