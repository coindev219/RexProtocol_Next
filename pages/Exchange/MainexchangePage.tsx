import React, { useEffect } from "react";
import ExchangeHeader from "@/components/Header/ExchangeHeader";
import Footer from "@/components/Footer/Footer";
import Sidebar from "@/components/Exchange/Sidebar";
import { table } from "console";
import { FaCheck } from 'react-icons/fa';

const table_data = {
    price: ["0.00055", "0.00054", "0.00053", "0.00052"], 
    size: ["8,232,053", "7,256,743", "6,132,023", "5,000,000"],
    spread: ["0.00051", "0.00050", "0.00049", "0.00048"],
    detail: ["69,420,000", "20,245,267", "55,678,242", "10,234,756"],
}

export default function MainexchangePage() {
  return (
    <>
        <div className="bg-[#1C1924] flex flex-row">
            <Sidebar />
            
            <div className="flex bg-[#1C1924] flex-col w-full h-full">
                <ExchangeHeader />
                <div className="w-full py-10 px-5 lg:px-20 flex flex-col items-center justify-between super:flex-row gap-20">
                    <img src="../../img/exchangechart.png" className="w-full lg:w-[44rem]"></img>
                    <div className="flex flex-col md:flex-row gap-10 bg-[#3D3551] rounded-2xl p-5 sm:p-7">
                        <div className="flex flex-col gap-5 justify-center">
                            <button className='flex flex-row gap-3 rounded-3xl border border-[#794CA9] px-6 py-3 text-sm hover:bg-[#794CA9]'>
                                <FaCheck className="w-5 h-5 text-green-500" />
                                Orderbook
                            </button>
                            <button className='flex flex-row gap-3 rounded-3xl border border-[#794CA9] px-6 py-3 text-sm hover:bg-[#794CA9]'>
                                {/* <FaCheck hidden className="w-5 h-5 text-green-500" /> */}
                                Crypto Information
                            </button>
                        </div>
                        <div className="grid grid-cols-2 text-center gap-x-10 sm:gap-x-20 w-[350px] sm:w-[400px]">
                            <div className="flex flex-col gap-2">
                                <div className="text-lg sm:text-xl border rounded-xl border-red-500 px-2 py-1">Price USDC</div>
                                {table_data.price.map((price) => (
                                    <p className="text-red-500">{price}</p>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2 ">
                                <div className="text-lg sm:text-xl border rounded-xl border-red-500 px-2 py-1">Size(REXE)</div>
                                {table_data.price.map((price) => (
                                    <p className="text-red-500">{price}</p>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2 ">
                                <div className="border rounded-xl border-green-500 px-2 py-1">Spread 1.8%</div>
                                {table_data.price.map((price) => (
                                    <p className="text-green-500">{price}</p>
                                ))}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="border rounded-xl border-green-500 px-2 py-1">0.00001</div>
                                {table_data.price.map((price) => (
                                    <p className="text-green-500">{price}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>  
                <div className="w-full px-5">
                    <Footer />
                </div>
            </div>
        </div>
    </>
  );
}
