import "tailwindcss-elevation";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Dropdown, Modal } from "flowbite-react";
import { abiObject } from "../../contracts/abi";
import Swal from "sweetalert2";
import { active_deposit_vault, deposit_vault_v2 } from "../../constants/addresses";
import { tokenabi } from '../../hooks/abi.js'
import { formatEther, parseUnits } from "@ethersproject/units";
import { symbol_address, property_tokens } from "../../constants/addresses";
import { OrderbookContext } from "../../context/OrderbookContext";

import {
  useAccount,
  useNetwork,
  useContractRead,
  useContractWrite,
} from "wagmi";

export default function DepositModalComponent(props: any) {
  const [loading, setLoading] = useState(false);
  const ca = active_deposit_vault;
  const [requested_amount, setrequestedamount] = useState(Number);
  const IRET0001 = property_tokens[0];
  const IRET0002 = property_tokens[1];
  const IRET0003 = property_tokens[2];
  const IRET0004 = property_tokens[3];
  const IRET0005 = property_tokens[4];
  const IRET0006 = property_tokens[5];
  const USDC = symbol_address.USDC;
  const [visible, setVisible] = useState(false);
  const { resourceid } = useContext(OrderbookContext);
  const [balance, setBalance] = useState(0);

  const [current_token, setcurrenttoken] = useState(props?.current_token ? props?.current_token : IRET0001);
  const [allowance, setallowance]:any = useState()
  
  const OnClick = () => {
    setVisible(true);
  };
  const OnOffClick = () => {
    setVisible(false);
  };
  const { address } = useAccount();
  let { chain } = useNetwork();
  let current_chain = chain?.id;

  const { data: GetTokenDepositInfo } = useContractRead({
    address: active_deposit_vault,
    abi: abiObject,
    functionName: "GetTokenDepositInfo",
    chainId: current_chain,
    watch: true,
    args: [current_token, address],
    onSuccess(data) {

        setBalance(Number(data));
    },
  });
  const { write: Approve, isLoading: aLoad } = useContractWrite({
    address: current_token as `0x${string}` | undefined,
    abi: tokenabi,
    functionName: "approve",
    chainId: current_chain,
    account: address,
    args: [active_deposit_vault, Number(requested_amount.toString()) * 10 ** 18],
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: `You Have Successfully Approved The Token`,
      });
  },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Approving  please contact support if issue perists${err.cause}`,
      });
    },
  });

  const { data: Allowance } = useContractRead({
    address: current_token as `0x${string}` | undefined,
    abi: tokenabi,
    functionName: "allowance",
    chainId: current_chain,
    args: [address, active_deposit_vault],
    watch: true,
    onSuccess(data: any) {
      setallowance(Number(data.toString()) / 10 ** 18);
    },
  });


  const { write: withdraw_token } = useContractWrite({
    address: ca,
    abi: abiObject,
    chainId: current_chain,
    functionName: "withdraw_token",
    args:[current_token, (requested_amount * 10**18)],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: `Withdraw Successful`,
      });
  },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with your withdraw  please contact support if issue perists${err.cause}`,
      });
    },
  });

    const { write: deposit_token } = useContractWrite({
    address: ca,
    abi: abiObject,
    chainId: current_chain,
    functionName: "deposit_token",
    args:[current_token, (requested_amount * 10**18)],
    account: address,
    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: `You Have Successfully Deposited ${name}`,
      });
  },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with Deposit  please contact support if issue perists${err.cause}`,
      });
    },
  });

 
  const Withdraw = useCallback(
    async () => {
      if (!address) {
        Swal.fire({
          icon: "error",
          title: "Please connect your wallet",
          timer: 5000,
        });
      }
      if (balance < requested_amount) {
        Swal.fire({
          icon: "error",
          title: "You cannot withdraw that amount ",
          timer: 5000,
        });
      }


      try {
        withdraw_token()
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [requested_amount, balance]
  );

 
  // sets Order size name
  const [name, setname] = useState("IRET0001");
  useEffect(() => {
    if (current_token == property_tokens[0]) {
      setname("IRET0001");
    }
    if (current_token == property_tokens[1]) {
      setname("IRET0002");
    }
    if (current_token == property_tokens[2]) {
      setname("IRET0003");
    }
    if (current_token == property_tokens[3]) {
      setname("IRET0004");
    }
    if (current_token == property_tokens[4]) {
      setname("IRET0005");
    }
    if (current_token == property_tokens[5]) {
      setname("IRET0006");
    }
    if (current_token == USDC) {
      setname("USDC");
    }
  }, [current_token]);

  const [PairDropDownState, setPairDropDownState] = useState(false);
  //refs
  const PairButtonRef: any = useRef();

  useEffect(() =>{
    GetTokenDepositInfo;
    Allowance;
  
  },[requested_amount])
  return (
    <>
      <div
        className={`z-10 flex-row w-32 hover:scale-95 h-fit p-[2px] transition-all text-center relative rounded-md bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] items-center justify-center`}
      >
        <div
          onClick={OnClick}
          className={`rounded-tl-md rounded-tr-md cursor-pointer py-2 text-center p-1 bg-black hover:bg-slate-900 items-center`}
        >
          <h1 className="text-sm text-white">Deposit / Withdraw</h1>
        </div>
      </div>
      <Modal show={visible} size="md" popup={true} onClose={OnOffClick}>
        <Modal.Header style={{ background: "black" }} />
        {!address ? (
          <div className="text-white h-96 flex flex-col items-center w-104 pt-32 bg-black text-center">
            Connect Your Wallet To Deposit
            <div className="items-center justify-center mt-2">
    
            </div>
          </div>
        ) : (
          <Modal.Body
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "black",
            }}
          >
            <div className="flex flex-col justify-center content-center text-center">
              <h1 className="text-white">
                {" "}
                Deposit or Withdraw your tokens from the exchange
              </h1>
              <div
                ref={PairButtonRef}
                className={`z-10 flex-row w-32 hover:scale-95   transition-all text-center relative rounded-md bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] items-center justify-center`}
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
                    <h1 className="text-sm text-white">{name}</h1>
                    <svg
                      className="w-5 ml-5 h-5"
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
                    className="py-2 roun cursor-pointer text-sm"
                  >
                    <li
                      className={`hover:bg-slate-900`}
                      onClick={() => setcurrenttoken(IRET0001)}
                    >
                      {" "}
                      IRET0001
                    </li>
                    <li
                      className="hover:bg-slate-900"
                      onClick={() => setcurrenttoken(IRET0002)}
                    >
                      {" "}
                      IRET0002
                    </li>
                    <li
                      className="hover:bg-slate-900"
                      onClick={() => setcurrenttoken(IRET0003)}
                    >
                      {" "}
                      IRET0003
                    </li>
                    <li
                      className="hover:bg-slate-900"
                      onClick={() => setcurrenttoken(IRET0004)}
                    >
                      {" "}
                      IRET0004
                    </li>
                    <li
                      className="hover:bg-slate-900"
                      onClick={() => setcurrenttoken(IRET0005)}
                    >
                      {" "}
                      IRET0005
                    </li>
                    <li
                      className="hover:bg-slate-900"
                      onClick={() => setcurrenttoken(IRET0006)}
                    >
                      {" "}
                      IRET0006
                    </li>
                    <li
                      className="hover:bg-slate-900"
                      onClick={() => setcurrenttoken(USDC)}
                    >
                      {" "}
                      USDC
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-white text-center items-center justify-center py-2">
                {name}
              </div>
              <input
                placeholder="Deposit/ Withdraw Amount"
                className="my-2 text-black text-center rounded-lg border border-gray-500"
                aria-label="deposit amount"
                onChange={(e) => {
                  let inputValue = (e.target as HTMLInputElement).value;
                    let sanitizedValue = inputValue.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-period characters
                
                    if (sanitizedValue !== inputValue) {
                      (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                    }
                
                    const periodCount = sanitizedValue.split('.').length - 1;
                    if (periodCount > 1) {
                      sanitizedValue = sanitizedValue.replace(/\./g, ''); // Remove extra periods
                      (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                    }
                
                    if (sanitizedValue.startsWith('.')) {
                      sanitizedValue = `0${sanitizedValue}`; // Add a zero before the period
                      (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                    }

                    setrequestedamount(Number(sanitizedValue))
                }}
              ></input>
              {allowance < requested_amount ? (
                <>
                  {" "}
                  <button
                    className="mt-5 mb-1 text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800"
                    onClick={() => Approve()}
                  >
                    {" "}
                    Approve
                  </button>
                  <p className="text-white text-sm mb-3">
                  This button will automatically change to "Deposit" after your approval has been confirmed.
                  </p>
                </>
              ) : (
                <>
                  {" "}
                  <button
                    className="mt-5 mb-3 text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800"
                    onClick={() => deposit_token()}
                  >
                    {" "}
                    Deposit
                  </button>
                </>
              )}
              <button
                className="mb-5 text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:focus:ring-blue-800"
                onClick={() => Withdraw()}
              >
                {" "}
                Withdraw
              </button>
              <div className="text-white"> Your Balance: {Number(balance / 10**18).toString()}</div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}
