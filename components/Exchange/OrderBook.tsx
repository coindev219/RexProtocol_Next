import React, { useEffect, useState } from "react";
import "tailwindcss-elevation";

type Props = {
	pairs: string[];
	book: any;
};

export default function OrderBook(props: Props) {
	const {pairs, book} = props;
	const [spread, setSpread] = useState(Number(0.0));
	const [spreadPercentage, setSpreadPercentage] = useState(Number(0.0));

	useEffect(() => {
		const calculateSpread = (bidPrice: number, askPrice: number) => Math.abs(bidPrice - askPrice);
		const calculateSpreadPercentage = (bidPrice: number, askPrice: number) => {
			const midpoint = (bidPrice + askPrice) / 2;
			return Math.abs(midpoint - bidPrice) / midpoint * 200;
		};
		
		const bidPrice = book.bids.length > 0 ? parseFloat(book.bids[0][0]) : 0;
		const askPrice = book.asks.length > 0 ? parseFloat(book.asks[0][0]) : 0;
		
		setSpread(calculateSpread(bidPrice, askPrice));
		setSpreadPercentage(calculateSpreadPercentage(bidPrice, askPrice));
	}, [book])

  return (
    <>
      <div className="text-center items-center justify-center objects-center">
				<div className="flex mr-8">
					<div className="flex-1 text-right">
						<p className="mt-5">{`Price (${pairs[1]})`}</p>
					</div>
					<div className="flex-1 text-right">
						<p className="mt-5">{`Size (${pairs[0]})`}</p>
					</div>
				</div>

				{book.asks.slice(0, 5).reverse().map((ask: any[], index: number) => (
					<div className="flex mr-8 my-1.5" key={index}>
						<div className="flex-1 text-right text-red-600 text-sm">
							<p>{ask[0]}</p>
						</div>
						<div className="flex-1 text-right text-gray-400 text-sm">
							<p>{ask[1]}</p>
						</div>
					</div>
				))}
				
				
				<div className="flex my-1.5 py-1.5" style={{borderWidth: '1px 0', borderColor: '#3c3c3c'}}>
					<div className="flex-1 text-right text-gray-400 text-sm mx-2">
						<p>{`Spread ${spreadPercentage.toPrecision(2).replace(/0+$/, '')}%`}</p>
					</div>
					<div className="flex-1 text-right text-gray-400 text-sm mx-2 mr-8">
						<p>{spread.toPrecision(4).replace(/0+$/, '')}</p>
					</div>
				</div>
				
				{book.bids.slice(0, 5).map((bid: any[], index: number) => (
					<div className="flex mr-8 my-1.5" key={index}>
						<div className="flex-1 text-right text-green-400 text-sm">
							<p>{bid[0]}</p>
						</div>
						<div className="flex-1 text-right text-gray-400 text-sm">
							<p>{bid[1]}</p>
						</div>
					</div>
				))}
      </div>
    </>
  );
}
