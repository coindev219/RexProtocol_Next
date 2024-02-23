import React, { useEffect } from "react";
import { IoSettingsSharp } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';

export default function ExchangeHeader() {
  return (
    <div className="w-full h-full px-5"> 
        <div className="flex flex-col lg:flex-row justify-between items-center w-full h-full py-3 border-b border-[#3D3551] gap-3">
            <div className="relative">
                <input type="text" placeholder="Search Token" className="bg-[#3D3551] text-sm w-full md:w-[350px] border-none rounded-3xl p-3 px-5"></input>
                <div className="absolute right-1 top-1 p-3 rounded-full bg-[#794CA9] cursor-pointer"><FaSearch /></div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-center">
                <button className='rounded-3xl bg-[#794CA9] px-8 py-4 text-sm'>Deposit/Withdraw</button>
                <button className='rounded-3xl bg-[#794CA9] px-8 py-4 text-sm'>Connect Wallet</button>
                <button className='rounded-full bg-[#794CA9] p-4 text-sm'><IoSettingsSharp className="w-5 h-5"/></button>
            </div>
        </div>
    </div>
  );
}
