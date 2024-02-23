import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import DepositModalComponent from "../DepositModal/Depositmodal";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import rexlogo from "../../assets/images/REX_Protocol_Full_Logo_lighter.png";
import rexsmall from "../../assets/images/rexsmall.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useNetwork,
  useContractRead,
  useContractWrite,
} from "wagmi";

export default function HeaderComponent() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldShowConnectWallet = (
      router.pathname === "/Dapp/ExchangePage" ||
      router.pathname === "/Marketplace/MarketPage" ||
      router.pathname === "/MarketItemInformation/Marketitem" ||
      router.pathname === "/PortfolioPage/Portfolio"
  );
  //{shouldShowConnectWallet && <ConnectWallet />}
//import { ConnectButton } from "@rainbow-me/rainbowkit";
  const onClickMenu = () => setMenuOpen(!menuOpen);

  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  let { chain } = useNetwork();
  let current_chain = chain?.id;


  return (
    <div className="fixed z-20 w-full">
      <div className="w-full bg-black px-4 flex items-center justify-between gap-7 py-3">
        <div className="flex pt-1 gap-7 items-center md:text-sm md:font-medium">
          <Link href="/">
            <a>
              <div className="cursor-pointer items-end hidden sm:flex">
                <Image
                  src={rexlogo}
                  alt="REX Protocol Logo"
                  height={40}
                  width={205}
                />
              </div>
              <div className="cursor-pointer items-end flex sm:hidden">
                <Image
                  src={rexsmall}
                  alt="REX Protocol Logo"
                  height={40}
                  width={34}
                />
              </div>
            </a>
          </Link>
          <Link href="/">
            <p
              className="lg:block hidden cursor-pointer block pr-4 pl-4 text-white rounded md:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white"
              aria-current="page"
            >
              Home
            </p>
          </Link>
          <Link href="/HowItWorks/HowItWorksPage">
            <p className="lg:block hidden cursor-pointer block pr-4 pl-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              How It Works
            </p>
          </Link>
          <Link href="/AboutUs/AboutusPage">
            <p className="lg:block hidden cursor-pointer block pr-4 pl-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              About Us
            </p>
          </Link>
          <Link href="/MintingForm/MintingFormpage">
            <p className="lg:block hidden cursor-pointer block pr-3 pl-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              Property Tokenization
            </p>
          </Link>
          <Link href="/Marketplace/MarketPage">
            <p className="lg:block hidden cursor-pointer block pr-3 pl-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              Marketplace
            </p>
          </Link>
          <Link href="/Dapp/ExchangePage">
            <p className="lg:block hidden cursor-pointer block pr-4 pl-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              Exchange
            </p>
          </Link>
          <Link href="/ContactUs/ContactUsForm">
            <p className="lg:block hidden cursor-pointer block pr-3 pl-4 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              Contact Us
            </p>
          </Link>
          <Link href="/SignIn/SignInPage">
            <p className="lg:block hidden cursor-pointer block pr-3 pl-4 text-white rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              Sign In
            </p>
          </Link>
          <Link href="Exchange/RexExchange">
            <p className="lg:block hidden cursor-pointer block pr-3 pl-4 text-white rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              RexExchange
            </p>
          </Link>
        </div>
        <div className="flex gap-5">

          <ConnectButton/>
          
          {router.pathname === "/Dapp/ExchangePage" && (
            <DepositModalComponent />
          )}
          <img
            onClick={onClickMenu}
            className={`lg:hidden transition-all duration-300 cursor-pointer ${
              menuOpen ? "-rotate-90" : ""
            }`}
            height={40}
            width={40}
            src={"/menuiconwhite.png"}
          />
          <div
            className={`lg:hidden ${
              menuOpen ? "block" : "hidden"
            } flex flex-col gap-1 p-3 absolute top-[60px] items-end text-xl rounded-lg right-5 z-10 bg-black`}
          >
            <Link href="/">Home</Link>
            <Link href="/HowItWorks/HowItWorksPage">How It Works</Link>
            <Link href="/AboutUs/AboutusPage">About Us</Link>
            <Link href="/MintingForm/MintingFormpage">Property Tokenization</Link>
            <Link href="/Marketplace/MarketPage">Marketplace</Link>
            <Link href="/Dapp/ExchangePage">Exchange</Link>
            <Link href="/ContactUs/ContactUsForm">Contact Us</Link>
            <Link href="/SignIn/SignInPage">Sign In</Link>
          </div>
        </div>
      </div>
      <div className="h-[4px] w-full bg-gradient-to-r from-[#FFFF00] to-[#00FFFF]"></div>
    </div>
  );
}
