import { Callback } from 'mongodb';
import {
	makeApiRequest,
	generateSymbol,
	parseFullSymbol,
	resolutionToSeconds,
} from './Helpers';
import { property_tokens } from '@/constants/addresses';
import {
	subscribeOnStream,
	unsubscribeFromStream,
} from './Streaming';

interface BarData {
	time?: number,
	open?: number,
	close?: number,
	high?: number,
	low?: number
} 

const lastBarsCache = new Map();
var previousBarData: BarData = {};

// DatafeedConfiguration implementation
const configurationData = {
	// Represents the resolutions for bars supported by your datafeed
	// supported_resolutions: ['1', '3', '5', '15', '30', '45', '60', '120'],

	// The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
	exchanges: [{
		value: '',
		name: '',
		desc: '',
	},
	{
		value: 'Kraken',
		// Filter name
		name: 'Kraken',
		// Full exchange name displayed in the filter popup
		desc: 'Kraken bitcoin exchange',
	},
	],
	// The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
	symbols_types: [{
		name: 'crypto',
		value: 'crypto',
	},
	],
};

// Obtains all symbols for all exchanges supported by CryptoCompare API
async function getAllSymbols() {
    const names = ['IRET0001', 'IRET0002', 'IRET0003', 'IRET0004', 'IRET0005', 'IRET0006'];
    const allSymbols = names.map((name, index) => {
        return {
            symbol: `${name}/USDC`,
            full_name: `${name}/USDC`,
            description: `${name}/USDC`,
            exchange: 'REXProtocol',
            type: 'crypto',
            address: property_tokens[index]
        };
    })
	return allSymbols;
}

export default {
	onReady: (callback: any) => {
		console.log('[onReady]: Method call');
		setTimeout(() => callback(configurationData));
	},

	searchSymbols: async (
		userInput: string,
		exchange: string,
		symbolType: string,
		onResultReadyCallback: (newSymbols: any[]) => void,
	) => {
		console.log('[searchSymbols]: Method call');
		const symbols = await getAllSymbols();
		const newSymbols = symbols.filter(symbol => {
			const isExchangeValid = exchange === '' || symbol.exchange === exchange;
			const isFullSymbolContainsInput = symbol.full_name
				.toLowerCase()
				.indexOf(userInput.toLowerCase()) !== -1;
			return isExchangeValid && isFullSymbolContainsInput;
		});
		onResultReadyCallback(newSymbols);
	},

	resolveSymbol: async (
		symbolName: string,
		onSymbolResolvedCallback: (symbolInfo: any) => void,
		onResolveErrorCallback: (str: string) => void,
		extension: string
	) => {
		console.log('[resolveSymbol]: Method call', symbolName);
		const symbols = await getAllSymbols();
		const symbolItem = symbols.find(({
			full_name,
		}) => full_name === symbolName);
		if (!symbolItem) {
			console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
			onResolveErrorCallback('cannot resolve symbol');
			return;
		}
		// Symbol information object
		const symbolInfo = {
			ticker: symbolItem.full_name,
			name: symbolItem.symbol,
			description: symbolItem.description,
			type: symbolItem.type,
			session: '24x7',
			timezone: 'Etc/UTC',
			exchange: symbolItem.exchange,
			minmov: 1,
			pricescale: 10000,
			has_intraday: true,
			has_no_volume: true,
			has_weekly_and_monthly: false,
			volume_precision: 4,
            address: symbolItem.address
			// data_status: 'streaming',
		};

		console.log('[resolveSymbol]: Symbol resolved', symbolName);
		onSymbolResolvedCallback(symbolInfo);
	},

	getBars: async (
        symbolInfo: any, 
        resolution: string, 
        periodParams: any, 
        onHistoryCallback: any, 
        onErrorCallback: (error: any) => void
    ) => {
		const { from, to, firstDataRequest } = periodParams;

		if (firstDataRequest && previousBarData.time)
			previousBarData = {};
		console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
		// const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
		// const urlParameters: any = {
		// 	e: parsedSymbol?.exchange,
		// 	fsym: parsedSymbol?.fromSymbol,
		// 	tsym: parsedSymbol?.toSymbol,
		// 	toTs: to,
		// 	limit: 2000,
		// };
		const query = `candle=${resolutionToSeconds(resolution)}.${symbolInfo.address}&from=${from}&to=${to}`
		try {
			const data = await makeApiRequest(`/order/data?${query}`);
			// if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
			// 	// "noData" should be set if there is no data in the requested period
			// 	onHistoryCallback([], {
			// 		noData: true,
			// 	});
			// 	return;
			// }
            // console.log('data', data);
			let bars: any[] = [];
			if (data.length === 0 && previousBarData.time) {
				let resolutionInSeconds = resolutionToSeconds(resolution);
				let expectedBarCount = Math.floor((parseInt(to) - parseInt(from)) / resolutionInSeconds);
				for (let i = expectedBarCount ; i >= 1 ; i --) {
					bars = [...bars, {
						time: previousBarData.time  - (resolutionInSeconds * i * 1000),
						low: previousBarData.open,
						high: previousBarData.open,
						open: previousBarData.open,
						close: previousBarData.open,
					}];
				}
			} else {
				data.forEach((bar: any) => {
					if (bar.time >= from) {
						bars = [...bars, {
							time: bar.time * 1000,
							low: bar.low,
							high: bar.high,
							open: bar.open,
							close: bar.close,
						}];
					}
				});
				if (previousBarData.time) {
					let lastBar = bars[bars.length - 1];
					if (lastBar.close !== previousBarData.open) {
						bars[bars.length - 1].close = previousBarData.open;
					}
				}
				previousBarData = {...bars[0]}
			}
			if (firstDataRequest) {
				lastBarsCache.set(symbolInfo.full_name, {
					...bars[bars.length - 1],
				});
			}
			console.log(`[getBars]: returned ${bars.length} bar(s)`);
			onHistoryCallback(bars, {
				noData: false,
			});	
		} catch (error) {
			console.log('[getBars]: Get error', error);
			onErrorCallback(error);
		}
	},

	subscribeBars: (
		symbolInfo: any,
		resolution: string,
		onRealtimeCallback: any,
		subscriberUID: any,
		onResetCacheNeededCallback: any,
	) => {
		console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
		subscribeOnStream(
			symbolInfo,
			resolution,
			onRealtimeCallback,
			subscriberUID,
			onResetCacheNeededCallback,
			lastBarsCache.get(symbolInfo.full_name),
		);
	},

	unsubscribeBars: (subscriberUID: any) => {
		console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
		unsubscribeFromStream(subscriberUID);
	},
};
