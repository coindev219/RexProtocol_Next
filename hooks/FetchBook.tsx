import "tailwindcss-elevation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {OrderbookContext} from "../context/OrderbookContext";
import { useAccount } from "wagmi";

export default function useFetchBook() {
    const { address} = useAccount()
    const { resourceid, } = useContext(OrderbookContext);
    const bidsorderlist: any[] = [];
    const asksorderlist: any[] = [];
    const [highestbid, sethighestbid] = useState(String);
    const [highestask, sethighestask] = useState(String);
    const [book, setbook] = useState(Object);

    async function Setbook(ob:any) {
        if (!address) {
          return <p>Connect your wallet to cancel an order</p>;
        } else
          try {
            ob.forEach((element: any) => {
              element.order_side === "BUY" && element.order_variant === "LIMIT"
                ? bidsorderlist.push([
                    element.order_price,
                    element.order_size,
                  ]) //&& bidsize.push(element.order_size)
                : asksorderlist.push([
                    element.order_price,
                    element.order_size,
                  ]); //&& asksize.push(element.order_size)
            });
            const bidbook = bidsorderlist;
            const askbook = asksorderlist;
            const sortedbids = bidbook.sort((a, b) => b[0] - a[0]);
            const sortedasks = askbook.sort((a, b) => b[0] - a[0]).reverse();
            if (bidbook.length > 0) {
              sethighestbid(bidbook[0][0]);
            }
            if (askbook.length > 0) {
              sethighestask(askbook[0][0])
            }
            const thebook = {
              bids: sortedbids,
              asks: sortedasks,
            };
            const final = thebook;
            const test = setbook(final);
    
  
            await test;
            return final;
          } catch (error) {
            console.log(error);
          } finally {
          }
      }
      useEffect(() => {
        if(highestbid){
          console.log(parseFloat(highestbid))
        }
      },[highestbid])
  
      useEffect(() => {

        async function FetchOrderbook(resourceid: any) {
          if (!address)
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
            const data = await response.json();
            const awaitdata = await data;
            Setbook(awaitdata);
            return awaitdata;
          } catch (error) {
            console.log(error);
          } finally {
         
          }
        }
        FetchOrderbook(resourceid);
      },[address, resourceid])
  
    return {highestbid, highestask }

    }