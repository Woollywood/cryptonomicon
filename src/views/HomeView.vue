<script setup>
import TickerItem from '@/assets/components/TickerItem.vue';
</script>

<template>
	<div class="layout">
		<div class="container">
			<div class="layout__top">
				<form @submit.prevent="addTicker">
					<label class="search-query">
						<span class="search-query__label">Тикер</span>
						<Input
							class="search-query__input"
							placeholder="Например DOGE"
							type="text"
							v-model="searchQuery" />
					</label>
					<Button class="layout__ticker-add" :prepend-icon="['fas', 'circle-plus']"> Добавить </Button>
				</form>
			</div>
			<div class="layout__main" v-if="tickers.length">
				<hr class="layout__hr" />
				<div class="layout__main-inner">
					<TickerItem
						class="layout__ticker"
						v-for="ticker in tickers"
						:key="ticker.name"
						:id="ticker.id"
						:class="{ selected: sellectedTicker === ticker }"
						:wallet="ticker.wallet"
						:walletValue="ticker.walletValue"
						@click="selectTicker(ticker)"
						@delete="deleteTicker" />
				</div>
				<hr class="layout__hr" />
			</div>
			{{ selectedTickerData }}
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
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchQuery: '',
			tickers: [],
			sellectedTicker: null,
			selectedTickerData: [],
		};
	},
	methods: {
		deleteTicker(wallet) {
			this.tickers = this.tickers.filter((ticker) => ticker.wallet !== wallet);

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
		},
		addTicker(event) {
			const newTicker = {
				wallet: this.searchQuery,
				walletValue: '-',
			};

			this.tickers.push(newTicker);
			this.searchQuery = '';

			const thisArg = this;

			setInterval(async () => {
				const currentTicker = newTicker;
				const f = await fetch(
					`https://min-api.cryptocompare.com/data/price?fsym=${newTicker.wallet}&tsyms=USD&api_key=92b36e51888ed2958272f0074c6d7ccc6c05bc504185e7799b6aed3ea3db7b22`
				);
				const data = await f.json();
				this.tickers.find((ticker) => ticker.wallet === newTicker.wallet).walletValue =
					data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);

				if (this.sellectedTicker?.wallet === currentTicker.wallet) {
					console.log('push');
					this.selectedTickerData.push(data.USD);
				}
			}, 3000);
		},
	},
};
</script>

<style lang="scss" scoped>
.layout {
	@include adaptiveValue('padding-top', 60, 36, 0, 1920, 568);
	@include adaptiveValue('padding-bottom', 60, 36, 0, 1920, 568);

	&__top {
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
		margin-bottom: rem(12);
	}

	&__label {
		font-size: rem(14);
		color: color('black');
	}

	&__input {
	}
}
</style>
