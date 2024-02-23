import React, { useCallback, useContext, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
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