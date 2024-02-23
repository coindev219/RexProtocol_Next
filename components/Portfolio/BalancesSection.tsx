import { LoadingOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import DepositModalComponent from "../DepositModal/Depositmodal";
import Swal from "sweetalert2";
import { useNetwork, useAccount, useContractReads, useContractWrite } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import usdcLogo from "../../assets/images/usdc-logo.png";
import { abiObject } from "../../contracts/abi";
import { 
  property_tokens,
  active_deposit_vault,
  symbol_address
 } from "../../constants/addresses";

const BalancesComponent = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  const [loading, setLoading] = useState(false);
  const {address} = useAccount()

  // balance state
  const [balances, setBalances] = useState<any[]>([]);

  // get chain info
  let { chain } = useNetwork();
  let current_chain = chain?.id;
  
  const token_addresses = [symbol_address.USDC, ...property_tokens];
  // token names: we will get these values from the db in the future
  const token_names = ["USDC", "IRET0001", "IRET0002", "IRET0003", "IRET0004", "IRET0005", "IRET0006"];
  const contracts: any[] = token_addresses.map((token_address) => ({
    address: active_deposit_vault,
    abi: abiObject,
    functionName: "GetTokenDepositInfo",
    chainId: current_chain,
    watch: true,
    args: [token_address, address],
  }));

  const { data: GetTokenDepositInfo } = useContractReads({
    contracts: contracts,
    onSuccess(data) {
      const results = data.map(({result}) => (Number(result)/ 10 **18));
      setBalances(results);
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    GetTokenDepositInfo;
  }, []);

  return (
    <>
      <div
        className="w-full text-center"
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: "300px",
        }}
      >
        <div
          className="text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#ffffff",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {address ? (
            <div className="w-full text-center h-200">
              {!loading && (
                <div className="mx-6 my-3 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
                  {token_names.map((name, index) => (
                    <div className="group relative m-0 md:m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
                      <div className="flex flex-col items-center py-8 border rounded-lg shadow bg-black border-gray-700">
                        <Image
                          className="mb-3 rounded-full shadow-lg"
                          src={usdcLogo}
                          width={96}
                          height={96}
                          alt="Bonnie image"
                        />
                        <h5 className="my-3 text-xl font-medium text-white">
                          {name}
                        </h5>
                        <span className="text-md text-gray-400">
                          {balances[index]}
                        </span>
                        <div className="flex mt-3 md:mt-4">
                          <DepositModalComponent current_token={token_addresses[index]} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {loading && (
                <div className="w-full text-center items-center justify-center objects-center mb-2 text-4xl font-bold tracking-tight text-white dark:text-white">
                  <div className="flex flex-col">
                    <div className="items-center my-40 justify-center">
                      {antIcon}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minWidth: "300px",
              }}
              className="items-center"
            >
              {" "}
              <div className="mb-5">
                Connect your Wallet to view your balances
              </div>
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BalancesComponent;
