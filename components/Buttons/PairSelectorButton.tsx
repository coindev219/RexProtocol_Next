import React, { useContext, useEffect, useRef, useState } from "react";

import * as TokenConstants from "../../constants/addresses";
import { OrderbookContext } from "../../context/OrderbookContext";
import { MarketContext } from "../../context/MarketContext";

import { property_tokens } from "../../constants/addresses";

const PairSelector = () => {
  //context states
  const { resourceid, setResourceId } = useContext(OrderbookContext);
  const { itemid, setItemId } = useContext(MarketContext);
  //constants
  const property_token = TokenConstants.property_tokens;
  // local states
  const [PairDropDownState, setPairDropDownState] = useState(false);
  const [StyleChangeState, setStyleChangeState] = useState(Number);
  //refs
  const PairButtonRef: any = useRef();

  //event listeners
  function OnOffClick() {
    if (!PairButtonRef?.current.contains(event?.target)) {
      // Clicked outside the header, so close it
      setPairDropDownState(false);
    }
  }
  useEffect(() => {
    window.addEventListener("click", OnOffClick);

    return () => {
      window.removeEventListener("click", OnOffClick);
    };
  }, []);

  //selected trade token
  interface ButtonActions {
    property_token: string;
    itemid: number;
    styleid: number;
  }

  function HandleTradeToken({
    property_token,
    itemid,
    styleid,
  }: ButtonActions) {
    setItemId(itemid);
    setResourceId(property_token);
    setStyleChangeState(styleid);
  }
  const [name, setname] = useState("IRET0001");
  useEffect(() => {
    if (resourceid == property_tokens[0]) {
      setname("IRET0001");
    }
    if (resourceid == property_tokens[1]) {
      setname("IRET0002");
    }
    if (resourceid == property_tokens[2]) {
      setname("IRET0003");
    }
    if (resourceid == property_tokens[3]) {
      setname("IRET0004");
    }
    if (resourceid == property_tokens[4]) {
      setname("IRET0005");
    }
    if (resourceid == property_tokens[5]) {
      setname("IRET0006");
    }
  }, [resourceid]);

  return (
    <>
      <div
        ref={PairButtonRef}
        className={`z-10 flex-row w-32 hover:scale-95  ml-6 transition-all text-center relative rounded-md bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] items-center justify-center`}
      >
        <div
          onClick={() => setPairDropDownState(!PairDropDownState)}
          className={`${
            PairDropDownState
              ? "rounded-br-0 rounded-bl-0 "
              : "rounded-br-md rounded-bl-md"
          } rounded-tl-md rounded-tr-md cursor-pointer p-2 m-1 bg-black hover:bg-slate-900 items-center`}
        >
          <div className="flex flex-row items-center">
            <h1 className="text-md text-white">{name}</h1>
            <svg
              className="w-7 ml-2 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              ></path>
            </svg>
          </div>
        </div>
        <div
          className={`bg-black align-top z-20 absolute justify-center w-full rounded-br-md rounded-bl-md text-center items-center ${
            PairDropDownState ? "" : "hidden"
          }`}
        >
          <ul
            onClick={() => setPairDropDownState(false)}
            className="py-2 rounded cursor-pointer text-sm"
          >
            <li
              className={`hover:bg-slate-900`}
              onClick={() =>
                HandleTradeToken({
                  property_token: property_token[0],
                  itemid: 1,
                  styleid: 0,
                })
              }
            >
              {" "}
              IRET0001 - USDC
            </li>
            <li
              className="hover:bg-slate-900"
              onClick={() =>
                HandleTradeToken({
                  property_token: property_token[1],
                  itemid: 2,
                  styleid: 1,
                })
              }
            >
              {" "}
              IRET0002 - USDC
            </li>
            <li
              className="hover:bg-slate-900"
              onClick={() =>
                HandleTradeToken({
                  property_token: property_token[2],
                  itemid: 3,
                  styleid: 2,
                })
              }
            >
              {" "}
              IRET0003 - USDC
            </li>
            <li
              className="hover:bg-slate-900"
              onClick={() =>
                HandleTradeToken({
                  property_token: property_token[3],
                  itemid: 4,
                  styleid: 3,
                })
              }
            >
              {" "}
              IRET0004 - USDC
            </li>
            <li
              className="hover:bg-slate-900"
              onClick={() =>
                HandleTradeToken({
                  property_token: property_token[4],
                  itemid: 5,
                  styleid: 4,
                })
              }
            >
              {" "}
              IRET0005 - USDC
            </li>
            <li
              className="hover:bg-slate-900"
              onClick={() =>
                HandleTradeToken({
                  property_token: property_token[5],
                  itemid: 6,
                  styleid: 5,
                })
              }
            >
              {" "}
              IRET0006 - USDC
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PairSelector;
