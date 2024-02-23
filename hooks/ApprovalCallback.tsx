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

export default function UseApprovalCallback(current_token: string) {
    const context = useWeb3React();
    const { library } = context;
    const [allowance, setAllowance] = useState(Number)
    const { account } = useWeb3React()


  useEffect(() => {
    async function FetchAllowance() {
        if(account)
      try {
        const data = tokenabi;
        const abi = data;
        const provider = new Web3Provider(
          library?.provider as ExternalProvider | JsonRpcFetchFunc
        );
        const contractaddress = current_token;
        const contract = new Contract(contractaddress, abi, provider);
        const Allow = await contract.allowance(account, active_deposit_vault); //.claim()
        // console.log(Allow)
        const final = await formatEther(Allow);
        setAllowance(Number(final));
        return final;
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
      // Initial Fetch
    FetchAllowance();

      // Periodically fetch allowance every .5 second(s) (adjust as needed)
    const intervalId = setInterval(FetchAllowance, 500);

      // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, [account, current_token, library?.provider]);


    const handleApprove = useCallback(async (current_token: string) => {
        if (!account) {
          console.log({
            message: "Hold On there Partner, there seems to be an Account err!",
          });
          return;
        }
    
        try {
          //setLoading(true)
          const data = tokenabi;
          const abi = data;
          const provider = new Web3Provider(library?.provider);
          const signer = provider.getSigner();
          const contractaddress = current_token;
          const depositAddress = active_deposit_vault; // "clienttokenaddress"
          const contract = new Contract(contractaddress, abi, signer);
          //const options = { value: parseEther('0.075') }
          const BIGINT = MaxUint256;
          const approve = await contract.approve(depositAddress, BIGINT); //.claim()
          //const final = await signer.signTransaction(approve)
          Swal.fire({
            icon: "success",
            title: "You have been approved! Please wait a few seconds for blockchain to process before depositing",
          });
          const Claimtxid = await approve;
    
          return Claimtxid;
          /////
        } catch (error) {
          console.log(error);
        } finally {
        }
    }, [account, current_token, library?.provider]);

  return {allowance, handleApprove}
}