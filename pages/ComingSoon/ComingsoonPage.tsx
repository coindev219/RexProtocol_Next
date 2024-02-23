import React, { useEffect } from "react";
import Navbar from '../../components/Header/Navbar';

export default function Comingsoon() {
  return (
    <>
        <Navbar />
        <div className="relative w-full h-[100vh] bg-[#1C1924] flex justify-center items-center text-2xl sm:text-3xl lg:text-4xl">
            <img src="../../img/rexellipse1.png" className='absolute top-0 left-0'></img>
            <div className="flex flex-row gap-5 p-3 rounded-2xl">
                Coming <p className="text-[#794CA9]">January 2024</p>
            </div>
        </div>
    </>
  );
}
