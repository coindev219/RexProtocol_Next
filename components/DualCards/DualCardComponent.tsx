import "tailwindcss-elevation";
import React, { useEffect, useState } from "react";
import { animated } from "react-spring";
import { useSpring } from "react-spring/web";
import ScrollpositionAnimation from "../../hooks/OnScroll";
export default function DualCardComponent() {
  return (
    <div>
      <div className="flex space-y-4 my-20 justify-around flex-col">
      <div className="flex justify-around items-center flex-col lg:flex-row">
          <div className="relative max-w-sm w-full h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
            <div className="w-full h-72 p-4 text-center bg-black elevation-10">
              <a href="https://rex-protocol.gitbook.io/rex-protocol-public-docs/">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                  Why Invest in Real Estate?
                </h5>
              </a>
              <ul className="mb-2 md:js-show-on-scroll-left px-2 text-lg font-normal self-center text-white lg:text-xl sm:px-6 text-left list-disc">
                <li>Powerful hedge against inflation</li>
                <li>Provides a steady flow of passive income</li>
                <li>Perpetually diminishing land supply</li>

              </ul>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <a
                  href="https://rex-protocol.gitbook.io/rex-protocol-public-docs/"
                  className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-black bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    aria-hidden="true"
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="relative max-w-sm w-full h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
            <div className="p-4 h-72 text-center w-full bg-black elevation-10">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                  REX is Removing <br /> Barriers to Entry
                </h5>
              </a>
              <ul className="mb-2  md:js-show-on-scroll-left px-2 text-lg font-normal self-center text-white lg:text-xl sm:px-6 text-left list-disc">
                <li>No more capital constraints</li>
                <li>No more geographic boundaries</li>
                <li>No more lack of liquidity</li>
              </ul>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <a
                  href="#"
                  className="inline-flex py-2 px-3 text-sm font-medium text-center text-black bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    aria-hidden="true"
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="relative max-w-sm w-full h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
            <div className="w-full p-4 px-5 h-72 text-center bg-black elevation-10">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold text-white">
                  Can I Tokenize My Property?
                </h5>
              </a>
              <ol className="mb-4  md:js-show-on-scroll-left px-2 text-lg font-normal self-center text-white lg:text-xl sm:px-6 text-left list-decimal">
                <li>Submit property info</li>
                <li>Tie real estate to tokens</li>
                <li>No more lack of liquidity</li>

              </ol>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <a
                  href="/MintingForm/MintingFormpage"
                  className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-black bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    aria-hidden="true"
                    className="ml-2 -mr-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
