import React, { useEffect } from "react";
import Image from "next/image";
import city from "../../assets/images/city.jpeg";
import ScrollpositionAnimation from "../../hooks/OnScroll";
import DualCardComponent from "../DualCards/DualCardComponent";

export default function AboutusComponent() {
  if (typeof window !== "undefined") {
    useEffect(() => {
      // Update the document title using the browser API
      ScrollpositionAnimation();
    }, [window.scrollY]);
  }
  useEffect(() => {
    async function ScrollpositionAnimation() {
      const targets = document.querySelectorAll(".js-show-on-scroll");

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          const test = entry.target as HTMLElement;
          const animationType = test.dataset.animateType;
          const assertanimation = animationType as string;
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add(assertanimation);
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.add(assertanimation);
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
    }

    async function scrollpositionAnimationleft() {
      const targets = document.querySelectorAll(".js-show-on-scroll-left");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-fadeinleft");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-fadeinleft");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }
    async function scrollpositionAnimationright() {
      const targets = document.querySelectorAll(".js-show-on-scroll-right");
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
          // Is the element in the viewport?
          if (entry.isIntersecting) {
            // Add the fadeIn class:
            entry.target.classList.add("motion-safe:animate-fadeinright");
          } else {
            // Otherwise remove the fadein class
            entry.target.classList.remove("motion-safe:animate-fadeinright");
          }
        });
      });
      // Loop through each of the target
      targets.forEach(function (target) {
        // Hide the element
        target.classList.add("opacity-0");

        // Add the element to the watcher
        observer.observe(target);
      });
      //ScrollpositionAnimation();
    }

    ScrollpositionAnimation();
    scrollpositionAnimationleft();
    scrollpositionAnimationright();
  });

  return (
    <>
      <div className={"flex flex-col xl:px-16 2xl:px-40"}>
        <div className="flex flex-col sm:flex flex-col md:flex flex-col lg:flex-row text-left">
          <h1
            className="mb-4 self-center rounded-xl w-fit h-fit  py-12
        hover:animate-fadeinleft js-show-on-scroll-left font-extrabold tracking-tight leading-none text-white-900 text-3xl md:text-3xl lg:text-4xl"
          >
            Why Invest in Real Estate?
          </h1>
         <ul className="mb-6 hover:animate-fadeinright js-show-on-scroll-right text-lg font-normal self-center text-white-500 lg:text-xl sm:px-6 text-left list-disc">
              <li>Powerful hedge against inflation</li>
              <li>Provides a steady flow of passive income</li>
              <li>Perpetually diminishing land supply</li>
              {/*Buying real estate has been a staple of our world economy 
              for a plethora of reasons. To begin with, unlike fiat currency, 
              there is a limited amount of real estate on earth that is quickly 
              being depleted through population and economic growth making it a 
              powerful hedge against inflation. Over the long term, real estate has 
              outpaced inflation and frequently the stock markets. Additionally, 
              holding real estate can provide investors a steady flow of passive income. 
              Historically, holding real estate has been safer and more lucrative than 
              holding inflationary currencies such as fiat. */}
         </ul>
        </div>
        <div className="flex flex-col sm:flex flex-col md:flex flex-col lg:flex-row text-left">
          <h1
            /* className="mb-4 self-center rounded-xl px-20 py-12 text-white-900 font-extrabold tracking-tight leading-none
            visible sm:visible md:visible lg:invisible w-fit h-fit sm:w-fit sm:h-fit md:w-fit md:h-fit lg:w-0 h-0 md:text-3xl lg:text-4xl"*/
            className="mb-4 self-center rounded-xl w-fit h-fit px-20 py-12
        hover:animate-fadeinleft js-show-on-scroll-left font-extrabold tracking-tight leading-none text-white-900 text-3xl md:text-3xl lg:text-4xl"
          >
            REX is Removing Barriers to Entry
          </h1>
          <ul className="mb-6 hover:animate-fadeinleft js-show-on-scroll-left text-lg font-normal self-center text-white-500 lg:text-xl sm:px-6 text-left list-disc">
            <li>No more capital constraints</li>
            <li>No more geographic boundaries</li>
            <li>No more lack of liquidity</li>
            {/* If getting into real estate is so great, why isn’t everybody doing
            it? Unfortunately, up until now, real estate has had many barriers
            to entry, including, but not limited to: high costs, lack of
            experience, lack of time, geographic boundaries, and last, but
            certainly not least, liquidity. REX is aiming to fix all of these
            problems with our tokenized real estate and exchange platform. By
            tokenizing real estate, everyday people will be able to buy tokens
            representing real properties all over the world. These real estate
            tokens are fractional and fungible, therefore there is no need to
            break the bank and buy a whole property, but just a portion thereof.
            While you’re at it, why not buy property tokens all over the world
            and build your own crypto real estate portfolio? */}
          </ul>
          <h1
            className="mb-4 self-center rounded-xl px-20 py-12 text-white-900 font-extrabold tracking-tight leading-none
        invisible w-0 h-0 sm:invisible md:invisible lg:visible sm:w-0 sm:h-0 md:w-0 md:h-0 lg:w-fit lg:h-fit md:text-3xl lg:text-4xl
        hover:animate-fadeinright js-show-on-scroll-right"
          >
            {/* REX Is Removing Barriers to Entry */}
          </h1>
        </div>
       {/* <div className="flex flex-col sm:flex flex-col md:flex flex-col lg:flex-row text-center">
          <h1
            className="mb-4 self-center rounded-xl w-fit h-fit px-20 py-12 text-white-900
        hover:animate-fadeinleft js-show-on-scroll-left font-extrabold tracking-tight leading-none md:text-3xl lg:text-4xl"
          >
            Can I Tokenize My Property?
          </h1>
          <p className="mb-6 hover:animate-fadeinright js-show-on-scroll-right text-lg font-normal self-center text-white-500 lg:text-xl sm:px-6">
            Property owners also have many incentives to tokenize their
            properties. Aside from the liquidity REX provides, property owners
            can also easily maintain control of a property while selling a small
            part of their tokens. Additionally, property owners can raise funds
            through their token sales to diversify their real estate portfolios,
            upgrade their properties, or even pay off their mortgage! 
            Tokenizing a property will require information about the property, 
            proof of ownership, and the owner’s information. Once all documentation 
            passes REX’s verification procedure you will be able to tokenize your 
            property and list it onto the REX Marketplace.
          </p>
          </div> */}
        </div>
    </>
  );
}
