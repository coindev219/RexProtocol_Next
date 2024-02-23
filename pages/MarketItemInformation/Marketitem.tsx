import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
import { Carousel, CarouselProps } from "flowbite-react";
import FetchPropertyInformation from "../../data/Marketinformation";
import { useContext } from "react";
import { MarketContext } from "../../context/MarketContext";
import { Loader } from "@googlemaps/js-api-loader";
import FetchMap from "../../data/Maploader";
import { OrderbookContext } from "../../context/OrderbookContext";
import { useRouter } from "next/router";
import { Finance } from "financejs";

export default function MarketItem() {
  const { itemid } = useContext(MarketContext);
  const PropertyInformation = FetchPropertyInformation(itemid);
  const { setResourceId } = useContext(OrderbookContext);
  const router = useRouter();
  const handleClick = () => {
    setResourceId(PropertyInformation.TokenID);
    router.push("/Dapp/ExchangePage");
  };
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
      let address = PropertyInformation.address as string;
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
  useEffect(() => {
    FetchMap(PropertyInformation);
  }, []);

  let propertyArray: string[] = [];
  let RenderedProperties: string[] = [];

  if (PropertyInformation.picture1 && PropertyInformation.picture1.length > 0) {
    propertyArray.push(PropertyInformation.picture1);
  }

  if (PropertyInformation.picture2 && PropertyInformation.picture2.length > 0) {
    propertyArray.push(PropertyInformation.picture2);
  }

  if (PropertyInformation.picture3 && PropertyInformation.picture3.length > 0) {
    propertyArray.push(PropertyInformation.picture3);
  }

  propertyArray.forEach((property) => {
    if (property.length > 2) {
      RenderedProperties.push(property);
    }
  });
  //Property Information Consts
  const propertyName = PropertyInformation.name;
  const propertyAddress = PropertyInformation.address;
  const propertyType = PropertyInformation.type;
  const propertyPrice = PropertyInformation.price;
  const capRate = PropertyInformation.caprate;
  const noi = PropertyInformation.noi;
  const executiveSummary = PropertyInformation.executivesummary;
  const grossIncome = PropertyInformation.grossIncome;
  const grossExpenses = PropertyInformation.grossExpenses;

  // Property Details Consts
  const propertySubType = PropertyInformation.subType;
  const buildingSize = PropertyInformation.buildingSize;
  const lotSize = PropertyInformation.lotSize;
  const yearBuilt = PropertyInformation.yearBuilt;
  const zoning = PropertyInformation.zoning;
  const additionalDetails = PropertyInformation.additionalDetails;

  // Formatted Property Detail Consts
  const buildingSizeNumber = +buildingSize;
  const formattedBuildingSize = buildingSizeNumber.toLocaleString("en-US");
  const lotSizeNumber = +lotSize;
  const formattedLotSize = lotSizeNumber.toLocaleString("en-US");

  //Formatted Information Consts
  const propertyPriceNumber = +propertyPrice;
  const formattedPropertyPrice = propertyPriceNumber.toLocaleString("en-US");
  const noiNumber = +noi;
  const formattedNOI = noiNumber.toLocaleString("en-US");
  const grossIncomeNumber = +grossIncome;
  const formattedGrossIncome = grossIncomeNumber.toLocaleString("en-US");
  const grossExpensesNumber = +grossExpenses;
  const formattedGrossExpenses = grossExpensesNumber.toLocaleString("en-US");
  const buildingSFPrice = propertyPriceNumber / buildingSizeNumber;
  const formattedBuildingSFPrice = buildingSFPrice.toLocaleString("en-US");
  const landSFPrice = propertyPriceNumber / lotSizeNumber;
  const formattedLandSFPrice = landSFPrice.toLocaleString("en-US");

  ///make new carousel - our own
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const validImages = propertyArray.filter(
    (image) => image && image.length > 2
  );

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };

  const renderImages = () => {
    const filteredImages = validImages.filter(
      (image) => image.trim().length > 0
    );

    return (
      <div className="carousel-inner flex">
        {filteredImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-item mr-0 ${
              index === currentImageIndex ? "active" : ""
            }`}
          >
            <img
              src={image}
              alt={`Property ${index}`}
              style={{ maxHeight: "750px", width: "100%" }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Tab Control
  const [tab_variant, settab_variant] = useState("OVERVIEW");

  const handleTabClick = (tabId: any) => {
    settab_variant(tabId);
    if (tabId === "overview") {
      settab_variant("OVERVIEW");
    }
    if (tabId === "details") {
      settab_variant("DETAILS");
    }
    if (tabId === "valuation") {
      settab_variant("VALUATION");
    }
    if (tabId === "market") {
      settab_variant("MARKET");
    }
    if (tabId === "finance") {
      settab_variant("FINANCE");
    }
    if (tabId === "calculator") {
      settab_variant("CALCULATOR");
    }
    if (tabId === "documents") {
      settab_variant("DOCUMENTS");
    }
    if (tabId === "news") {
      settab_variant("NEWS");
    }
  };

  useEffect(() => {
    // Set overview tab as active initially when the component mounts
    handleTabClick("overview");
  }, []);

  // IRR Calculator
  const [firstInflow, setFirstInflow] = useState(noiNumber);
  const [salePrice, setSalePrice] = useState(propertyPriceNumber);
  const [propertyAppreciation, setPropertyAppreciation] = useState(7);
  const [noiEscalations, setNoiEscalations] = useState(7);
  const [timeFrame, setTimeFrame] = useState(5);
  const [irr, setIrr] = useState(0);

  const calculateIRR = () => {
    let first_outflow = -salePrice;
    const propertyAppreciationMultiplier = 1 + propertyAppreciation / 100;
    const noiEscalationMultiplier = 1 + noiEscalations / 100;
    if (timeFrame == 1) {
      let _exit =
        salePrice * Math.pow(propertyAppreciationMultiplier, timeFrame);
      let lastInFlow = _exit + firstInflow;
      first_outflow = -salePrice;
      const finance = new Finance();
      setIrr(finance.IRR(first_outflow, lastInFlow));
    } else if (timeFrame == 2) {
      let _exit =
        salePrice * Math.pow(propertyAppreciationMultiplier, timeFrame);
      let second_inflow = firstInflow * noiEscalationMultiplier;
      let lastInFlow = _exit + second_inflow;
      first_outflow = -salePrice;
      const finance = new Finance();
      setIrr(finance.IRR(first_outflow, firstInflow, lastInFlow));
    } else if (timeFrame == 3) {
      let _exit =
        salePrice * Math.pow(propertyAppreciationMultiplier, timeFrame);
      let second_inflow = firstInflow * noiEscalationMultiplier;
      let third_inflow = second_inflow * noiEscalationMultiplier;
      let lastInFlow = _exit + third_inflow;
      first_outflow = -salePrice;
      const finance = new Finance();
      setIrr(
        finance.IRR(first_outflow, firstInflow, second_inflow, lastInFlow)
      );
    } else if (timeFrame == 4) {
      let _exit =
        salePrice * Math.pow(propertyAppreciationMultiplier, timeFrame);
      let second_inflow = firstInflow * noiEscalationMultiplier;
      let third_inflow = second_inflow * noiEscalationMultiplier;
      let fourth_inflow = third_inflow * noiEscalationMultiplier;
      let lastInFlow = _exit + fourth_inflow;
      first_outflow = -salePrice;
      const finance = new Finance();
      setIrr(
        finance.IRR(
          first_outflow,
          firstInflow,
          second_inflow,
          third_inflow,
          lastInFlow
        )
      );
    } else if (timeFrame == 5) {
      let _exit =
        salePrice * Math.pow(propertyAppreciationMultiplier, timeFrame);
      let second_inflow = firstInflow * noiEscalationMultiplier;
      let third_inflow = second_inflow * noiEscalationMultiplier;
      let fourth_inflow = third_inflow * noiEscalationMultiplier;
      let fifith_inflow = fourth_inflow * noiEscalationMultiplier;
      let lastInFlow = _exit + fifith_inflow;
      first_outflow = -salePrice;
      const finance = new Finance();
      setIrr(
        finance.IRR(
          first_outflow,
          firstInflow,
          second_inflow,
          third_inflow,
          fourth_inflow,
          lastInFlow
        )
      );
    }
  };

  // Calculate the initial IRR based on pre-selected inputs
  useEffect(() => {
    calculateIRR();
  }, []);

  // GNEWS.io API
  const gNewsAPIKey = "42e0e7a3410a45a46d8562c2896963d4";
  const BASE_URL = "https://gnews.io/api/v4";
  const [article1Title, setArticle1Title] = useState("");
  const [article1Description, setArticle1Description] = useState("");
  const [article1Url, setArticle1Url] = useState("");
  const [article2Title, setArticle2Title] = useState("");
  const [article2Description, setArticle2Description] = useState("");
  const [article2Url, setArticle2Url] = useState("");
  const [article3Title, setArticle3Title] = useState("");
  const [article3Description, setArticle3Description] = useState("");
  const [article3Url, setArticle3Url] = useState("");
  const searchTerm = PropertyInformation.city;

  async function getTopNews(topic: string, count: number = 3) {
    try {
      const response = await fetch(
        `${BASE_URL}/search?q=${topic}&lang=en&token=${gNewsAPIKey}&sortby=publishedAt`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.articles.slice(0, count);
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }

  useEffect(() => {
    setArticle1Title("");
    setArticle1Description("");
    setArticle1Url("");
    setArticle2Title("");
    setArticle2Description("");
    setArticle2Url("");
    setArticle3Title("");
    setArticle3Description("");
    setArticle3Url("");
    getTopNews(searchTerm, 3)
      .then((data) => {
        if (data.length >= 1) {
          setArticle1Title(data[0].title);
          setArticle1Description(data[0].description);
          setArticle1Url(data[0].url);
        }
        if (data.length >= 2) {
          setArticle2Title(data[1].title);
          setArticle2Description(data[1].description);
          setArticle2Url(data[1].url);
        }
        if (data.length >= 3) {
          setArticle3Title(data[2].title);
          setArticle3Description(data[2].description);
          setArticle3Url(data[2].url);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="bg-black ">
      <div className="bg-black pb-2 lg:pb-5">
        <HeaderComponent></HeaderComponent>
      </div>

      {/* <div className="mt-20 object-scale-down sm:h-96 xl:h-128 2xl:h-96">
        <Carousel className="object-scale-down" >
        {RenderedProperties.map((property, index) => (
          <img src={property} alt={`Property ${index + 1}`} />
        ))}
        </Carousel>
        </div> */}
      <div className="mx-0 bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] p-1 mt-20 rounded-lg">
        <div className="w-full bg-black">
          <div className="carousel-container flex justify-center bg-black items-center w-full">
            <div className="carousel my-2" style={{ position: "relative" }}>
              {renderImages()}
            </div>
            {currentImageIndex > 0 && (
              <button
                className="carousel-control prev absolute left-0 lg:top-1/2 top-1/4 transform -translate-y-1/2 ml-5 bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg text-black w-[100px] md:p-2 p-1"
                onClick={handlePrev}
              >
                Previous
              </button>
            )}

            {currentImageIndex < propertyArray.length - 1 && (
              <button
                className="carousel-control next absolute right-0 lg:top-1/2 top-1/4 transform -translate-y-1/2 mr-5 bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg text-black w-[100px] md:p-2 p-1"
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-right w-full bg-black">
        {/* Begin Property Information Component*/}
        <div className="w-full lg:w-1/2 p-1 mt-4 mr-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
          <div className="w-full text-center bg-black elevation-10 rounded-lg">
            {/* Begin Tabs*/}
            <div className="marketTabs flex-wrap h-15">
              {/* Begin Overview Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "OVERVIEW" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "OVERVIEW"}
                  onClick={() => {
                    handleTabClick("overview");
                    settab_variant("OVERVIEW");
                  }}
                >
                  Overview
                </button>
              </div>
              {/* End Overview Tab*/}
              {/* Begin Details Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "DETAILS" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "DETAILS"}
                  onClick={() => {
                    handleTabClick("details");
                    settab_variant("DETAILS");
                  }}
                >
                  Details
                </button>
              </div>
              {/* End Details Tab*/}
              {/* Begin Valuation Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "VALUATION" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "VALUATION"}
                  onClick={() => {
                    handleTabClick("valuation");
                    settab_variant("VALUATION");
                  }}
                >
                  Valuation
                </button>
              </div>
              {/* End Valuation Tab*/}
              {/* Begin Market Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "MARKET" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "MARKET"}
                  onClick={() => {
                    handleTabClick("market");
                    settab_variant("MARKET");
                  }}
                >
                  Market
                </button>
              </div>
              {/* End Market Tab*/}
              {/* Begin Finance Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "FINANCE" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "FINANCE"}
                  onClick={() => {
                    handleTabClick("finance");
                    settab_variant("FINANCE");
                  }}
                >
                  Finance
                </button>
              </div>
              {/* End Finance Tab*/}
              {/* Begin Calculator Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "CALCULATOR" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "CALCULATOR"}
                  onClick={() => {
                    handleTabClick("calculator");
                    settab_variant("CALCULATOR");
                  }}
                >
                  Calculator
                </button>
              </div>
              {/* End Calculator Tab*/}
              {/* Begin Documents Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "DOCUMENTS" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "DOCUMENTS"}
                  onClick={() => {
                    handleTabClick("documents");
                    settab_variant("DOCUMENTS");
                  }}
                >
                  Docs
                </button>
              </div>
              {/* End Documents Tab*/}
              {/* Begin News Tab*/}
              <div
                className={`marketTab ${
                  tab_variant === "NEWS" ? "active" : ""
                }`}
              >
                <button
                  disabled={tab_variant === "NEWS"}
                  onClick={() => {
                    handleTabClick("news");
                    settab_variant("NEWS");
                  }}
                >
                  News
                </button>
              </div>
              {/* End News Tab*/}
            </div>
            {/* End Tabs*/}

            {/*Begin Overview Section */}
            {tab_variant == "OVERVIEW" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  {propertyName}
                </h5>
                <ul className="mb-6 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl sm:px-6 text-left">
                  <li>
                    <strong>Property Address:</strong> {propertyAddress}
                  </li>
                  <br />
                  <li>
                    <strong>Property Type:</strong> {propertyType}
                  </li>
                  <br />
                  <li>
                    <strong>Price:</strong> ${formattedPropertyPrice}
                  </li>
                  <br />
                  <li>
                    <strong>CAP Rate:</strong> {capRate}%
                  </li>
                  <br />
                  <li>
                    <strong>NOI:</strong> ${formattedNOI}
                  </li>
                  <br />
                  <li>
                    <strong>Estimated 5 Year IRR:</strong> {capRate}%
                  </li>
                  <br />
                  <li>
                    <strong>Executive Summary:</strong> {executiveSummary}
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            {/*End Overview Section */}

            {/*Begin Details Section */}
            {tab_variant == "DETAILS" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Property Details
                </h5>
                <ul className="mb-6 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl sm:px-6 text-left">
                  <li>
                    <strong>Property Type:</strong> {propertyType}
                  </li>
                  <br />
                  <li>
                    <strong>Sub-Type:</strong> {propertySubType}
                  </li>
                  <br />
                  <li>
                    <strong>Building Size:</strong> {formattedBuildingSize} SF
                  </li>
                  <br />
                  <li>
                    <strong>Lot Size:</strong> {formattedLotSize} SF
                  </li>
                  <br />
                  <li>
                    <strong>Year Built:</strong> {yearBuilt}
                  </li>
                  <br />
                  <li>
                    <strong>Zoning:</strong> {zoning}
                  </li>
                  <br />
                  <li>
                    <strong>Additional Information:</strong> {additionalDetails}
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            {/*End Details Section */}

            {/*Begin Valuation Section */}
            {tab_variant == "VALUATION" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Valuation and Comparables
                </h5>
                <ul className="mb-6 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl sm:px-6 text-left">
                  <li>
                    <strong>Comp 1:</strong> Example property and link 1
                  </li>
                  <br />
                  <li>
                    <strong>Comp 2:</strong> Example property and link 2
                  </li>
                  <br />
                  <li>
                    <strong>Comp 3:</strong> Example property and link 3
                  </li>
                  <br />
                  <li>
                    <strong>
                      Bar showing where each of the comps is and where our
                      subject property is.
                    </strong>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            {/*End Valuation Section */}

            {/*Begin Market Section */}
            {tab_variant == "MARKET" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Market Details
                </h5>
                <ul className="mb-6 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl sm:px-6 text-left">
                  <li>
                    The median listing home price in Hallandale Beach, FL was
                    $379.6K in June 2023, trending down -8% year-over-year.
                  </li>
                  <br />
                  <li>
                    The median listing home price per square foot was $349.
                  </li>
                  <br />
                  <li>The median home sold price was $315K.</li>
                  <br />
                  <li>Line graphs, pictures, and other cool visuals below.</li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            {/*End Market Section */}

            {/*Begin Finance Section */}
            {tab_variant == "FINANCE" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Financial Analysis
                </h5>
                <ul className="mb-6 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl sm:px-6 text-left">
                  <li>
                    <strong>Gross Income / Year:</strong> $
                    {formattedGrossIncome}
                  </li>
                  <br />
                  <li>
                    <strong>Gross Expenses / Year:</strong> $
                    {formattedGrossExpenses}
                  </li>
                  <br />
                  <li>
                    <strong>Net Operating Income:</strong> ${formattedNOI}
                  </li>
                  <br />
                  <li>
                    <strong>Asking Price:</strong> ${formattedPropertyPrice}
                  </li>
                  <br />
                  <li>
                    <strong>CAP Rate at Asking Price:</strong> {capRate}%
                  </li>
                  <br />
                  <li>
                    <strong>Building $/SF at Asking Price:</strong> $
                    {formattedBuildingSFPrice}
                  </li>
                  <br />
                  <li>
                    <strong>Land $/SF at Asking Price:</strong> $
                    {formattedLandSFPrice}
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            {/*End Finance Section */}

            {/*Begin Calculator Section */}
            {tab_variant == "CALCULATOR" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  IRR Calculator
                </h5>
                <label
                  className="mt-4 mb-2"
                  style={{ color: "#ffffff" }}
                  htmlFor="fname"
                >
                  Asset hold time
                </label>
                {/*Begin Radio Buttons */}
                <div className="mb-4 flex items-center justify-around">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value={1}
                      checked={timeFrame === 1}
                      onChange={() => setTimeFrame(1)}
                    />
                    &nbsp; 1 Year
                  </label>
                  <label className="lex items-center">
                    <input
                      type="radio"
                      value={2}
                      checked={timeFrame === 2}
                      onChange={() => setTimeFrame(2)}
                    />
                    &nbsp; 2 Years
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value={3}
                      checked={timeFrame === 3}
                      onChange={() => setTimeFrame(3)}
                    />
                    &nbsp; 3 Years
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value={4}
                      checked={timeFrame === 4}
                      onChange={() => setTimeFrame(4)}
                    />
                    &nbsp; 4 Years
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value={5}
                      checked={timeFrame === 5}
                      onChange={() => setTimeFrame(5)}
                    />
                    &nbsp; 5 Years
                  </label>
                </div>
                {/*End Radio Buttons */}

                {/*Begin Percent Escalation Inputs */}
                <div className="flex flex-row w-full justify-around">
                  {/*Begin Property Appreciation Input */}
                  <div className="flex flex-col w-1/2">
                    <label
                      className="mt-4 mb-1"
                      style={{ color: "#ffffff" }}
                      htmlFor="fname"
                    >
                      Estimated yearly property appreciation
                    </label>
                    <div>
                      <input
                        className="bg-black mb-4 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onInput={(e) => {
                          let inputValue = (e.target as HTMLInputElement).value;
                          let sanitizedValue = inputValue.replace(
                            /[^0-9.]/g,
                            ""
                          ); // Remove non-numeric and non-period characters

                          if (sanitizedValue !== inputValue) {
                            (e.target as HTMLInputElement).value =
                              sanitizedValue; // Update the input value
                          }

                          const periodCount =
                            sanitizedValue.split(".").length - 1;
                          if (periodCount > 1) {
                            sanitizedValue = sanitizedValue.replace(/\./g, ""); // Remove extra periods
                            (e.target as HTMLInputElement).value =
                              sanitizedValue; // Update the input value
                          }

                          if (sanitizedValue.startsWith(".")) {
                            sanitizedValue = `0${sanitizedValue}`; // Add a zero before the period
                            (e.target as HTMLInputElement).value =
                              sanitizedValue; // Update the input value
                          }

                          let numSanitizedValue = parseFloat(sanitizedValue);

                          setPropertyAppreciation(numSanitizedValue);
                        }}
                        type="text"
                        min=".0000001"
                        id="fname"
                        name="property_appreciation"
                        placeholder="7.0"
                        style={{ maxWidth: "50%" }}
                      ></input>{" "}
                      &nbsp; %
                    </div>
                  </div>
                  {/*End Property Appreciation Input */}
                  {/*Begin Income Escalation Input */}
                  <div className="flex flex-col w-1/2">
                    <label
                      className="mt-4 mb-1"
                      style={{ color: "#ffffff" }}
                      htmlFor="fname"
                    >
                      Estimated yearly income escalations
                    </label>
                    <div>
                      <input
                        className="bg-black mb-4 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onInput={(e) => {
                          let inputValue = (e.target as HTMLInputElement).value;
                          let sanitizedValue = inputValue.replace(
                            /[^0-9.]/g,
                            ""
                          ); // Remove non-numeric and non-period characters

                          if (sanitizedValue !== inputValue) {
                            (e.target as HTMLInputElement).value =
                              sanitizedValue; // Update the input value
                          }

                          const periodCount =
                            sanitizedValue.split(".").length - 1;
                          if (periodCount > 1) {
                            sanitizedValue = sanitizedValue.replace(/\./g, ""); // Remove extra periods
                            (e.target as HTMLInputElement).value =
                              sanitizedValue; // Update the input value
                          }

                          if (sanitizedValue.startsWith(".")) {
                            sanitizedValue = `0${sanitizedValue}`; // Add a zero before the period
                            (e.target as HTMLInputElement).value =
                              sanitizedValue; // Update the input value
                          }

                          let numSanitizedValue = parseFloat(sanitizedValue);

                          setNoiEscalations(numSanitizedValue);
                        }}
                        type="text"
                        min=".0000001"
                        id="fname"
                        name="noi_escalation"
                        placeholder="7.0"
                        style={{ maxWidth: "50%" }}
                      ></input>{" "}
                      &nbsp; %
                    </div>
                  </div>
                  {/*End Income Escalation Input */}
                </div>
                {/*End Percent Escalation Inputs */}

                {/*Begin Current Property Price Input */}
                <div className="flex flex-col">
                  <label
                    className="mt-4 mb-1"
                    style={{ color: "#ffffff" }}
                    htmlFor="fname"
                  >
                    Property purchase price
                  </label>
                  <div>
                    $&nbsp;{" "}
                    <input
                      className="bg-black mb-4 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onInput={(e) => {
                        let inputValue = (e.target as HTMLInputElement).value;
                        let sanitizedValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-period characters

                        if (sanitizedValue !== inputValue) {
                          (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                        }

                        const periodCount =
                          sanitizedValue.split(".").length - 1;
                        if (periodCount > 1) {
                          sanitizedValue = sanitizedValue.replace(/\./g, ""); // Remove extra periods
                          (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                        }

                        if (sanitizedValue.startsWith(".")) {
                          sanitizedValue = `0${sanitizedValue}`; // Add a zero before the period
                          (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                        }

                        let numSanitizedValue = parseFloat(sanitizedValue);

                        setSalePrice(numSanitizedValue);
                      }}
                      type="text"
                      min=".0000001"
                      id="fname"
                      name="sale_price"
                      placeholder={propertyPrice}
                      style={{ maxWidth: "50%" }}
                    ></input>
                  </div>
                </div>
                {/*End Current Property Price Input */}

                {/*Begin Current NOI Input */}
                <div className="flex flex-col">
                  <label
                    className="mt-4 mb-1"
                    style={{ color: "#ffffff" }}
                    htmlFor="fname"
                  >
                    Current NOI
                  </label>
                  <div>
                    $&nbsp;{" "}
                    <input
                      className="bg-black mb-4 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-black dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onInput={(e) => {
                        let inputValue = (e.target as HTMLInputElement).value;
                        let sanitizedValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-period characters

                        if (sanitizedValue !== inputValue) {
                          (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                        }

                        const periodCount =
                          sanitizedValue.split(".").length - 1;
                        if (periodCount > 1) {
                          sanitizedValue = sanitizedValue.replace(/\./g, ""); // Remove extra periods
                          (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                        }

                        if (sanitizedValue.startsWith(".")) {
                          sanitizedValue = `0${sanitizedValue}`; // Add a zero before the period
                          (e.target as HTMLInputElement).value = sanitizedValue; // Update the input value
                        }

                        let numSanitizedValue = parseFloat(sanitizedValue);

                        setFirstInflow(numSanitizedValue);
                      }}
                      type="text"
                      min=".0000001"
                      id="fname"
                      name="sale_price"
                      placeholder={noi}
                      style={{ maxWidth: "50%" }}
                    ></input>
                  </div>
                  {/*End Current NOI Input */}

                  {/* Begin Calculate IRR Button */}
                  <div className="flex flex-col justify-center items-center">
                    <div
                      onClick={calculateIRR}
                      className="flex flex-col justify-center items-center mt-4 bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg text-black w-fit p-1 cursor-pointer"
                    >
                      Calculate IRR
                    </div>
                  </div>
                  {/* End Calculate IRR Button */}

                  {/* Begin IRR Display */}
                  <div className="flex flex-col justify-center items-center">
                    <div className="mt-6 w-[200px] h-20 p-1 bg-gradient-to-r from-[#FFFF00] to-[#00FFFF] rounded-lg flex justify-center items-center">
                      <div className="w-full h-full bg-black rounded-lg justify-center items-center text-center flex flex-col">
                        Estimated IRR: {irr} %
                      </div>
                    </div>
                  </div>
                  {/* End IRR Display */}
                </div>
                {/*End Current NOI Input */}
              </div>
            ) : (
              <></>
            )}
            {/*End Calculator Section */}

            {/*Begin Docs Section */}
            {tab_variant == "DOCUMENTS" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Property Documents
                </h5>
                <ul className="mb-6 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl sm:px-6 text-left">
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      LLC Bylaws
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      Property Inspection Report
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      Property Survey
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      Rent Roll
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      Tax Information
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      Title Policy
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      P&L Statement
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      Signed Leases
                    </a>
                  </li>
                  <br />
                  <li className="hover:text-blue-700">
                    <a href="/PlaceholderDocument.pdf" target="_blank">
                      Property Appraisal
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            {/*End Docs Section */}

            {/*Begin News Section */}
            {tab_variant == "NEWS" ? (
              <div>
                <h5 className="mb-6 text-2xl font-bold tracking-tight text-white">
                  Local News
                </h5>
                <ul className="mb-6 md:js-show-on-scroll-right text-lg font-normal  text-white lg:text-xl sm:px-6 text-left">
                  <li>
                    <a
                      href={article1Url}
                      target="_blank"
                      className="hover:text-blue-700"
                    >
                      <strong>{article1Title}</strong>
                    </a>
                    <br />
                    <p>{article1Description}</p>
                  </li>
                  <br />
                  <br />
                  <li>
                    <a
                      href={article2Url}
                      target="_blank"
                      className="hover:text-blue-700"
                    >
                      <strong>{article2Title}</strong>
                    </a>
                    <br />
                    <p>{article2Description}</p>
                  </li>
                  <br />
                  <br />
                  <li>
                    <a
                      href={article3Url}
                      target="_blank"
                      className="hover:text-blue-700"
                    >
                      <strong>{article3Title}</strong>
                    </a>
                    <br />
                    <p>{article3Description}</p>
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            {/*End News Section */}

            <div
              onClick={() => handleClick()}
              className="inline-flex mb-6 mt-10 cursor-pointer items-center py-2 px-3 text-sm font-medium text-center text-black bg-gradient-to-r  from-[#FFFF00] to-[#00FFFF] rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Trade
              <svg
                aria-hidden="true"
                className="ml-2 -mr-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        {/* End Property Information Component*/}
        <div
          id="map"
          className="mt-4 h-[500px] lg:h-auto ml-1 lg:w-1/2 w-full"
        ></div>
      </div>

      <footer className="justify-end bottom-0">
        <FooterComponent></FooterComponent>
      </footer>
    </div>
  );
}
