import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { OrderbookContext } from "../../context/OrderbookContext";
import { property_tokens } from "../../constants/addresses";
import Decimal from 'decimal.js'
import OrderBook from "./OrderBook";
import { io } from 'socket.io-client'

import {
  useAccount,
  useNetwork,
  useContractRead,
  useContractWrite,
} from "wagmi";

interface OrderComponent {
  orderplaced: boolean;
}
const OrderSection = (orderplaced: any) => {
  let { chain } = useNetwork();
  let current_chain = chain?.id;

  const { address, isConnected } = useAccount();
  //const scrollY = useScrollPosition()
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;
  const [loading, setLoading] = useState(false);
  //const { account } = useActiveWeb3React()


  const [bookcalled, setbookcalled] = useState(false);
  const bidsorderlist: any[] = [];
  const asksorderlist: any[] = [];
  const sortedbidsorderlist: any[] = [];
  const [book, setbook] = useState(Object);
  const [orderbook, setorderbook] = useState<any[]>([]);
  const [orderhasbeenplaced, setorderhasbeenplaced] = useState(Boolean);
  //const [orderplaced, setorderplaced] = useState(Boolean);
  const [TradingPair, setasset_market] = useState(String);
  const [higestbid, sethighestbid] = useState(Number);
  const [orderPlaced, setorderplaced] = useState(orderplaced);
  const { resourceid } = useContext(OrderbookContext);

  useEffect((): any => {
    const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`, {
      transports: ["websocket"]
    });

    // log socket connection
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    // update chat on new message dispatched
    socket.on("orders", (data: any) => {
      if (resourceid === data.resource_id) {
        Setbook(data.data);
      }
    });

    // update chat on new message dispatched
    socket.on("message", (data: any) => {
      console.log("SOCKET MESSAGE", data)
    });

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

    async function Setbook(ob:any) {
      if (!address) {
        return <p>Connect your wallet to cancel an order</p>;
      } else
        try {

          bidsorderlist.length = 0;
          asksorderlist.length = 0;
          // console.log(ob)
          
          ob.forEach((element: any) => {
            if (element.order_side === "BUY" && element.order_variant === "LIMIT") {
               bidsorderlist.push([
                  element.order_price,
                  element.order_size - (element.filled_size || 0)
                ]) //&& bidsize.push(element.order_size)
            }
            if (element.order_side === "SELL" && element.order_variant === "LIMIT") {
               asksorderlist.push([
                element.order_price,
                element.order_size - (element.filled_size || 0)
                ]); //&& asksize.push(element.order_size)
            }
          });
       
          const askbook = asksorderlist;
          const bidbook = bidsorderlist;

          const sortedbid = bidbook.sort((a, b) => parseFloat(b) - parseFloat(a));
          const sortedask = askbook.sort((a, b) => parseFloat(b) - parseFloat(a)).reverse();

          if (bidbook.length > 0) {
            sethighestbid(bidbook[0][0]);
          }

          let finalbid: any = [], finalask: any = [];
          if (sortedbid.length > 0)
            finalbid = [sortedbid[0]];
          if (sortedask.length > 0)
            finalask = [sortedask[0]];
          let finalCount = 0;
          sortedbid.forEach((bid, index) => {
            if (finalCount >= index)
              return;
            if (bid[0] === finalbid[finalCount][0]) {
              finalbid[finalCount][1] = parseInt(finalbid[finalCount][1]) + parseInt(bid[1]);
              return;
            }
            finalbid.push(bid);
            finalCount ++;
          })

          finalCount = 0;
          sortedask.forEach((ask, index) => {
            if (finalCount >= index)
              return;
            if (ask[0] === finalask[finalCount][0]) {
              finalask[finalCount][1] = parseInt(finalask[finalCount][1]) + parseInt(ask[1]);
              return;
            }
            finalask.push(ask);
            finalCount ++;
          })

          const thebook = {
            bids: finalbid,
            asks: finalask,
          };
          
          const final = thebook;
          const test = setbook(final);
          // console.log("finsihed?")
          setbookcalled(true);
          setorderhasbeenplaced(false);

          await test;
          return final;
        } catch (error) {
          console.log(error);
        } finally {
        }
    }



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
        setorderhasbeenplaced(true);
        await Setbook(awaitdata);
        return awaitdata;
      } catch (error) {
        console.log(error);
      } finally {
        setasset_market("WETHUSDC");
      }
    }
    FetchOrderbook(resourceid);
  },[address, resourceid])

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false); // Change the loading state after 3 seconds
    }, 3000);

    return () => {
      clearTimeout(timer); // Cleanup: Clear the timer if the component unmounts before 3 seconds
    };
  }, [resourceid]);

  const [displayname, setdisplayname] = useState(String);
  useEffect(() => {
    if (resourceid == property_tokens[0]) {
      setdisplayname("IRET0001");
    }
    if (resourceid == property_tokens[1]) {
      setdisplayname("IRET0002");
    }
    if (resourceid == property_tokens[2]) {
      setdisplayname("IRET0003");
    }
    if (resourceid == property_tokens[3]) {
      setdisplayname("IRET0004");
    }
    if (resourceid == property_tokens[4]) {
      setdisplayname("IRET0005");
    }
    if (resourceid == property_tokens[5]) {
      setdisplayname("IRET0006");
    }
  }, [resourceid]);

  return (
    <>
      <div className="bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg w-80 h-fit p-1 flex-1 justify-center items-center">
        <div className="relative bg-black rounded-lg text-center min-h-[550px] flex flex-col w-full">
          <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-white dark:text-white">
            Orderbook
          </h5>
          <p>{displayname}</p>
          {bookcalled && address ? (
            <>
              <div className="text-center items-center justify-center objects-center">
                <p> Spot Price: {higestbid}</p>

                <div className="w-auto items-center">
                  {loading ? (
                    <div className="flex flex-col ">
                      <div className="items-center my-20 justify-center">
                        {antIcon}
                      </div>
                    </div>
                  ) : (
                    <div className="w-auto justify-center items-center">
                      {book?.asks.length === 0 && (
                        <p style={{ color: "red" }}>No asks</p>
                      )}
                      <OrderBook
                        pairs={[displayname, "USDC"]}
                        book={{
                          bids:
                            book?.bids.length > 0 ? book?.bids : [],
                          asks:
                            book?.asks.length > 0 ? book?.asks : [],
                        }}
                      />
                      {book?.bids.length === 0 && (
                        <p style={{ color: "red" }}>No bids</p>
                      )}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <button className="bg-gradient-to-r from-[#FFFF00] to-[#00FFFF]  text-black  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800">
                      <Link
                        href={{
                          pathname: "/PortfolioPage/Portfolio",
                          query: {
                            tab: 'orders'
                          }
                        }}
                      >
                        <p className=" cursor-pointer block py-2 pr-3 pl-3 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                          Cancel Order
                        </p>
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="">Connect your wallet to view active orders</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderSection;
