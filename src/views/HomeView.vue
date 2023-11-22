<template>
	<div class="layout">
		<div class="container">
			<AddTicker class="layout__top" @add-ticker="addTicker" :tickers="tickers" />
			<Pagination
				:page="page"
				:filteredTickers="filteredTickers"
				@prev-page="prevPage"
				@next-page="nextPage"
				@update-filter="filter = $event" />
			<TickersLayout :tickers="tickers" :filter="filter" v-model:sellectedTicker="sellectedTicker" :page="page" @delete="deleteTicker" />
			<transition name="fade">
				<div class="layout__info" v-if="sellectedTicker">
					<div class="layout__info-top">
						<Button
							class="layout__info-close"
							type="secondary"
							:prepend-icon="['fas', 'xmark']"
							@click="diagramClose"></Button>
					</div>
					<div class="layout__diagram">
						<ChartComponent
							class="layout__diagram-component"
							:wallet="sellectedTicker.wallet"
							:labels="sellectedTickerData.labels"
							:dataValue="sellectedTickerData.data" />
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from '@/api';

import AddTicker from '@/assets/components/AddTicker';
import Pagination from '@/assets/components/Pagination';
import TickersLayout from '@/assets/components/TickersLayout';

export default {
	components: {
		AddTicker,
		Pagination,
		TickersLayout,
	},
	data() {
		return {
			tickers: [],
			sellectedTicker: null,
			sellectedTickerData: {
				data: [],
				labels: [],
			},

			page: 1,
			filter: '',
		};
	},
	methods: {
		addTicker(tickerName) {
			const newTicker = {
				wallet: tickerName,
			};

			this.tickers = [...this.tickers, newTicker];
			this.filter = '';

			subscribeToTicker(newTicker.wallet, (price) => {
				this.updatedTicker(newTicker.wallet, price);
			});
		},

		deleteTicker(wallet) {
			unsubscribeFromTicker(this.tickers.find((ticker) => ticker.wallet === wallet).wallet);
			this.tickers = this.tickers.filter((ticker) => ticker.wallet !== wallet);

			if (this.sellectedTicker?.wallet === wallet) {
				this.sellectedTicker = null;
			}
		},

		diagramClose() {
			this.sellectedTicker = null;
		},

		selectTicker(ticker) {
			this.sellectedTicker = ticker;
		},

		updatedTicker(tickerName, price) {
			const currentTicker = this.tickers.find((ticker) => ticker.wallet === tickerName);

			if (!currentTicker) {
				return;
			}

			currentTicker.walletValue = price;

			if (price === '-') {
				currentTicker.error = 'Перевод невозможен';
			}

			if (this.sellectedTicker?.wallet === currentTicker.wallet) {
				this.sellectedTickerData.data.push(price);
				this.sellectedTickerData.labels.push(
					[`${new Date().getHours()} ч`, `${new Date().getMinutes()} мин`].join(' ')
				);
			}
		},

		prevPage() {
			this.page--;
			this.diagramClose();
		},

		nextPage() {
			this.page++;
			this.diagramClose();
		},
	},
	computed: {
		startIndex() {
			return (this.page - 1) * 8;
		},

		endIndex() {
			return this.page * 8;
		},

		filteredTickers() {
			return this.tickers.filter((ticker) => ticker.wallet.toLowerCase().includes(this.filter.toLowerCase()));
		},

		pageStateOptions() {
			return {
				filter: this.filter,
				page: this.page,
			};
		},
	},
	created() {
		const windowData = Object.fromEntries(new URL(window.location).searchParams.entries());
		const VALID_KEYS = ['filter', 'page'];

		VALID_KEYS.forEach((key) => {
			if (windowData[key]) {
				this[key] = windowData[key];
			}
		});

		const tickersData = localStorage.getItem('cryptonomicon-list');

		if (tickersData) {
			this.tickers = JSON.parse(tickersData);
			this.tickers.forEach((ticker) => {
				subscribeToTicker(ticker.wallet, (price) => {
					this.updatedTicker(ticker.wallet, price);
				});
			});
		}
	},
	watch: {
		sellectedTicker() {
			this.sellectedTickerData = {
				data: [],
				labels: [],
			};
		},

		filter() {
			this.page = 1;
		},

		pageStateOptions(newValue) {
			window.history.pushState(
				null,
				document.title,
				`${window.location.pathname}?filter=${newValue.filter}&page=${newValue.page}`
			);
		},

		paginatedTickers(value) {
			if (this.paginatedTickers.length === 0 && this.page > 1) {
				this.page--;
			}
		},

		tickers() {
			localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));
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

	&__info {
		height: 60vh;
		width: 100%;

		display: grid;
		grid-template-rows: auto 1fr;
	}

	&__info-top {
		display: flex;
		justify-content: flex-end;

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
