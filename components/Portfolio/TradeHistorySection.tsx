import { LoadingOutlined } from "@ant-design/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { property_tokens } from "@/constants/addresses";
import { OrderbookContext } from "../../context/OrderbookContext";
import Swal from "sweetalert2";
import { Table, Pagination } from 'flowbite-react';
import { useAccount } from "wagmi";
import formatDate from "@/utils/formatDate";


const TradeHistoryComponent = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  const [loading, setLoading] = useState(false);
  
  // states
  const [orderHistories, setOrderHistories] = useState<any[]>([]);
  const [name, setname] = useState("IRET0001");
  const [filterOptionState, setFilterOptionState] = useState(false);
  const [currectFilter, setCurrentFilter] = useState('All');

  const filterOptions = ["All", "Filled", "Canceled"];

  //refs
  const PairButtonRef: any = useRef();

  // context
  const { resourceid, setResourceId } = useContext(OrderbookContext);

  // Web3 states
  const { address} = useAccount()

  useEffect(() => {
    if (resourceid == property_tokens[0]) {
      setname("IRET0001");
    }
    if (resourceid == property_tokens[1]) {
      setname("IRET0002");
    }
    if (resourceid == property_tokens[2]) {
      setname("IRET0003");
    }
    if (resourceid == property_tokens[3]) {
      setname("IRET0004");
    }
    if (resourceid == property_tokens[4]) {
      setname("IRET0005");
    }
    if (resourceid == property_tokens[5]) {
      setname("IRET0006");
    }
  }, [resourceid]);

  useEffect(() => {
    async function FetchOrderHistory() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URI}/order/histories?id=${resourceid}&address=${address}`,
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
        console.log(data)
        const awaitdata = await data;
        await setOrderHistories(data);
        setLoading(false);
        return awaitdata;
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
    FetchOrderHistory();
  }, []);

  //event listeners
  function OnOffClick() {
    if (!PairButtonRef?.current.contains(event?.target)) {
      // Clicked outside the header, so close it
      setFilterOptionState(false);
    }
  }

  useEffect(() => {
    window.addEventListener("click", OnOffClick);

    return () => {
      window.removeEventListener("click", OnOffClick);
    };
  }, []);

  const handleOptionSelected = (index: number) => {
    setCurrentFilter(filterOptions[index]);
  }

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [showingNumber, setShowingNumber] = useState(10);
  const [historiesCount, setHistoriesCount] = useState(0);
  const [arrofhistories, setArrOfHistories]: any[] = useState<any[]>([]);
  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const histories = orderHistories.map((history, index) => {
      if (currectFilter === filterOptions[1] && history.status !== filterOptions[1])
        return null;
      if (currectFilter === filterOptions[2] && history.status !== filterOptions[2])
        return null;
  
      return(
        <Table.Row
          className="bg-black border-b border-gray-800 text-gray-400 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600"
          key={index}
        >
          <Table.Cell className="px-6 py-2">{history.timestamp ? formatDate(new Date(parseInt(history.timestamp) * 1000)) : '–'}</Table.Cell>
          <Table.Cell className="px-6 py-2">{`${name}/USDC`}</Table.Cell>
          <Table.Cell className="px-6 py-2">{history.order_variant}</Table.Cell>
          <Table.Cell className="px-6 py-2">
            <div className="flex items-center">
              {history.order_side === "SELL" ? (
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
              )}
              {history.order_side}
            </div>
          </Table.Cell>
          <Table.Cell className="px-6 py-2">{`$${history.average_price.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1')}`}</Table.Cell>
          <Table.Cell className="px-6 py-2">{`$${history.order_price}`}</Table.Cell>
          <Table.Cell className="px-6 py-2">{`${history.order_size} ${name}`}</Table.Cell>
          <Table.Cell className="px-6 py-2">{history.status}</Table.Cell>
        </Table.Row>
      )
    }).filter((element) => element !== null);
    setArrOfHistories(histories);
    setHistoriesCount(histories.length);
    setCurrentPage(1);
  }, [orderHistories, currectFilter]);

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
          ref={PairButtonRef}
          className={`z-10 flex-row w-32 hover:scale-95  ml-6 transition-all text-center relative rounded-md bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] items-center justify-center`}
        >
          <div
            onClick={() => setFilterOptionState(!filterOptionState)}
            className={`${
              filterOptionState
                ? "rounded-br-0 rounded-bl-0 "
                : "rounded-br-md rounded-bl-md"
            } rounded-tl-md rounded-tr-md cursor-pointer p-2 m-1 bg-black hover:bg-slate-900 items-center`}
          >
            <div className="flex flex-row items-center">
              <div className="w-full text-left">
                <h1 className="text-md text-white">{currectFilter}</h1>
              </div>
              <div className="w-auto">
                <svg
                  className="w-7 ml-2 h-7 float-right"
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
          </div>
          <div
            className={`bg-black align-top z-20 absolute justify-center w-full rounded-br-md rounded-bl-md text-center items-center ${
              filterOptionState ? "" : "hidden"
            }`}
          >
            <ul
              onClick={() => setFilterOptionState(false)}
              className="py-2 rounded cursor-pointer text-sm"
            >
              {filterOptions.map((option, index) => (
                <li
                  className={`hover:bg-slate-900`}
                  onClick={() => handleOptionSelected(index)}
                  key={index}
                >
                  {" "}
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
              <Table className="mt-4" theme={{root: {base: "dark w-full text-sm text-left"}}} hoverable>
                <Table.Head>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Time
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Symbol
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Type
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Side
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Average
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Price
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Amount
                  </Table.HeadCell>
                  <Table.HeadCell scope="col" className="px-6 py-3">
                      Status
                  </Table.HeadCell>
                  </Table.Head>
                  {!loading && <Table.Body className="divide-y">{arrofhistories.slice((currentPage-1) * showingNumber, currentPage * showingNumber)}</Table.Body>}
                </Table>
                {/* Begin Pagination */}
                <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-center sm:hidden">
                  <Pagination layout="navigation" currentPage={currentPage} totalPages={Math.ceil(historiesCount / showingNumber)} onPageChange={onPageChange} showIcons theme={{base: "dark"}} />
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <span className="text-sm text-gray-400 dark:text-gray-400">
                      Showing <span className="font-semibold text-gray-300 dark:text-white">{(currentPage-1) * showingNumber + 1}</span> to <span className="font-semibold text-gray-300 dark:text-white">{Math.min(currentPage * showingNumber, historiesCount)}</span> of <span className="font-semibold text-gray-300 dark:text-white">{historiesCount}</span> Entries
                    </span>
                  </div>
                  <div>
                    <Pagination
                      layout="pagination"
                      currentPage={currentPage}
                      totalPages={Math.ceil(historiesCount / showingNumber)}
                      onPageChange={onPageChange}
                      previousLabel=""
                      nextLabel=""
                      showIcons
                      theme={{base: "dark"}}
                    />
                  </div>
                </div>
              </div>
                {/* End Pagination */}
                {loading && (
                  <div className="w-full text-center items-center justify-center objects-center mb-2 text-4xl font-bold tracking-tight text-white dark:text-white">
                    <div className="flex flex-col">
                      <div className="items-center my-20 justify-center">
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
                Connect your Wallet to view your trade history
              </div>
              <ConnectButton/>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TradeHistoryComponent;
