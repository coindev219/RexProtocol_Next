import "tailwindcss-elevation";
import { Contract } from "@ethersproject/contracts";
import {
  Web3Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import {  abiObjectV2 } from "../contracts/abiv2";
import Swal from "sweetalert2";
import { useWeb3React } from "@web3-react/core";
import { active_deposit_vault } from "../constants/addresses";
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { symbol_address, property_tokens } from "../constants/addresses";
import { OrderbookContext } from "../context/OrderbookContext";
import FetchPropertyInformation from "../data/Marketinformation";
import { MarketContext } from "../context/MarketContext";

interface Ordertype {
    order_status: 1; 
    taker_token: string; 
    maker_token: string; 
    takers: []; 
    makers: []; 
    taker_amounts: []; 
    maker_amounts: []; 
    _id: string;
  }

interface OrderParams {
    order_size: string,
    account: string,
    order_price: string,
    order_variant: string,
    order_side: string,
}

  //web3 states
  const { account, chainId } = useWeb3React();
  const context = useWeb3React();
  const showConnectAWallet = Boolean(!account);
  const { library } = context;
  const [loading, setLoading] = useState(Boolean)

  //context states
  const { resourceid } = useContext(OrderbookContext);
  const { itemid } = useContext(MarketContext);

  function Checktypes(obj: any): obj is Ordertype {
    return (
      "order_status" in obj &&
      "taker_token" in obj &&
      "maker_token" in obj &&
      "takers" in obj &&
      "makers" in obj &&
      "taker_amounts" in obj &&
      "maker_amounts" in obj &&
      "_id" in obj
    );
  }

export default async function PlaceOrder({order_size, account, order_price, order_variant, order_side}: OrderParams) {

      try {
        setLoading(true);
        const formatdecimals = order_size;
        const formatprice = order_price;
        console.log(order_price, order_size, "order size and price");
        const options = {
          method: "POST",
          json: true, // if truthy, parse *response* as JSON
          headers: {
            "Content-type": "application/json",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type/json",
          },
          body: JSON.stringify({
            // have to manually stringify object in bod
            order_id: "0",
            order_size: formatdecimals,
            address: account,
            order_price: formatprice,
            asset_type: "[]",
            order_variant,
            order_side,
          }),
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URI}/order/?id=${resourceid}`,
          options
        );
        const data = await response.json();

        if (data.trade_id == null) {
          return;

        } else {
          const usersOrder = {
            order_status: 1, // Use the appropriate enum value (1 for OrderStatus.UNFILLED)
            taker_token: data.token_1, // Replace with the actual taker token address
            maker_token: data.token_2, // Replace with the actual maker token address
            takers: data.address_buyers, // Replace with actual taker addresses
            makers: data.address_sellers, // Replace with actual maker addresses
            taker_amounts: data.buy_amount, // Replace with the amounts for the takers
            maker_amounts: data.sell_amount, // Replace with the amounts for the makers
            _id: data.trade_id, // Replace with the actual ID for the order
          };
          if (Checktypes(usersOrder)) {
            const abi = abiObjectV2; // deposit vault abi
  
            const provider = new Web3Provider(
              library?.provider as ExternalProvider | JsonRpcFetchFunc
            );
            const contractaddress = active_deposit_vault; // "clienttokenaddress"
            const signer = provider.getSigner();
            const contract = new Contract(contractaddress, abi, signer);
  
            const fufillorder = await contract.ProcessOrder(
              data.trade_id,
              usersOrder
            ); //.claim()
            return fufillorder;
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        Swal.fire({
          icon: "success",
          title: "Your order has been Settled",
        });
        setLoading(false);
      }
}

