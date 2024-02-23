import { LoadingOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const StatisticsComponent = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [loading, setLoading] = useState(false);
  
  // Web3 states
 const {address} = useAccount()
  return (
    <>
      <div
        className={"tab"}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: "300px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {address ? (
            <div className="text-center h-200">
              <div
                style={{ overflow: "auto" }}
                className=" rounded-lg block p-6 text-center overflow-scroll  w-300 h-120 shadow-md"
              >
                <h1 className="text-4xl" style={{ marginBottom: "5px" }}>Coming Soon!</h1>
              </div>
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
                Connect your Wallet to view statistics
              </div>
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StatisticsComponent;
