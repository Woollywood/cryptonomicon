<script setup>
import TickerItem from '@/assets/components/TickerItem.vue';
</script>

<template>
	<div class="layout">
		<div class="container">
			<div class="layout__top">
				<form class="layout__top-form" @submit.prevent="addTickerSubmit(searchQuery)">
					<div class="search-query-wrapper">
						<label class="search-query">
							<span class="search-query__label">Тикер</span>
							<Input
								class="search-query__input"
								placeholder="Например DOGE"
								type="text"
								v-model="searchQuery"
								@input="searchQueryError = ''" />

							<span class="search-query-error" v-if="searchQueryError.length">{{
								searchQueryError
							}}</span>
						</label>
						<transition name="fade">
							<div class="search-query-clue" v-if="searchQueryClue.length">
								<div class="clue-item" v-for="ticker in searchQueryClue" @click="addTickerClue(ticker)">
									{{ ticker }}
								</div>
							</div>
						</transition>
					</div>
					<transition name="fade">
						<Button class="layout__ticker-add" :prepend-icon="['fas', 'circle-plus']" v-if="searchQuery">
							Добавить
						</Button>
					</transition>
				</form>
			</div>
			<transition name="fade">
				<div class="layout__main" v-if="tickers.length">
					<div class="layout__main-header">
						<div class="layout__pagination">
							<div class="layout__pagination-buttons">
								<Button
									class="layout__pagination-button"
									:disabled="page === 1"
									@click="prevPage"
									>Назад</Button
								>
								<Button
									class="layout__pagination-button"
									:disabled="!hasNextPage"
									@click="nextPage"
									>Вперед</Button
								>
							</div>
						</div>
						<div class="layout__filter">
							<Input placeholder="Фильтр" type="text" v-model="filter" />
						</div>
					</div>
					<hr class="layout__hr" />
					<div class="layout__main-inner">
						<TickerItem
							class="layout__ticker"
							v-for="(ticker, index) in filteredTickers()"
							:key="ticker.name"
							:id="ticker.id"
							:class="{ selected: sellectedTicker === ticker }"
							v-model="filteredTickers()[index]"
							@click="selectTicker(ticker)"
							@delete="deleteTicker" />
					</div>
					<hr class="layout__hr" />
				</div>
			</transition>
			<transition name="fade">
				<div class="layout__info" v-if="sellectedTicker">
					<div class="layout__info-top">
						<h2 class="layout__info-title">{{ sellectedTicker.wallet }} - USD</h2>
						<Button
							class="layout__info-close"
							type="secondary"
							:prepend-icon="['fas', 'xmark']"
							@click="diagramClose"></Button>
					</div>
					<div class="layout__diagram">
						<ChartComponent class="layout__diagram-component" :dataValue="selectedTickerData" />
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchQuery: '',
			searchQueryError: '',
			tickers: [],
			sellectedTicker: null,
			selectedTickerData: [],

			allTickers: [],

			page: 1,
			filter: '',
			hasNextPage: false,
		};
	},
	methods: {
		deleteTicker(wallet) {
			this.tickers = this.tickers.filter((ticker) => ticker.wallet !== wallet);
			localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));

			if (this.sellectedTicker?.wallet === wallet) {
				this.sellectedTicker = null;
			}
		},

		diagramClose() {
			this.sellectedTicker = null;
			this.selectedTickerData = [];
		},

		selectTicker(ticker) {
			this.sellectedTicker = ticker;
			this.selectedTickerData = [];
		},

		addTickerThrottleWrapper(func, ms) {
			let isThrottled = false,
				savedArgs,
				savedThis;

			function wrapper() {
				if (isThrottled) {
					savedArgs = arguments;
					savedThis = this;
					return;
				}

				func.apply(this, arguments);

				isThrottled = true;

				setTimeout(function () {
					isThrottled = false;
					if (savedArgs) {
						wrapper.apply(savedThis, savedArgs);
						savedArgs = savedThis = null;
					}
				}, ms);
			}

			return wrapper;
		},

		addTickerSubmit(tickerName) {
			this.addTickerThrottle(tickerName);
			this.searchQuery = '';
		},

		addTickerClue(tickerName) {
			this.addTickerThrottle(tickerName);
			this.searchQuery = '';
		},

		addTicker(tickerName) {
			if (this.tickers.find((ticker) => ticker.wallet === tickerName)) {
				this.searchQueryError = 'Такой тикер уже существует';
				return;
			}

			const newTicker = {
				wallet: tickerName,
			};

			this.tickers.push(newTicker);
			this.filter = '';
			localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));

			this.subscribeToUpdates(newTicker);
		},

		subscribeToUpdates(newTicker) {
			const intervalTimer = setInterval(async () => {
				if (!this.tickers.find((ticker) => ticker.wallet === newTicker.wallet)) {
					clearInterval(intervalTimer);
					return;
				}

				try {
					const currentTicker = newTicker;
					const f = await fetch(
						`https://min-api.cryptocompare.com/data/price?fsym=${newTicker.wallet}&tsyms=USD&api_key=92b36e51888ed2958272f0074c6d7ccc6c05bc504185e7799b6aed3ea3db7b22`
					);
					const data = await f.json();
					this.tickers.find((ticker) => ticker.wallet === newTicker.wallet).walletValue =
						data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);

					if (this.sellectedTicker?.wallet === currentTicker.wallet) {
						this.selectedTickerData.push(data.USD);
					}
				} catch (err) {
					console.log('error: ', err.message);
					this.tickers.find((ticker) => ticker.wallet === newTicker.wallet).error = err;
					clearInterval(intervalTimer);
				}
			}, 5000);
		},

		async fetchAllTickers() {
			const f = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true');
			const data = await f.json();
			this.allTickers = Object.values(data.Data).map((value) => value.Symbol);
		},

		filteredTickers() {
			const start = (this.page - 1) * 8;
			const end = this.page * 8;
			const filteredTickers = this.tickers.filter((ticker) =>
				ticker.wallet.toLowerCase().includes(this.filter.toLowerCase())
			);
			this.hasNextPage = filteredTickers.length > end;

			return filteredTickers.slice(start, end);
		},

		prevPage() {
			this.page--;
			this.diagramClose();
		},

		nextPage() {
			this.page++;
			this.diagramClose();
		}
	},
	computed: {
		searchQueryClue() {
			return this.searchQuery.length
				? this.allTickers
						.filter((ticker) => ticker.toLowerCase().includes(this.searchQuery.toLowerCase()))
						.slice(0, 4)
				: [];
		},
	},
	created() {
		const windowData = Object.fromEntries(new URL(window.location).searchParams.entries());

		if (windowData.filter) {
			this.filter = windowData.filter;
		}

		if (windowData.page) {
			this.page = windowData.page;
		}

		this.addTickerThrottle = this.addTickerThrottleWrapper(this.addTicker, 1000);
		this.fetchAllTickers();

		const tickersData = localStorage.getItem('cryptonomicon-list');
		if (tickersData) {
			this.tickers = JSON.parse(tickersData);
			this.tickers.forEach((ticker) => this.subscribeToUpdates(ticker));
		}
	},
	watch: {
		filter() {
			this.page = 1;

			window.history.pushState(
				null,
				document.title,
				`${window.location.pathname}?filter=${this.filter}&page=${this.page}`
			);
		},

		page() {
			window.history.pushState(
				null,
				document.title,
				`${window.location.pathname}?filter=${this.filter}&page=${this.page}`
			);
		},
	},
};
</script>

