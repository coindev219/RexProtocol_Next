import React, { useState, useEffect, useCallback } from "react";
import "tailwindcss-elevation";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { encode } from "@api3/airnode-abi";
import { 
  airnode,
  active_deposit_vault,
  symbol_address
 } from "../../constants/addresses";
import { Contract } from "@ethersproject/contracts";
import { abiObject } from "../../contracts/abi";
import { formatEther } from "@ethersproject/units";
import {
  useAccount,
  useNetwork,
  useContractRead,
  useContractWrite,
} from "wagmi";
type Props = {
	resourceid: string;
	name: string;
  highestbid: string;
};

const banned_countries = ["RU"];

export default function TradeWidget(props: Props) {
	// get props from parent component
	const { 
		resourceid,
		name,
    highestbid
	} = props;

	const [currentTab, setCurrentTab] = useState("2");
  const [currentOrderTab, setCurrentOrderTab] = useState("buy");

	// orderstates
	const [order_side, setorder_side] = useState(String);
	const [order_size, setorder_size] = useState(String);
	const [order_variant, setorder_variant] = useState("MARKET");
	const [order_price, setorder_price] = useState(String);
	const [orderplaced, setorderplaced] = useState(Boolean);

  const [balance, setBalance] = useState(0);
  const [stablecoinBalance, setStablecoinBalance] = useState(0);


	// loading states
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [loading, setLoading] = useState(false);



  let { chain } = useNetwork();
  let current_chain = chain?.id;

  const { address, isConnected } = useAccount();

  useEffect(() => {
    GetTokenDepositInfo;
    GetTokenDepositInfoUSDC;

  },[])
  
  const { data: GetTokenDepositInfo } = useContractRead({
    address: active_deposit_vault,
    abi: abiObject,
    functionName: "GetTokenDepositInfo",
    chainId: current_chain,
    watch: true,
    args: [resourceid, address],
    onSuccess(data) {
       setBalance(Number(data)/ 10 **18);
    },
  });
  const { data: GetTokenDepositInfoUSDC } = useContractRead({
    address: active_deposit_vault,
    abi: abiObject,
    functionName: "GetTokenDepositInfo",
    chainId: current_chain,
    watch: true,
    args: [symbol_address.USDC, address],
    onSuccess(data) {
          setStablecoinBalance(Number(data)/ 10 **18);
    },
  });

	useEffect(() => {
    // Set Limit tab as active initially when the component mounts
    handleTabClick({ target: { id: "2" } });
    // Set Buy tab as active initially when the component mounts
    handleOrderTabClick("buy");
  }, []);


  const tabs = [
    {
      id: 1,
      tabTitle: "Market",
    },
    {
      id: 2,
      tabTitle: "Limit",
    },
  ];

	const handleTabClick = (e: any) => {
    setCurrentTab(e.target.id);
    if (e.target.id == 1) {
      setorder_variant("MARKET");
    }
    if (e.target.id == 2) {
      setorder_variant("LIMIT");
    }
  };

  const handleOrderTabClick = (tabId: any) => {
    setCurrentOrderTab(tabId);
    if (tabId === "buy") {
      setorder_side("BUY");
    }
    if (tabId === "sell") {
      setorder_side("SELL");
    }
  };

	async function PlaceOrder() {
    if (!isConnected) {
      Swal.fire({
        icon: "error",
        title: "Please Connect Your Wallet",
      });
      return;
    }
    if (!order_side || !order_size) {
      Swal.fire({
        icon: "error",
        title: " Please fill in all fields before submitting",
        text: "if you do not submit a price, your order will be executed at market price",
      });
      return;
    }
    if (parseFloat(order_size) <= 0) {
      Swal.fire({
        icon: "error",
        title: " Please fill in all fields before submitting",
        text: "You cannot submit an order with no order size",
      });
      return;
    }
    if (order_variant === "LIMIT" && parseFloat(order_price) <= 0) {
      Swal.fire({
        icon: "error",
        title: " Please fill in all fields before submitting",
        text: "You must submit a price with a limit order",
      });
      return;
    }

    if (order_side === "BUY") {
      const requiredBalance = parseFloat(order_size) * parseFloat(order_variant === "LIMIT" ? order_price : highestbid);
      if (stablecoinBalance < requiredBalance) {
        Swal.fire({
          icon: "error",
          title: "Insufficient balance",
          text: `Your USDC balance is insufficient for this buy order. You need at least ${requiredBalance} USDC.`,
        });
        return;
      }
    }

    if (order_side === "SELL") {
      if (parseFloat(order_size) > balance) {
        Swal.fire({
          icon: "error",
          title: "Insufficient balance",
          text: `Your ${name} balance is insufficient for this sell order. You need at least ${parseFloat(order_size)} ${name}.`,
        });
        return;
      }
    }

    const response: any = await fetch("https://ipapi.co/json/");
    const location_info = await response.json();
    if (banned_countries.includes(location_info.country_code)) {
      Swal.fire({
        icon: "error",
        title: "Not allowed",
        text: `Trading in your country is not allowed!`,
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, place it!'
    });
    if (!result.isConfirmed)
      return

    //use assettypein program to add to ob, use it also to fech book
    let swalIcon: any = "success";
    let swalTitle: any = "Your order has been placed";
    let swalText: any = "";
    try {
      setLoading(true);
      const formatdecimals = order_size;
      const formatprice = order_price;
      // console.log(order_price, order_size, "order size and price");
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
          address: address?.toString(),
          order_price: formatprice,
          asset_type: "[]",
          order_variant,
          order_side,
        }),
      };
      console.log( 
      formatdecimals,
      address?.toString(),
      formatprice,
      "[]",
      order_variant,
      order_side)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/order/?id=${resourceid}`,
        options
      );
      if (response.status === 400) {
        const error = await response.json()
        if (error.type === 1) {
          swalIcon = "error";
          swalTitle = "Your order cannot be executed";
          swalText = "You can't place a matching order with yourself"
          return;
        }
      }
      const data = await response.json();
      console.log(data);
      if (data._tradeid == null) {
        console.log("no_trade");
        return;
      } else {
        let Data = await data;
        const parametersRaw = [
          {
            type: "string",
            name: "queryParam",
            value: `${Data._tradeid}.${resourceid}`,
          },
          { type: "string", name: "_path", value: "status" },
          { type: "string", name: "_type", value: "int256" },
        ];
        const parameters = await encode(parametersRaw);

        const endpointId = airnode.endpoint_id;
        const airnode_details = [
          airnode.airnode_address,
          airnode.sponsor_address,
          airnode.sponsor_wallet_address,
        ];

        const pair = [Data.token_1, Data.token_2];
        let buyer_am = Data.buy_amnts.map((num: any) => num.toString());
        let seller_am = Data.sell_amnts.map((num: any) => num.toString());
        const participants = [Data.sellers, Data.buyers];
        const trade_amounts = [buyer_am, seller_am];

        SubmitOrder({
          args: [
            pair,
            participants,
            trade_amounts,
            airnode_details,
            endpointId,
            parameters,
          ],
        }); // The empty dependency array ensures this effect runs once
      }
    } catch (error) {
      console.log(error);
    } finally {
      Swal.fire({
        icon: swalIcon,
        title: swalTitle,
        text: swalText
      });
      setorderplaced(!orderplaced);
      setLoading(false);
    }
  }

  const { write: SubmitOrder } = useContractWrite({
    address: active_deposit_vault,
    abi: abiObject,
    functionName: "SubmitOrder",
    account: address,

    onSuccess(data) {
      Swal.fire({
        icon: "success",
        title: `Trade Executed`,
      });
  },
    onError(err) {
      Swal.fire({
        icon: "error",
        title: `An error occured with executing your trade,  please contact support if issue perists${err.cause}`,
      });
    },
  });



  return (
    <div className="flex ml-3 bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] p-1 rounded-lg w-112 h-fit">
      <div className="bg-black rounded-lg w-112 text-center min-h-[550px]">
        <div className=" mb-5 justify-center pb-2 w-full md:w-full flex flex-col items-center">
          <div className="justify-center w-full">
            <div className="tabs h-15">
              {tabs.map((tab, i) => (
                <button
                  className="cursor-pointer flex justify-center"
                  key={i}
                  id={JSON.stringify(tab.id)}
                  disabled={currentTab === `${tab.id}`}
                  onClick={handleTabClick}
                >
                  {tab.tabTitle}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              {tabs.map((tab, i) => (
                <div key={i}>{currentTab === `${tab.id}`}</div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <div
                className="flex flex-row mb-8"
                style={{ justifyContent: "center" }}
              >
                <div
                  className={`buytab ${
                    currentOrderTab === "buy" ? "active" : ""
                  }`}
                  style={{ justifyContent: "center", marginRight: "0" }}
                >
                  <button
                    disabled={currentOrderTab === "buy"}
                    onClick={() => {
                      handleOrderTabClick("buy");
                      setorder_side("BUY");
                    }}
                  >
                    Buy
                  </button>
                </div>
                <div
                  className={`selltab ${
                    currentOrderTab === "sell" ? "active" : ""
                  }`}
                  style={{ justifyContent: "center", marginLeft: "0" }}
                >
                  <button
                    disabled={currentOrderTab === "sell"}
                    onClick={() => {
                      handleOrderTabClick("sell");
                      setorder_side("SELL");
                    }}
                  >
                    Sell
                  </button>
                </div>
              </div>
              {order_variant == "MARKET" ? "Market Order" : "Limit Order"}
            </div>
          </div>
          {order_variant == "MARKET" ? (
            <></>
          ) : (
            <label
              className="mt-4"
              style={{ color: "#ffffff" }}
              htmlFor="fname"
            >
              Order Price (USDC)
            </label>
          )}

          {order_variant == "MARKET" ? (
            <></>
          ) : (
            <input
              className="bg-black mb-4 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onInput={(e) => {
                let inputValue = (e.target as HTMLInputElement).value;
                let sanitizedValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-period characters

                if (sanitizedValue !== inputValue) {
                  (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                }

                const periodCount = sanitizedValue.split(".").length - 1;
                if (periodCount > 1) {
                  sanitizedValue = sanitizedValue.replace(/\./g, ""); // Remove extra periods
                  (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                }

                if (sanitizedValue.startsWith(".")) {
                  sanitizedValue = `0${sanitizedValue}`; // Add a zero before the period
                  (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                }

                setorder_price(parseFloat(sanitizedValue).toString());
              }}
              type="text"
              min=".0000001"
              id="fname"
              name="order_price"
              placeholder="price of order"
              style={{ maxWidth: "90%" }}
            ></input>
          )}
          <label style={{ color: "#ffffff" }} htmlFor="fname">
            Order Size ({name})
          </label>
          <input
            className="mb-4 bg-black border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onInput={(e) => {
              let inputValue = (e.target as HTMLInputElement).value;
              let sanitizedValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-period characters

              if (sanitizedValue !== inputValue) {
                (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
              }

              const periodCount = sanitizedValue.split(".").length - 1;
              if (periodCount > 1) {
                sanitizedValue = sanitizedValue.replace(/\./g, ""); // Remove extra periods
                (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
              }

              if (sanitizedValue.startsWith(".")) {
                sanitizedValue = `0${sanitizedValue}`; // Add a zero before the period
                (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
              }

              setorder_size(parseFloat(sanitizedValue).toString());
            }}
            type="text"
            id="fname"
            min=".0000001"
            name="order_size"
            placeholder="size of order"
            style={{ maxWidth: "90%" }}
          ></input>

          <button
            type="button"
            id="orderbtn"
            onClick={() => PlaceOrder() }
            className="bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] m-4  text-black  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <div>
              {loading ? (
                <Spin indicator={antIcon} className="add-spinner" />
              ) : (
                "Place Order"
              )}
            </div>
          </button>
          <p className="mt-5">
            Estimated Max Order Price in USDC: $
            {(Number(order_size) * Number(order_price)).toFixed(2)}
          </p>
          <p className="mb-3">
            Your {name} Balance:{" "}
            {balance.toLocaleString("en-US", { maximumFractionDigits: 18 })}
            <br />
            Your USDC Balance:{" "}
            {stablecoinBalance.toLocaleString("en-US", {
              maximumFractionDigits: 18,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
