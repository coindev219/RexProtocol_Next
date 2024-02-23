import React, { useEffect, useState } from "react";
import "tailwindcss-elevation";
import { useAccount } from "wagmi";

type Props = {
	propertyName: string;
	propertyInformation: any;
  formattedMarketCap: string;
  formattedNOI: string;
  capRate: number
};

export default function PropertyInfoBox(props: Props) {

  const {
    propertyName,
    propertyInformation,
    formattedMarketCap,
    formattedNOI,
    capRate
  } = props;

  //web3 states
  const { address } = useAccount();

  return (
    <div className="flex bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] p-1 rounded-lg w-112 h-fit ">
      <div className="rounded-lg text-center bg-black min-h-[550px] w-112 px-3">
        <h5 className="text-2xl font-bold text-white">Property Information</h5>
        <ul className="mt-10 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl text-left">
          <li>
            <strong>Name:</strong> {propertyName}
          </li>
          <li>
            <strong>Address:</strong> {propertyInformation.address}
          </li>
          <li>
            <strong>Property Type:</strong> {propertyInformation.type}
          </li>
          <li>
            <strong>Market Cap:</strong>

            {!address
              ? " Please connect wallet to view"
              : "\u00A0" + formattedMarketCap}
          </li>
          <li>
            <strong>CAP Rate:</strong>
            {!address
              ? "Please connect wallet to view"
              : ` ${capRate.toFixed(2)}%`}
          </li>
          <li>
            <strong>NOI:</strong> ${formattedNOI}
          </li>
        </ul>
      </div>
    </div>
  );
}
