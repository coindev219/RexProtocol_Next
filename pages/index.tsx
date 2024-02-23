import "tailwindcss-elevation";
import type { NextPage } from "next";
import React, { useEffect } from "react";
import Navbar from '../components/Header/Navbar';
import Mainpage from '../components/Landing/Mainpage';
import About from "../components/Landing/About";
import Howwork from '../components/Landing/Howwork';
import TokenInfo from '../components/Landing/TokenInfo';
import Footer from '../components/Footer/Footer';

const Home: NextPage = () => {
  return (
    <>
        <Navbar />
        <Mainpage />
        <About />
        <Howwork />
        <TokenInfo />
        <Footer />
    </>
  );
};

export default Home;
