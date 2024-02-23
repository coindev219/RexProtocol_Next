import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ScrollpositionAnimation from "../../hooks/OnScroll";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
import EditOrdercomponent from "../../components/Portfolio/EditOrderSection";
import BalancesComponent from "@/components/Portfolio/BalancesSection";
import TradeHistoryComponent from "@/components/Portfolio/TradeHistorySection";
import StatisticsComponent from "@/components/Portfolio/StatisticsSection";

export default function UserPortfolio() {
  const router = useRouter()
  
  // Tab Control
 
  const [tab_variant, settab_variant] = useState("OVERVIEW");

  const handleTabClick = (tabId: any) => {
    settab_variant(tabId);
    if (tabId === "balances") {
      settab_variant("BALANCES");
    }
    if (tabId === "orders") {
      settab_variant("ORDERS");
    }
    if (tabId === "history") {
      settab_variant("HISTORY");
    }
    if (tabId === "stats") {
      settab_variant("STATS")
    }
  };

  useEffect(() => {
    // Set overview tab as active initially when the component mounts
    handleTabClick("balances");
    if (router.query.tab === "orders") {
      settab_variant("ORDERS");
    }
  }, []);

  return (
    <>
      <div className="bg-black ">
        <div className="bg-black pb-2 lg:pb-5">
          <HeaderComponent></HeaderComponent>
        </div>
        <div className={"bg-black bg-no-repeat bg-cover bg-center bg-fixed"}>
          <div className= "w-full bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] p-1 mt-20 rounded-lg">
            <div className = "w-full bg-black">
              
                <div className="portfolioTabs h-15">
                  {/* Begin Balances Tab*/}
                  <div
                    className={`portfolioTab ${tab_variant === "BALANCES" ? 'active' : ''}`}
                    >
                      <button
                        disabled={tab_variant === "BALANCES"}
                        onClick={() => {
                          handleTabClick("balances");
                          settab_variant("BALANCES");
                          }}
                        >
                        Balances
                      </button>
                  </div>
                  {/* End Balances Tab*/}
                  {/* Begin Orders Tab*/}
                  <div
                    className={`portfolioTab ${tab_variant === "ORDERS" ? 'active' : ''}`}
                    >
                      <button
                        disabled={tab_variant === "ORDERS"}
                        onClick={() => {
                          handleTabClick("orders");
                          settab_variant("ORDERS");
                          }}
                        >
                        Orders
                      </button>
                  </div>
                  {/* End Orders Tab*/}
                  {/* Begin History Tab*/}
                  <div
                    className={`portfolioTab ${tab_variant === "HISTORY" ? 'active' : ''}`}
                    >
                      <button
                        disabled={tab_variant === "HISTORY"}
                        onClick={() => {
                          handleTabClick("history");
                          settab_variant("HISTORY");
                          }}
                        >
                        History
                      </button>
                  </div>
                  {/* End History Tab*/}
                  {/* Begin Stats Tab*/}
                  <div
                    className={`portfolioTab ${tab_variant === "STATS" ? 'active' : ''}`}
                    >
                      <button
                        disabled={tab_variant === "STATS"}
                        onClick={() => {
                          handleTabClick("stats");
                          settab_variant("STATS");
                          }}
                        >
                        Statistics
                      </button>
                  </div>
                  {/* End Stats Tab*/}
                </div>
                {/*Begin Balances Section */}
                { tab_variant == "BALANCES" ? (
                    <div className="flex flex-col text-center w-300 items-center h-screen">
                      <BalancesComponent/>
                    </div>
                    ) :
                    (<></>)
                  }
                {/*End Balances Section */}
                {/*Begin Orders Section */}
                  { tab_variant == "ORDERS" ? (
                    <div className="flex flex-col text-center items-center h-screen">
                      <EditOrdercomponent/>
                    </div>
                    ) :
                    (<></>)
                  }
                {/*End Orders Section */}
                {/*Begin Orders Section */}
                 { tab_variant == "HISTORY" ? (
                    <div className="flex flex-col text-center w-300 items-center h-screen">
                      <TradeHistoryComponent/>
                    </div>
                    ) :
                    (<></>)
                  }
                {/*End Orders Section */}
                {/*Begin Statistics Section */}
                { tab_variant == "STATS" ? (
                    <div className="flex flex-col text-center w-300 items-center h-screen">
                      <StatisticsComponent/>
                    </div>
                    ) :
                    (<></>)
                  }
                {/*End Statistics Section */}
            </div>
          </div>
          <FooterComponent></FooterComponent>
        </div>
      </div>
    </>
  );
}
