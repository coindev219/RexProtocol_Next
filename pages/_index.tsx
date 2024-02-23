import "tailwindcss-elevation";
import type { NextPage } from "next";
import HeaderComponent from "../components/Header/HeaderComponent";
import FooterComponent from "../components/Footer/FooterComponent";
import Link from "next/link";
import DualCardComponent from "../components/DualCards/DualCardComponent";
const Home: NextPage = () => {
  return (
    <div className="bg-black">
      <HeaderComponent />

      <div className="w-full">
        <div className="z-10 mt-80 2xl:mt-112 pl-5 w-full px-5 flex flex-col items-center lg:items-start absolute lg:pl-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl z-10">
            REX Protocol
          </h1>
          <p className="ml-10 z-10">
            Bringing liquidity and accessibility to real estate via web3
          </p>
          <div className="mt-8 ml-8 md:mt-8 flex sm:flex-row flex-col gap-7">
            <Link href="/Dapp/ExchangePage">
              <div className="flex w-48 items-center elevation-10 justify-center rounded-md border  bg-gradient-to-r  from-[#FFFF00] to-[#00FFFF] py-3 text-base font-medium text-gray-700 hover:bg-transparent hover:border-white md:py-3  md:text-lg">
                Exchange
              </div>
            </Link>
            <Link href="/MintingForm/MintingFormpage">
              <div className="flex w-48 items-center elevation-10 justify-center rounded-md border border-white bg-transparent hover:bg-gradient-to-r  from-[#FFFF00] to-[#00FFFF]  hover:text-gray-700 py-3 text-base font-medium text-white md:py-3  md:text-lg">
                Tokenize My Property
              </div>
            </Link>
          </div>
        </div>
        <div className="w-full h-screen overflow-hidden">
          <video
            className="min-w-full max-w-none"
            playsInline
            autoPlay
            loop
            muted
          >
            <source src="/video.mp4" type="video/mp4" /> Your browser does not
            support the video tag, update your browser
          </video>
        </div>
        <div className="mt-20 px-5">
          <DualCardComponent></DualCardComponent>
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default Home;

//tokenize my protpery
//exchange
//<footer className={styles.footer}>

//          <span className={styles.logo}>
//<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
//</span>
/*
       <div className="relative z-10 bg-zinc-100 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
              <div>
                <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
                  <nav
                    className="relative flex items-center justify-between sm:h-10 lg:justify-start"
                    aria-label="Global"
                  >
                    <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
                      <div className="flex w-full items-center justify-between md:w-auto">
                        <a href="#">
                          <span className="sr-only">Your Company</span>
                          <video
                            ref={videoRef}
                            className="min-w-full min-h-full absolute object-cover"
                            playsInline
                            controls
                            muted
                          >
                            <source src="/video.mp4" type="video/mp4" /> Your
                            browser does not support the video tag, update your
                            browser
                          </video>
                          <Image
                            alt="Your Company"
                            className="h-8 w-auto sm:h-10"
                            src={rexsmall}
                            height={70}
                            width={60}
                          />
                        </a>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>



*/
