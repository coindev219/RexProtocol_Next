import { LoadingOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import Swal from "sweetalert2";
import { OrderbookContext } from "../../context/OrderbookContext";
import { property_tokens } from "@/constants/addresses";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Table, Pagination } from 'flowbite-react';
import { useAccount } from "wagmi";
import formatDate from "@/utils/formatDate";

const EditOrdercomponent = () => {
  //const scrollY = useScrollPosition()
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  const [loading, setLoading] = useState(false);
  //const { address } = useActiveWeb3React()
  const {address}= useAccount()
  const [orderplaced, setorderplaced] = useState(Boolean);
  const [TradingPair, setasset_market] = useState(String);
  const [order_side, setorder_side] = useState(String);
  const [order_size, setorder_size] = useState(Number);
  const [order_price, setorder_price] = useState(Number);
  const [cancelhidden, setiscancelhidden] = useState(true);
  const [cancelorderdetails, setcancelorderdetails] = useState<any[]>([]);
  const [ordercancelled, setordercanceled] = useState(Boolean);
  const { resourceid, setResourceId } = useContext(OrderbookContext);

  const [name, setname] = useState("IRET0001");
  const [filterOptionState, setFilterOptionState] = useState(false);
  const [currectFilter, setCurrentFilter] = useState('All');

  const filterOptions = ["All", "Open", "Partially Filled"];

  //refs
  const PairButtonRef: any = useRef();

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

  const showOrderInfo = (order: any) => {
    let filled_part: any = [];
    let cnt = 0, sum_of_price = 0, sum_of_size = 0;

    if (order.filled_part.length > 0)
      filled_part = [[...order.filled_part[0]]];

    order.filled_part.forEach((part: any, index: number) => {
      sum_of_price += parseFloat(part[0]) * parseInt(part[1])
      sum_of_size += parseInt(part[1])

      if (cnt >= index)
        return;

      if (part[0] === filled_part[cnt][0]) {
        filled_part[cnt][1] = parseInt(filled_part[cnt][1]) + parseInt(part[1]);
        return;
      }

      filled_part.push(part);
      cnt ++;
    })

    const average_price = sum_of_price / sum_of_size;
    const filled_part_html = filled_part.length > 0
      ? (filled_part.map(
          (part: any[]) => `<p>- ${part[1]} ${name} at $${part[0]}</p>`
        )).join("")
      : "–";

    Swal.fire({
      icon: "info",
      title: `${name}/USDC`,
      html: `
        <div class="grid grid-cols-2 gap-4">
          <div class="text-left">${order.order_variant}/${order.order_side}</div>
          <div class="text-right">
            ${parseInt(order.filled_size) > 0 ? "Partially Filled" : "Open"}
          </div>
          <div class="text-left">Time</div>
          <div class="text-right">${
            order.timestamp
              ? formatDate(new Date(parseInt(order.timestamp) * 1000))
              : "–"
          }</div>
          <div class="text-left">Filled / Amount</div>
          <div class="text-right">${order.filled_size} / ${order.order_size} ${name}</div>
          <div class="text-left">Average / Price</div>
          <div class="text-right">$${average_price.toPrecision(4).replace(/(?:\.0*|(\.\d+?)0+)$/, '$1') || 0} / $${order.order_price}</div>
          <div class="text-left">Filled Part</div>
          <div class="text-right">${filled_part_html}</div>
        </div>
      `,
    });
  };

  async function handlecancelorder(i: any) {
    const order_id_final = i.$oid;
    const confirm = Swal.fire({
      icon: "warning",
      title: "You are wanting to cancel your order, please confrim",
      text: "Make sure you understand this, by clicking ok you will cancel your on the book order and it will not be filled, make sure your selecting the right order",
      cancelButtonAriaLabel: "cancel",
      showCancelButton: true,
    });
    const confirmwithdraw = (await confirm).isConfirmed;
    if (confirmwithdraw === true) {
      CancelOrder(order_id_final);
      setordercanceled(true);
    } else {
      return;
    }
  }
  useEffect(() => {
    async function FetchOrderbook() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URI}/order/?id=${resourceid}&address=${address}`,
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
        await setcancelorderdetails(data);
        setLoading(false);
        return awaitdata;
      } catch (error) {
        console.log(error);
      } finally {
        setasset_market("WETHUSDC");
      }
    }
    FetchOrderbook();
  }, [orderplaced]);
 
  async function CancelOrder(order_id_final: any) {
    if (!address) {
      Swal.fire({
        icon: "error",
        title: "Connect your Wallet to submit a Transaction",
      });
      return;
    }
    try {
      setLoading(true);
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
          _id: order_id_final,
          order_id: 0,
          order_size,
          address: address,
          order_price,
          AssetType: "WETHUSDC",
          order_variant: "CANCELORDER",
          order_side,
        }),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/order/?id=${resourceid}&address=${address}`,
        options
      );
      const data = await response.json();
      await setcancelorderdetails(data);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      Swal.fire({
        icon: "success",
        title: "Your order has been cancelled",
      });
      setLoading(false);
    }
  }

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
  const [ordersCount, setOrdersCount] = useState(0);
  const [arroforderids, setArrOfOrderids]: any[] = useState<any[]>([]);
  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const orderids = cancelorderdetails.map((order, index) => {
      if (currectFilter === filterOptions[1] && parseInt(order.filled_size) !== 0)
        return null;
      if (currectFilter === filterOptions[2] && parseInt(order.filled_size) < 1)
        return null;

      return(
        <Table.Row
          className="bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          key={index}
        >
          <Table.Cell className="px-2 py-2 justify-center items-center cursor-pointer">
            <button onClick={() => showOrderInfo(order)}>
              <InfoCircleOutlined style={{ fontSize: 20 }} />
            </button>
          </Table.Cell>
          <Table.Cell className="pl-0 py-2">{order.timestamp ? formatDate(new Date(parseInt(order.timestamp) * 1000)) : '–'}</Table.Cell>
          <Table.Cell className="px-6 py-2">{`${name}/USDC`}</Table.Cell>
          <Table.Cell className="px-6 py-2">{order.order_variant}</Table.Cell>
          <Table.Cell className="px-6 py-2">
            <div className="flex items-center">
              {order.order_side === "SELL" ? (
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
              )}
              {order.order_side}
            </div>
          </Table.Cell>
          <Table.Cell className="px-6 py-2">{`$${order.order_price}`}</Table.Cell>
          <Table.Cell className="px-6 py-2">{`${order.order_size} ${name}`}</Table.Cell>
          <Table.Cell className="px-6 py-2">
            {`${order.filled_size || 0} ${name}`}
          </Table.Cell>
          <Table.Cell className="px-6 py-2">
            <button
              className="text-center text-black bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] items-center hover:scale-95 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
              onClick={() => handlecancelorder(order._id)}
            >
              <p className="text-black">Cancel Order</p>
            </button>
          </Table.Cell>
        </Table.Row>
      )
    }).filter((element) => element !== null);
    setArrOfOrderids(orderids);
    setOrdersCount(orderids.length);
    setCurrentPage(1);
  }, [cancelorderdetails, currectFilter]);

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
          className={`z-10 flex-row w-40 hover:scale-95  ml-6 transition-all text-center relative rounded-md bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] items-center justify-center`}
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
                  <Table.HeadCell className="px-2 py-3"></Table.HeadCell>
                  <Table.HeadCell className="pl-0 py-3">
                    Time
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-3">
                    Symbol
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-3">
                    Type
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-3">
                    Side
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-3">
                    Price
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-3">
                    Amount
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-3">
                    Filled
                  </Table.HeadCell>
                  <Table.HeadCell className="px-6 py-3">
                    Action
                  </Table.HeadCell>
                </Table.Head>
                {!loading && <Table.Body className="divide-y">{arroforderids.slice((currentPage-1) * showingNumber, currentPage * showingNumber)}</Table.Body>}
              </Table>
              {/* Begin Pagination */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-center sm:hidden">
                  <Pagination layout="navigation" currentPage={currentPage} totalPages={Math.ceil(ordersCount / showingNumber)} onPageChange={onPageChange} showIcons theme={{base: "dark"}} />
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <span className="text-sm text-gray-400 dark:text-gray-400">
                      Showing <span className="font-semibold text-gray-300 dark:text-white">{(currentPage-1) * showingNumber + 1}</span> to <span className="font-semibold text-gray-300 dark:text-white">{Math.min(currentPage * showingNumber, ordersCount)}</span> of <span className="font-semibold text-gray-300 dark:text-white">{ordersCount}</span> Entries
                    </span>
                  </div>
                  <div>
                    <Pagination
                      layout="pagination"
                      currentPage={currentPage}
                      totalPages={Math.ceil(ordersCount / showingNumber)}
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
              className="items-center justify-center"
            >
              {" "}
              <div className="mb-5">
                Connect your Wallet to view your orders
              </div>
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditOrdercomponent;
