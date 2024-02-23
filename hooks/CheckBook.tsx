import "tailwindcss-elevation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { animated } from "react-spring";
import { useSpring } from "react-spring/web";
import ScrollpositionAnimation from "./OnScroll";
import { Button, Dropdown, Modal } from "flowbite-react";
import { Contract } from "@ethersproject/contracts";
import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { abiObject } from "../contracts/abi";
import Swal from "sweetalert2";
import { useWeb3React } from "@web3-react/core";
import { MaxUint256 } from "@ethersproject/constants";
import { tokenabi } from './abi.js'
import { active_deposit_vault } from "../constants/addresses";
import {OrderbookContext} from "../context/OrderbookContext";

export default function useOpenOrdersCallBack() {
    const { account } = useWeb3React()
    const [hasOpenOrder, setHasOpenOrder] = useState(Boolean)
    const { resourceid, setResourceId } = useContext(OrderbookContext);
    useEffect(() => {
    
        async function FetchOrderbook() {
          if (!account)
            return;
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URI}/order/?id=${resourceid}`,
              {
                method: "GET",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
              }
            );
            const data = await response.json()
            const awaitdata = await data;
            awaitdata.forEach((element: any) => {
                if(element.address === account){
                    setHasOpenOrder(true)
                }   
                })
            return hasOpenOrder
          } catch (error) {
            console.log(error);
          } finally {

          }
        }
        FetchOrderbook();
    }, [account]);

    return hasOpenOrder
}