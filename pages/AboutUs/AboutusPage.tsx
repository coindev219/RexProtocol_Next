import React, { useEffect } from "react";
import Image from "next/image";
import city from "../../assets/images/city.jpeg";
import ScrollpositionAnimation from "../../hooks/OnScroll";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";

export default function Aboutus() {
  return (
    <>
      <HeaderComponent></HeaderComponent>
      <div
        className={"bg-black bg-no-repeat bg-cover bg-center bg-fixed"}
      >
        <div className="flex flex-col text-center w-full justify-center">
        <div className="w-fit h-fit mt-36 m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
            <h1 className="text-5xl py-8  bg-black font-extrabold tracking-tight leading-none text-white-900 md:text-5xl lg:text-6xl dark:text-white">
              About Us
            </h1>

            <p className="text-lg text-justify font-normal text-white-500 py-5 md:px-10 px-4 bg-black lg:text-xl  dark:text-white-400">
              For hundreds of years, real estate has been a primary hedge against
              inflation in every market across the world. However, getting into
              real estate has also always had a high entry cost, forbidding many
              from being able to enter. Additionally, liquidity has also always
              been a significant challenge within the market. Our primary
              objective here at REX is to bring to accessibility and liquidity to
              the real estate market. We are doing this by bringing you the first
              truly fractionalized real estate tokenization and cryptocurrency
              exchange platform to your hands. Our team is composed of real
              estate, crypto, and finance professionals with a vision. Coming from
              all over the world with decades of experience in our respective
              fields, we have joined forces to solve this centuries old problem in
              a legal and efficient manner.
            </p>
          </div>
        </div>
        <div className="sm:items-center md:items-stretch flex space-y-8  my-10 js-show-on-scroll justify-between flex-col ... ">
          <div className="flex justify-between flex-col md:flex-row ...">
          <div className="w-fit h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
            <div className="p-6 max-w-sm bg-black  shadow-md dark:bg-gray-800 dark:border-gray-700">
              <svg
                className="mb-2 w-10 h-10 text-white "
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                ></path>
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
              </svg>
              <a href="#">
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white dark:text-white">
                  Security
                </h5>
              </a>
              <p className="mb-3 font-normal text-white dark:text-gray-400">
                The REX Exchange will be a decentralized exchange, meaning that
                once launched the code cannot be altered. We will be conducting
                full security audits of the code before launch to mitigate any
                risks.
              </p>
            </div>
            </div>
            <div className="w-fit h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
            <div className="max-w-sm  p-6 bg-black shadow-md dark:bg-gray-800 dark:border-gray-700">
              <svg
                className="mb-2 w-10 h-10 text-white dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                ></path>
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
              </svg>
              <a href="#">
                <h5 className="mb-3 text-2xl font-semibold tracking-tight text-white dark:text-white">
                  Compliance
                </h5>
              </a>
              <p className="mb-8 font-normal text-white dark:text-gray-400">
                Our Chief Compliance Officer has enacted standard KYC/AML
                procedures not only to comply with laws and regulations, but
                also to verify each individual tokenized property
              </p>
            </div>
            </div>
            <div className="w-fit h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
            <div className="max-w-sm p-7 bg-black shadow-md dark:bg-gray-800 dark:border-gray-700">
              <svg
                className="mb-2 w-10 h-10 text-white"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                ></path>
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
              </svg>
              <a href="#">
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white dark:text-white">
                  Expansion
                </h5>
              </a>
              <p className="mb-1 font-normal text-white dark:text-grey-400">
                Not only do we aim to provide a tokenized real estate exchange
                on a global level, we aim to provide tokenized real estate
                services on every industry level through vertical integration
              </p>
            </div>
            </div>
          </div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    </>
  );
}
