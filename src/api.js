const API_KEY = '92b36e51888ed2958272f0074c6d7ccc6c05bc504185e7799b6aed3ea3db7b22';

const tickersHandlers = new Map();

export async function loadTickers() {
	if (tickersHandlers.size === 0) {
		return;
	}

	const response = await fetch(
		`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(
			','
		)}&tsyms=USD&api_key=${API_KEY}`
	);
	const rawPrices = await response.json();
	const updatedPrices = Object.fromEntries(Object.entries(rawPrices).map(([key, value]) => [key, value.USD]));
	Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
		const handlers = tickersHandlers.get(currency) ?? [];
		handlers.forEach((fn) => fn(newPrice));
	});
}

export const subscribeToTicker = (ticker, cb) => {
	const subscribers = tickersHandlers.get(ticker) || [];
	tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
	tickersHandlers.delete(ticker.wallet);
};

setInterval(loadTickers, 5000);

window.tickersHandlers = tickersHandlers;
