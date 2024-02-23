import React, { useEffect, useState } from "react";
//import ScrollpositionAnimation from "../../hooks/OnScroll";

export default function HowItWorksComponent() {
  return (
    <>
      <div className="bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] p-1 h-fit mt-36 rounded-lg">
        <div className="text-center px-4 h-96 bg-black rounded-lg flex flex-col justify-center items-center">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            How REX Protocol Works
          </h1>
          <p className="text-lg font-normal text-white lg:text-xl ">
            This is how we bring liquidity and accessibility to real estate via
            Web3.
          </p>
        </div>
      </div>
      <div>
        <div className="flex space-y-4 my-20 justify-center flex-col ... ">
          <div className="flex justify-center mx-4 items-center flex-col md:flex-col ...">
            <div className="w-full h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
              <div className="p-4 px-4 text-center w-full bg-black elevation-10">
                <a href="https://rex-protocol.gitbook.io/rex-protocol-public-docs/">
                  <h5 className="mb-2 text-3xl font-bold tracking-tighttext-white">
                    For Sellers
                  </h5>
                </a>
                <p className="mb-6 md:js-show-on-scroll-right text-justify text-lg font-normal self-center text-white lg:text-xl py-4 px-2 md:px-4">
                  REX Protocol's tokenization platform enables property owners
                  to turn their real estate holdings into fungible tokens, which
                  can be listed and sold on the REX Exchange. To tokenize their
                  property, owners need to submit all the necessary property
                  details, proof of ownership, future plans, and build a
                  personal profile. Once these documents are verified, REX
                  Protocol will create a digital representation of the property
                  on our platform, known as a fungible token. This token enables
                  real estate assets to be sold and traded like
                  cryptocurrencies, allowing sellers to list and sell any
                  portion of their holdings in the open market. Using our
                  tokenization and exchange platform, real estate owners will
                  now have instant liquidity on a global cryptocurrency-based
                  real estate exchange; something that has never been available
                  to the public in the past.
                </p>
              </div>
            </div>
            <div className={`w-full h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF] transition-all duration-300`}>
              <div className="p-5 text-center w-full bg-black elevation-10">
                <a href="#">
                  <h5 className="mb-2 text-3xl font-bold tracking-tight text-white dark:text-white">
                    For Buyers
                  </h5>
                </a>
                <p className="mb-6  md:js-show-on-scroll-left text-lg font-normal self-center text-white lg:text-xl text-justify py-4 px-2 md:px-4">
                  REX Protocol provides buyers with a comprehensive platform
                  that enables them to purchase fractional ownership of real
                  estate assets using cryptocurrency. Buyers can select from a
                  wide range of properties listed on our exchange, choose the
                  amount of each property they want to invest in, and complete
                  their purchase using their cryptocurrency wallet. Our exchange
                  provides a familiar interface with functionalities such as
                  limit and stop orders, enabling buyers to execute trades with
                  ease. Once a buyer invests in a property, they become the
                  owner of a fraction of the asset and receive proportional
                  dividends in the form of cryptocurrency. Forget about the high
                  barriers to entry in the global real estate market, the
                  lengthy and complicated negotiations, and the pre-selected
                  single faceted REITs. Buyers from around the world are now
                  able to pick and choose their ideal real estate portfolio.
                  Using the REX exchange will be as easy as any other
                  cryptocurrency exchange.
                </p>
              </div>
            </div>
            <div className="w-full h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
              <div className="p-5 px-4 text-center bg-black elevation-10">
                <a href="#">
                  <h5 className="mb-2 text-3xl font-bold text-white">
                    For The Market
                  </h5>
                </a>
                <p className="mb-6  md:js-show-on-scroll-left text-lg font-normal self-center text-white lg:text-xl text-justify py-4 px-2 md:px-4 list-decimal">
                  The current real estate market is a slow, illiquid, and
                  inefficient marketplace. REX Protocol provides the solution to
                  all of these issues and more. Our cryptocurrency-based real
                  estate exchange facilitates faster transactions, providing
                  constant price discovery and arbitrage to close market gaps.
                  This, in turn, provides a hedge against inflation and vehicles
                  previously unavailable to the world. Through our platform, REX
                  Protocol solves many of the issues associated with the
                  traditional real estate market. There is usually a lengthy
                  process in a real estate transaction that involves the use of
                  brokers, a lengthy price discovery and listing period, long
                  and invasive due diligence, and a complicated closing process.
                  Using crypto, REX Protocol provides fungible real estate
                  tokens that will be able to provide constant price discovery,
                  use arbitrage to close market gaps, and open investment
                  vehicles that have never before been available to the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
/*
let Rotation = ['rotate(0deg)','rotate(90deg)' ]

  const [textboxStates, setTextboxStates] = useState({
    textbox1: { hidden: true, rotation: Rotation[0] },
    textbox2: { hidden: true, rotation: Rotation[0]},
    textbox3: { hidden: true,  rotation: Rotation[0] },
  });

  function HandleClick(item: Number) {
    if ((item == 1)) {
      setTextboxStates({
        ...textboxStates,
        textbox1: {
          ...textboxStates.textbox1,
          hidden: !textboxStates.textbox1.hidden,
          rotation: textboxStates.textbox1.rotation == Rotation[0] ? Rotation[1]: Rotation[0]
        },
      });
    }
    if ((item == 2)) {
      setTextboxStates({
        ...textboxStates,
        textbox2: {
          ...textboxStates.textbox2,
          hidden: !textboxStates.textbox2.hidden,
          rotation: textboxStates.textbox2.rotation == Rotation[0] ? Rotation[1]: Rotation[0]
        },
      });
    }
    if ((item == 3)) {
      setTextboxStates({
        ...textboxStates,
        textbox3: {
          ...textboxStates.textbox3,
          hidden: !textboxStates.textbox3.hidden,
          rotation: textboxStates.textbox3.rotation == Rotation[0] ? Rotation[1]: Rotation[0]
        },
      });
    }
  }
  */
