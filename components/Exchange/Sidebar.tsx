import React, { useEffect } from "react";
import { FaUser } from 'react-icons/fa';
import { BiSolidHome } from 'react-icons/bi';
import { BsCurrencyExchange } from 'react-icons/bs';
import { ImStatsDots } from 'react-icons/im';
import { IoDocumentText, IoOptionsSharp } from 'react-icons/io5';
import Link from "next/link";

export default function Sidebar() {
  return (
    <>
        <div className="flex flex-row relative left-0 w-[75px] md:w-[236px] h-[100vh] rounded-2xl bg-[#794CA9]">
            <div className="text-white bg-[#9A6FC7] w-[75px] rounded-2xl pt-20 flex flex-col gap-10 items-center">
                <BiSolidHome className="w-7 h-7 cursor-pointer"/>
                <FaUser className="w-7 h-7 cursor-pointer"/>
                <BsCurrencyExchange className="w-7 h-7 cursor-pointer" />
                <ImStatsDots className="w-7 h-7 cursor-pointer" />
                <IoDocumentText className="w-7 h-7 cursor-pointer" />
                <IoOptionsSharp className="w-7 h-7 cursor-pointer" />
            </div>
            <div className="hidden md:flex flex-col px-2">
                <img src="../../img/logo.svg" className="w-28 h-16"></img>
                <div className="flex flex-col pt-4 pl-4">
                    <a href="/#">Home</a>
                    <a href="/#" className="pt-12">Account</a>
                    <a href="/#" className="pt-10">Exchange</a>
                    <a href="/#" className="pt-12">Stats</a>
                    <a href="/#" className="pt-10">Docs</a>
                    <a href="/#" className="pt-12">More</a>
                </div>
            </div>
        </div>
    </>
  );
}
