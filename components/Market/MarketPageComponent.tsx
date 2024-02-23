import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";
import FetchPropertyInformation from "../../data/Marketinformation";

export default function MarketPlaceComponent() {
  const { setItemId } = useContext(MarketContext);
  const handleClick = (item: number) => {
    // console.log(item);
    setItemId(item);
  };

  let propertyNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
  let PropertyImageArray: any = [];
  let PropertyNameArray: any = [];
  let PropertySummaryArray: any = [];
  const [propertyImageArray, setPropertyImageArray] = useState<any[]>([]);
  const [propertyNameArray, setPropertyNameArray] = useState<any[]>([]);
  const [propertySummaryArray, setPropertySummaryArray] = useState<any[]>([]);

  //Get Images
  useEffect(() => {
    Promise.all(
      propertyNumbers.map((number) => FetchPropertyInformation(number))
    )
      .then((propertyInfoArray) => {
        PropertyImageArray = propertyInfoArray.map((info) => info.picture1);
        // console.log(PropertyImageArray);
        setPropertyImageArray(PropertyImageArray);
        // Any other logic you want to perform with PropertyImageArray
      })
      .catch((error) => {
        // Handle error
      });
  }, []);

  //Get Names
  useEffect(() => {
    Promise.all(
      propertyNumbers.map((number) => FetchPropertyInformation(number))
    )
      .then((propertyInfoArray) => {
        PropertyNameArray = propertyInfoArray.map((info) => info.name);
        // console.log(PropertyNameArray);
        setPropertyNameArray(PropertyNameArray);
        // Any other logic you want to perform with PropertyNameArray
      })
      .catch((error) => {
        // Handle error
      });
  }, []);

  //Get Summaries
  useEffect(() => {
    Promise.all(
      propertyNumbers.map((number) => FetchPropertyInformation(number))
    )
      .then((propertyInfoArray) => {
        PropertySummaryArray = propertyInfoArray.map((info) => info.executivesummary);
        // console.log(PropertySummaryArray);
        setPropertySummaryArray(PropertySummaryArray);
        // Any other logic you want to perform with PropertySummaryArray
      })
      .catch((error) => {
        // Handle error
      });

  }, []);


  //{propertySummaryArray[1].substr(0,140) + "..."}
  return (
    <>
      <div className="flex flex-col w-full items-center md:mt-20 text-center justify-center">
        <section className="bg-center w-full items-start bg-no-repeat lg:bg-cover bg-black bg-[url('/Marketplace.png')]  ">
          <div className="px-4 mx-auto w-full text-center py-48  lg:py-56">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              REX Protocol Marketplace
            </h1>

            <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
              {" "}
              Build your own real estate portfolio
            </p>
          </div>
        </section>

        <div className="flex flex-col w-full">
          <div className="flex flex-col lg:flex-row items-center mt-10 w-full text-center justify-around">
            <div className="max-w-sm flex flex-col m-3 text-center flex-1">
              <div className="relative w-fit h-fit m-0 md:m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
                <div className="pb-3" style={{ backgroundColor: "#000000" }}>
                  <div className="w-fit h-60 justify-center overflow-hidden item-center top-0">
                    <img
                      className=""
                      src={propertyImageArray[0]}
                      alt="Card Image"
                    />
                  </div>
                  <div className="px-10">
                    <h5 className="text-xl font-bold mb-7 tracking-tight text-white dark:text-white">
                      {propertyNameArray[0]}
                    </h5>
                    <p className="font-normal text-justify text-white dark:text-gray-400">
                      {propertySummaryArray &&
                        propertySummaryArray[0]?.substr(0, 140) + "..."}
                    </p>
                    <div className="flex justify-center mt-3">
                      <Link
                        href={{
                          pathname: "/MarketItemInformation/Marketitem",
                        }}
                      >
                        <div
                          onClick={() => handleClick(1)}
                          className="flex flex-row  justify-center items-center px-3 py-2 text-sm  font-medium text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Read more
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 ml-2 text-center -mr-1"
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
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-sm flex flex-col m-3 text-center flex-1">
              <div className="relative w-fit h-fit m-0 md:m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
                <div className="pb-3" style={{ backgroundColor: "#000000" }}>
                  <div className="w-fit h-60 justify-center overflow-hidden item-center top-0">
                    <img
                      className=""
                      src={propertyImageArray[1]}
                      alt="Card Image"
                    />
                  </div>
                  <div className="px-10">
                    <h5 className="text-xl font-bold mb-7 tracking-tight text-white dark:text-white">
                      {propertyNameArray[1]}
                    </h5>
                    <p className="font-normal text-justify text-white dark:text-gray-400">
                      {propertySummaryArray &&
                        propertySummaryArray[1]?.substr(0, 140) + "..."}
                    </p>
                    <div className="flex justify-center mt-3">
                      <Link
                        href={{
                          pathname: "/MarketItemInformation/Marketitem",
                        }}
                      >
                        <div
                          onClick={() => handleClick(2)}
                          className="flex flex-row justify-center items-center px-3 py-2 text-sm  font-medium text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Read more
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 ml-2 text-center -mr-1"
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
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-sm flex flex-col m-3 text-center flex-1">
              <div className="relative w-fit h-fit m-0 md:m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
                <div className="pb-3" style={{ backgroundColor: "#000000" }}>
                  <div className="w-fit h-60 justify-center overflow-hidden item-center top-0">
                    <img
                      className="h-60"
                      src={propertyImageArray[2]}
                      alt="Card Image"
                    />
                  </div>
                  <div className="px-10">
                    <h5 className="text-xl font-bold mb-7 tracking-tight text-white dark:text-white">
                      {propertyNameArray[2]}
                    </h5>
                    <p className="font-normal text-justify text-white dark:text-gray-400">
                      {propertySummaryArray &&
                        propertySummaryArray[2]?.substr(0, 140) + "..."}
                    </p>
                    <div className="flex justify-center mt-3">
                      <Link
                        href={{
                          pathname: "/MarketItemInformation/Marketitem",
                        }}
                      >
                        <div
                          onClick={() => handleClick(3)}
                          className="flex flex-row justify-center items-center px-3 py-2 text-sm  font-medium text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Read more
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 ml-2 text-center -mr-1"
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
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center mt-7 m-0 w-full text-center justify-around">
            <div className="max-w-sm flex flex-col m-3 text-center flex-1">
              <div className="relative w-fit h-fit m-0 md:m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
                <div className="pb-3" style={{ backgroundColor: "#000000" }}>
                  <div className="w-fit h-60 justify-center overflow-hidden item-center top-0">
                    <img
                      className="h-60"
                      src={propertyImageArray[3]}
                      alt="Card Image"
                    />
                  </div>
                  <div className="px-10">
                    <h5 className="text-xl font-bold mb-7 tracking-tight text-white dark:text-white">
                      {propertyNameArray[3]}
                    </h5>
                    <p className="font-normal text-justify text-white dark:text-gray-400">
                      {propertySummaryArray &&
                        propertySummaryArray[3]?.substr(0, 140) + "..."}
                    </p>
                    <div className="flex justify-center mt-3">
                      <Link
                        href={{
                          pathname: "/MarketItemInformation/Marketitem",
                        }}
                      >
                        <div
                          onClick={() => handleClick(4)}
                          className="flex flex-row justify-center items-center px-3 py-2 text-sm  font-medium text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Read more
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 ml-2 text-center -mr-1"
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
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-sm flex flex-col m-3 text-center flex-1">
              <div className="relative w-fit h-fit m-0 md:m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
                <div className="pb-3" style={{ backgroundColor: "#000000" }}>
                  <div className="w-fit h-60 justify-center overflow-hidden item-center top-0">
                    <img src={propertyImageArray[4]} alt="Card Image" />
                  </div>
                  <div className="px-10">
                    <h5 className="text-xl mb-7 font-bold tracking-tight text-white dark:text-white">
                      {propertyNameArray[4]}
                    </h5>
                    <p className="font-normal text-justify text-white dark:text-gray-400">
                      {propertySummaryArray &&
                        propertySummaryArray[4]?.substr(0, 140) + "..."}
                    </p>
                  </div>
                  <div className="flex justify-center mt-3">
                    <Link
                      href={{
                        pathname: "/MarketItemInformation/Marketitem",
                      }}
                    >
                      <div
                        onClick={() => handleClick(5)}
                        className="flex flex-row justify-center items-center px-3 py-2 text-sm  font-medium text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Read more
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 ml-2 text-center -mr-1"
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
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-sm flex flex-col m-3 text-center flex-1">
              <div className="relative w-fit h-fit m-0 md:m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
                <div className="pb-3" style={{ backgroundColor: "#000000" }}>
                  <div className="w-fit h-60 justify-center overflow-hidden item-center top-0">
                    <img
                      className="h-60"
                      src={propertyImageArray[5]}
                      alt="Card Image"
                    />
                  </div>
                  <div className="px-10">
                    <h5 className="text-xl mb-7 font-bold tracking-tight text-white dark:text-white">
                      {propertyNameArray[5]}
                    </h5>
                    <p className="font-normal text-justify text-white dark:text-gray-400">
                      {propertySummaryArray &&
                        propertySummaryArray[5]?.substr(0, 140) + "..."}
                    </p>
                    <div className="flex justify-center mt-3">
                      <Link
                        href={{
                          pathname: "/MarketItemInformation/Marketitem",
                        }}
                      >
                        <div
                          onClick={() => handleClick(6)}
                          className="flex flex-row justify-center items-center px-3 py-2 text-sm  font-medium text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Read more
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 ml-2 text-center -mr-1"
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
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
