import "tailwindcss-elevation";
import React, { useCallback, useEffect, useState } from "react";
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

export default async function UseBalanceCallback(current_token: string, context:any, account:string) {
    const { library } = context;
    //const [balance, setBalance] = useState(Number)
    let balance = 1
    //const { account, chainId } = useWeb3React();

    async function FetchBalance() {
        try {
          const abi = abiObject;
          const provider = new Web3Provider(
            library?.provider as ExternalProvider | JsonRpcFetchFunc
          );
          const contractaddress = active_deposit_vault; // "clienttokenaddress"
          const contract = new Contract(contractaddress, abi, provider);
          const userbalance = await contract.GetTokenDepositInfo(
            current_token,
            account
          ); //.claim()
          console.log(current_token)
          const formated_balance = formatEther(userbalance);
          balance = Number(formated_balance)
          console.log(balance)
          //setBalance(Number(formated_balance));
          return balance;
        } catch (error) {
          console.log(error);
        } finally {
        }
    }
    //FetchBalance()

  return await FetchBalance()
}
//const balance, fetchbalance = UseBalanceCallback(current_token, account)