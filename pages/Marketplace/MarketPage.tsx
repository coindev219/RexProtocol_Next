import React, { useEffect } from "react";

import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";

import MarketPlaceComponent from "../../components/Market/MarketPageComponent";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MintingFormPage() {
  const { data: session } = useSession();
  return (
    <>
      <HeaderComponent></HeaderComponent>
      <div className={"bg-black bg-no-repeat bg-cover bg-center bg-fixed"}>
        <div className="flex flex-col text-center justify-center">
          
            <MarketPlaceComponent />
      {/*}
            <>
              <div className="text-white text-3xl h-screen flex flex-col justify-center items-center">
                <h1>
                You must be signed in to view this page
                </h1>
                <div className="rounded-md shadow m-5 ">
                  <Link href="/SignIn/SignInPage">
                    <a className="flex w-48 items-center hover:scale-105 elevation-10 justify-center rounded-md border  bg-gradient-to-r  from-[#FFFF00] to-[#00FFFF] py-3 text-base font-medium text-gray-700 hover:bg-transparent hover:border-white md:py-4  md:text-lg">
                      Sign In
                    </a>
                  </Link>
                </div>
              </div>
            </>
  */}
        </div>
        <FooterComponent></FooterComponent>
      </div>
    </>
  );
}
