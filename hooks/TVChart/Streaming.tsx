import { parseFullSymbol, resolutionToSeconds } from './Helpers';
import { io } from 'socket.io-client'

const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`, {
    transports: ["websocket"]
});
const channelToSubscription: Map<any, any> = new Map();

var currentResolution: number = 0;
var intervalId: any;
var hasAnyUpdate = false;
var currentChannelString: string;


interface BarData {
	time?: number,
	open?: number,
	close?: number,
	high?: number,
	low?: number
} 

socket.on('connect', () => {
	console.log('[socket] Connected');
});

socket.on('disconnect', (reason: any) => {
	console.log('[socket] Disconnected:', reason);
});

socket.on('error', (error: any) => {
	console.log('[socket] Error:', error);
});

socket.on('m', (data: any) => {
	console.log('[socket] Update bar:', data);
	const [
		eventTypeStr,
		exchange,
		fromSymbol,
		toSymbol,
		tradeTimeStr,
		tradePriceStr,
	] = data.split('~');

	if (parseInt(eventTypeStr) !== 0) {
		// Skip all non-trading events
		return;
	}
	const tradePrice = parseFloat(tradePriceStr);
	const tradeTime = parseInt(tradeTimeStr);
	const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
	const subscriptionItem = channelToSubscription.get(channelString);
	if (subscriptionItem === undefined) {
		return;
	}
	const lastBar = subscriptionItem.lastBar;
	const nextBarTime = getNextBarTime(lastBar.time);

	let bar: BarData;
	if (tradeTime >= nextBarTime) {
		bar = {
			time: nextBarTime,
			open: tradePrice,
			high: tradePrice,
			low: tradePrice,
			close: tradePrice,
		};
		console.log('[socket] Generate new bar', bar);
	} else {
		bar = {
			...lastBar,
			high: Math.max(lastBar.high, tradePrice),
			low: Math.min(lastBar.low, tradePrice),
			close: tradePrice,
		};
		console.log('[socket] Update the latest bar by price', tradePrice);
	}
	subscriptionItem.lastBar = bar;
    hasAnyUpdate = true;

	// Send data to every subscriber of that symbol
	subscriptionItem.handlers.forEach((handler: any) => handler.callback(bar));
});

function getNextBarTime(barTime: number) {
	return barTime + currentResolution * 1000;
}

export function subscribeOnStream(
	symbolInfo: any,
	resolution: string,
	onRealtimeCallback: any,
	subscriberUID: any,
	onResetCacheNeededCallback: any,
	lastBar: any,
) {
	const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
	const channelString = `0~${parsedSymbol?.exchange}~${parsedSymbol?.fromSymbol}~${parsedSymbol?.toSymbol}`;
	const handler = {
		id: subscriberUID,
		callback: onRealtimeCallback,
	};
    if (currentResolution !== resolutionToSeconds(resolution)) {
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            if (!hasAnyUpdate) {
                const subscriptionItem = channelToSubscription.get(currentChannelString);
                if (subscriptionItem === undefined) {
                    return;
                }
                const lastBar = subscriptionItem.lastBar;
                const nextBarTime = getNextBarTime(lastBar.time);
                let bar: BarData;
                
                bar = {
                    open: lastBar.close,
					high: lastBar.close,
					low: lastBar.close,
					close: lastBar.close,
                    time: nextBarTime,
                };
                
                subscriptionItem.lastBar = bar;

                // Send data to every subscriber of that symbol
                subscriptionItem.handlers.forEach((handler: any) => handler.callback(bar));
            }
            hasAnyUpdate = false;
        }, resolutionToSeconds(resolution) * 1000);
    }
    currentResolution = resolutionToSeconds(resolution);

	let subscriptionItem = channelToSubscription.get(channelString);
	// if (subscriptionItem) {
	// 	// Already subscribed to the channel, use the existing subscription
	// 	subscriptionItem.handlers.push(handler);
	// 	return;
	// }
	subscriptionItem = {
		subscriberUID,
		resolution,
		lastBar,
		handlers: [handler],
	};
	channelToSubscription.set(channelString, subscriptionItem);
	console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
    currentChannelString = channelString;
	// socket.emit('SubAdd', { subs: [channelString] });
}

export function unsubscribeFromStream(subscriberUID: any) {
	// Find a subscription with id === subscriberUID
	for (const channelString of channelToSubscription.keys()) {
		const subscriptionItem = channelToSubscription.get(channelString);
		const handlerIndex = subscriptionItem.handlers
			.findIndex((handler: any) => handler.id === subscriberUID);

		if (handlerIndex !== -1) {
			// Remove from handlers
			subscriptionItem.handlers.splice(handlerIndex, 1);

			if (subscriptionItem.handlers.length === 0) {
				// Unsubscribe from the channel if it was the last handler
				console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString);
				// socket.emit('SubRemove', { subs: [channelString] });
				channelToSubscription.delete(channelString);
				break;
			}
		}
	}

	if (intervalId) {
		clearInterval(intervalId);
	}
}
