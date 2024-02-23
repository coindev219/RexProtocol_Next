import React, { useEffect } from "react";
import Image from "next/image";
import city from "../../assets/images/city.jpeg";
import ScrollpositionAnimation from "../../hooks/OnScroll";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
import HowItWorksComponent from "../../components/HowItWorks/HowItWorksComponent";

export default function Aboutus() {

  return (
    <>
      <HeaderComponent></HeaderComponent>
    <div
        className={"bg-black bg-no-repeat bg-cover bg-center bg-fixed"}
      >
      <div className="flex flex-col text-center justify-center">
<HowItWorksComponent></HowItWorksComponent>
      </div>
      <FooterComponent></FooterComponent>
      </div>
    </>
  );
}
