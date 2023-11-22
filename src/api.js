const API_KEY = '92b36e51888ed2958272f0074c6d7ccc6c05bc504185e7799b6aed3ea3db7b22';

const tickersHandlers = new Map();
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const AGGREGATE_INDEX = '5';
const INVALID_JSON = '500';

const INVALID_SUB = 'INVALID_SUB';

socket.addEventListener('message', (event) => {
	const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, MESSAGE: msg } = JSON.parse(event.data);
	const handlers = tickersHandlers.get(currency) ?? [];

	switch (type) {
		case AGGREGATE_INDEX:
			handlers.forEach((fn) => fn(newPrice));
			break;
		case INVALID_JSON:
			if (msg === INVALID_SUB) {
				handleError(event.data);
			}
			break;
		default:
			break;
	}
});

function handleError(wsMsg) {
	const { MESSAGE: msg, PARAMETER: param } = JSON.parse(wsMsg);

	const tickers = tickersHandlers.keys();
	
	const tickerError = Array.from(tickers).find((ticker) => {
		const tickerRexExp = new RegExp(`~${ticker}~`);
		return param.match(tickerRexExp);
	});

	const handlers = tickersHandlers.get(tickerError) ?? [];
	handlers.forEach((fn) => fn('-'));
}

function sendToWebSocket(message) {
	const stringifiedMessage = JSON.stringify(message);

	if (socket.readyState === WebSocket.OPEN) {
		socket.send(stringifiedMessage);
	} else {
		socket.addEventListener('open', () => socket.send(stringifiedMessage), { once: true });
	}
}

function subscribeToTickerOnWs(ticker) {
	sendToWebSocket({
		action: 'SubAdd',
		subs: [`5~CCCAGG~${ticker}~USD`],
	});
}

function unsubscribeFromTickerOnWs(ticker) {
	sendToWebSocket({
		action: 'SubRemove',
		subs: [`5~CCCAGG~${ticker}~USD`],
	});
}

export const subscribeToTicker = (ticker, cb) => {
	const subscribers = tickersHandlers.get(ticker) || [];
	tickersHandlers.set(ticker, [...subscribers, cb]);
	subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
	tickersHandlers.delete(ticker.wallet);
	unsubscribeFromTickerOnWs(ticker);
};
