
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TradeWidget from "../../components/Exchange/TradeWidget";
import PropertyInfoBox from "../../components/Exchange/PropertyInfoBox";
import Swal from "sweetalert2";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
import OrderSection from "../../components/Exchange/OrderComponent";
import EditOrdercomponent from "../../components/Portfolio/EditOrderSection";

import DepositModalComponent from "../../components/DepositModal/Depositmodal";
import { property_tokens } from "../../constants/addresses";
import { Dropdown } from "flowbite-react";
import LoadingScreen from "../../components/LoadingScreen/loadingScreen";
import { OrderbookContext } from "../../context/OrderbookContext";
import { Loader } from "@googlemaps/js-api-loader";
import FetchPropertyInformation from "../../data/Marketinformation";
import { MarketContext } from "../../context/MarketContext";
import { useRouter } from "next/router";
import PairSelector from "../../components/Buttons/PairSelectorButton";
import useFetchBook from "../../hooks/FetchBook";

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  IBasicDataFeed,
  IDatafeedQuotesApi,
} from "@/public/static/charting_library/charting_library";
import dynamic from "next/dynamic";
import Script from "next/script";

import Datafeed from "@/hooks/TVChart/Datafeed";
import { useAccount } from "wagmi";

const defaultWidgetProps: Partial<ChartingLibraryWidgetOptions> = {
  symbol: "IRET0001/USDC",
  datafeed: Datafeed as IBasicDataFeed | (IBasicDataFeed & IDatafeedQuotesApi),
  interval: "30" as ResolutionString,
  library_path: "/static/charting_library/",
  locale: "en",
  // charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
};

const TVChartContainer = dynamic(
  () =>
    import("@/components/TVChartContainer").then((mod) => mod.TVChartContainer),
  { ssr: false }
);

// for cancel order just pass in string of orderid - just the id

interface Ordertype {
  order_status: 1; // Use the appropriate enum value (1 for OrderStatus.UNFILLED)
  taker_token: string; // Replace with the actual taker token address
  maker_token: string; // Replace with the actual maker token address
  takers: []; // Replace with actual taker addresses
  makers: []; // Replace with actual maker addresses
  taker_amounts: []; // Replace with the amounts for the takers
  maker_amounts: []; // Replace with the amounts for the makers
  _id: string;
}
const Exchange = () => {
  const { highestbid, highestask } = useFetchBook();
  const [marketCap, setMarketCap] = useState(0);
  const formattedMarketCap = "$" + marketCap.toLocaleString("en-US");

  // Periodically update Market Cap
  useEffect(() => {
    const intervalId = setInterval(() => {
      const numHighestBid = parseFloat(highestbid);
      setMarketCap(numHighestBid * 1000000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [highestbid]);

  const {address } = useAccount()

  // orderstates
  const [orderplaced, setorderplaced] = useState(Boolean);
  const [balance, setBalance] = useState(0);
  const [stablecoinBalance, setStablecoinBalance] = useState(0);

  //context states
  const { resourceid } = useContext(OrderbookContext);
  const { itemid } = useContext(MarketContext);
  const PropertyInformation = FetchPropertyInformation(itemid);

  // google maps
  function FetchMap(PropertyInformation: any) {
    let map: google.maps.Map;

    const loader = new Loader({
      apiKey: "AIzaSyDClPR5i3HMbYZGeUsKJGB39n-433oKQ-A",
      version: "weekly",
    });

    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      var geocoder = new google.maps.Geocoder();
      let address = PropertyInformation?.address as string;
      geocoder.geocode({ address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results !== null) {
          const { geometry } = results[0];
          if (geometry) {
            const { location } = geometry;
            if (location) {
              new google.maps.Marker({
                position: location,
                map: map,
              });
              map.setCenter(location);
            }
          }
        } else {
          console.error(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
      map = new Map(document.getElementById("map") as HTMLElement, {
        mapTypeId: google.maps.MapTypeId.HYBRID,
        zoom: 12,
      });
    });
  }

  //Additional Constant
  const propertyName = PropertyInformation.name;
  const noi = PropertyInformation.noi;
  const noiNumber = +noi;
  const formattedNOI = noiNumber.toLocaleString("en-US");

  const [capRate, setCapRate] = useState(0);

  // Periodically update CAP Rate
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCapRate((noiNumber / marketCap) * 100);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [noiNumber, marketCap]);

  //Fetch correct map
  useEffect(() => {
    FetchMap(PropertyInformation);
  }, [resourceid, itemid]);

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


  const [name, setname] = useState("IRET0001");
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

  const [isScriptReady, setIsScriptReady] = useState(true);

  const Chart = useMemo(() => (
    <TVChartContainer
      {...defaultWidgetProps}
      symbol={`${name}/USDC`}
    />
  ), [name]);

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <HeaderComponent></HeaderComponent>
        <div className="w-full max-w-full  bg-black pt-20 pb-4 flex flex-col">
          <PairSelector />
          <Script
            src="/static/datafeeds/udf/dist/bundle.js"
            strategy="lazyOnload"
            onReady={() => {
              setIsScriptReady(true);
            }}
          />
          <div className="mt-2">
            {isScriptReady && Chart }
          </div>
          <div className="w-full p-5 visible sm:visible md:hidden lg:hidden">
            <DepositModalComponent></DepositModalComponent>
          </div>

          <div className="mt-5 flex flex-col justify-around sm:flex-col md:flex-row gap-4">
            {/* Start Component where people place orders */}
            <TradeWidget resourceid={resourceid} name={name} highestbid={highestbid} />
            {/* End Component where people place orders */}

            {/* Start Orderbook Component */}
            <div className="">
              <OrderSection orderplaced={orderplaced}></OrderSection>
            </div>
            {/* End Orderbook Component */}

            {/* Start Property Info Component */}
            <PropertyInfoBox
              propertyName={propertyName}
              propertyInformation={PropertyInformation}
              formattedMarketCap={formattedMarketCap}
              formattedNOI={formattedNOI}
              capRate={capRate}
            />
            {/* End Property Info Component */}

            <div id="map" className="lg:flex-1 w-full md:w-112 h-[550px]"></div>
          </div>
          <hr className="h-px my-8 w-full bg-gray-200 border-0 dark:bg-gray-700" />
        </div>

        <FooterComponent></FooterComponent>
      </Suspense>
    </>
  );
};

export default Exchange;