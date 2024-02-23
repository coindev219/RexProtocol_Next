import React from "react";
import Image from "next/image";
import rexsmall from '../../assets/images/rexsmall.png'
export default function LoadingScreen() {
  return (
    <>
      <div className="text-center mt-48 animate-pulsate content-center items-center flex flex-col">
        <Image width={150} height={150} src={rexsmall} />

        <div  className="text-center text-3xl flex flex-col">Loading</div>
      </div>
    </>
  );
}
