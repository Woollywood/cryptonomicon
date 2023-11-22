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

	const tickerWithError = Array.from(tickers).find((ticker) => {
		const tickerRexExp = new RegExp(`~${ticker}~`);
		return param.match(tickerRexExp);
	});

	const tickerTsymUSD = param.match(/~USD/);

	if (tickerTsymUSD) {
		console.log('cannot compare with USD. Trying to compare with BTC...');
		subscribeToTickerOnWs(tickerWithError, 'BTC');
	} else {
		console.log('cannot compare with BTC. Handle error');
		const handlers = tickersHandlers.get(tickerWithError) ?? [];
		handlers.forEach((fn) => fn('-'));
		unsubscribeFromTicker(tickerWithError);
	}
}

function sendToWebSocket(message) {
	const stringifiedMessage = JSON.stringify(message);

	if (socket.readyState === WebSocket.OPEN) {
		socket.send(stringifiedMessage);
	} else {
		socket.addEventListener('open', () => socket.send(stringifiedMessage), { once: true });
	}
}

function subscribeToTickerOnWs(ticker, tsym = 'USD') {
	sendToWebSocket({
		action: 'SubAdd',
		subs: [`5~CCCAGG~${ticker}~${tsym}`],
	});
}

function unsubscribeFromTickerOnWs(ticker, tsym = 'USD') {
	sendToWebSocket({
		action: 'SubRemove',
		subs: [`5~CCCAGG~${ticker}~${tsym}`],
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

export const fetchAllTickers = async () => {
	const f = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true');
	return await f.json();
};