<style lang="scss" scoped>
.layout {
	@include adaptiveValue('padding-top', 60, 36, 0, 1920, 568);
	@include adaptiveValue('padding-bottom', 60, 36, 0, 1920, 568);

	&__top {
		&:not(:last-child) {
			margin-bottom: rem(32);
		}
	}

	&__top-form {
		display: flex;
		gap: rem(12);
		align-items: center;
	}

	&__ticker-add {
		@media (max-width: $mobileSmall) {
			width: 100%;
		}
	}

	&__main {
	}

	&__main-inner {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		@include adaptiveValue('gap', 36, 56, 0, 1920, 568);

		@media (max-width: $tablet) {
			grid-template-columns: repeat(3, 1fr);
		}

		@media (max-width: $mobile) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: $mobileSmall) {
			grid-template-columns: 1fr;
		}
	}

	&__ticker {
		&.selected {
			outline: 1px solid color('grey', 0.8);
		}
	}

	&__hr {
		margin: rem(40) 0;
		background-color: color('black', 0.8);
		width: 100%;
		height: 1px;
	}

	&__info {
		height: 60vh;
		width: 100%;

		display: grid;
		grid-template-rows: auto 1fr;
	}

	&__info-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: rem(32);

		&:not(:last-child) {
			margin-bottom: rem(24);
		}
	}

	&__info-title {
		color: color('black');
		font-size: rem(24);
		font-weight: 700;
	}

	&__diagram {
		width: 100%;
		height: 100%;
	}

	&__diagram-component {
		width: 100%;
		height: 100%;
	}

	&__main-header {
		display: flex;
		gap: rem(36);
		align-items: center;

		&:not(:last-child) {
			margin-bottom: rem(32);
		}
	}

	&__pagination {
		display: flex;
		align-items: center;
		gap: rem(56);
	}

	&__pagination-description {
	}

	&__pagination-buttons {
		display: flex;
		align-items: center;
		gap: rem(16);
	}

	&__pagination-button {
		flex: 0 0 rem(160);
		width: rem(160);
	}
}
.search-query {
	display: flex;
	flex-direction: column;

	@media (min-width: $mobileSmall) {
		max-width: rem(220);
	}

	@media (max-width: $mobileSmall) {
		width: 100%;
	}

	&:not(:last-child) {
		margin-bottom: rem(8);
	}

	&__label {
		font-size: rem(14);
		color: color('black');
	}

	&__input {
	}
}

.search-query-wrapper {
	display: flex;
	flex-direction: column;
}

.search-query-clue {
	display: flex;
	justify-content: space-between;
	gap: rem(4);
	align-items: center;

	padding-bottom: rem(8);
	border-bottom: 1px solid color('grey', 0.8);
}

.search-query-error {
	color: color('red');
	font-size: rem(12);
}

.clue-item {
	cursor: pointer;
	flex: 1 1 auto;
	color: color('black', 0.8);
	font-size: rem(12);
	padding: rem(4) rem(6);
	background-color: color('grey', 0.8);
	border-radius: rem(12);

	display: flex;
	justify-content: center;
	align-items: center;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease !important;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
