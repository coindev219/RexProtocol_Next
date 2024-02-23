import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";

import { Web3Provider } from "@ethersproject/providers";
import MarketContextProvider from "../context/MarketContext";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import OrderbookContextProvider from "../context/OrderbookContext";
import '@rainbow-me/rainbowkit/styles.css';
import { infuraProvider } from 'wagmi/providers/infura';
import { darkTheme, getDefaultWallets, midnightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig, useAccount } from 'wagmi';
import {
  polygonMumbai
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [

    polygonMumbai,
  ],
  [publicProvider()]
);


const { connectors } = getDefaultWallets({
  appName: 'REX Protocol',
  projectId: "d9b2fa29275f5e0f4b14fd4bb8d2e236", // to do move to .env
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

interface RexAppProps extends AppProps {
  session: Session;
}
// <SessionProvider session={session}>   </SessionProvider>
function MyApp({ Component, pageProps, session }: RexAppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor:
            "linear-gradient(135deg, #131313 0%, #2A2A2A 27%, #060606 100%);",
          accentColorForeground: "white",
          borderRadius: "large",
          fontStack: "system",
          overlayBlur: "small",
        })}
        chains={chains}
      >
        <SessionProvider session={session}>
          <OrderbookContextProvider>
            <MarketContextProvider>
              <Component {...pageProps} />
            </MarketContextProvider>
          </OrderbookContextProvider>
        </SessionProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
