<template>
	<div class="add-ticker">
		<form class="add-ticker__form" @submit.prevent="addTickerSubmit(searchQuery)">
			<div class="search-query-wrapper">
				<label class="search-query">
					<span class="search-query__label">Тикер</span>
					<Input
						class="search-query__input"
						placeholder="Например DOGE"
						type="text"
						v-model="searchQuery"
						@input="searchQueryError = ''" />
					<span class="search-query-error" v-if="searchQueryError">{{ searchQueryError }}</span>
				</label>
				<transition name="fade">
					<div class="search-query-clue" v-if="searchQueryClue.length">
						<TickerClue
							v-for="ticker in searchQueryClue"
							:ticker="ticker"
							@add-ticker-clue="addTickerClue" />
					</div>
				</transition>
			</div>
			<transition name="fade">
				<Button class="add-ticker__ticker-add" :prepend-icon="['fas', 'circle-plus']" v-if="searchQuery">
					Добавить
				</Button>
			</transition>
		</form>
	</div>
</template>

<script>
import TickerClue from '@/assets/components/TickerClue';

import { fetchAllTickers } from '@/api';

export default {
	components: {
		TickerClue,
	},
	data() {
		return {
			searchQuery: '',
			searchQueryError: '',
			allTickers: [],
		};
	},
	props: {
		tickers: {
			type: Array,
			required: true,
		},
	},
	emits: {
		'add-ticker': (value) => typeof value === 'string',
	},
	methods: {
		addTicker(tickerName) {
			if (this.tickers.find((ticker) => ticker.wallet === tickerName)) {
				this.searchQueryError = 'Такой тикер уже существует';
				return;
			}

			this.$emit('add-ticker', tickerName);
		},

		addTickerSubmit(tickerName) {
			if (!tickerName.length) {
				return;
			}

			this.addTickerThrottle(tickerName);
			this.searchQuery = '';
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

		addTickerClue(tickerName) {
			this.addTickerThrottle(tickerName);
			this.searchQuery = '';
		},
	},
	created() {
		this.addTickerThrottle = this.addTickerThrottleWrapper(this.addTicker, 1000);
		fetchAllTickers().then((data) => (this.allTickers = Object.values(data.Data).map((value) => value.Symbol)));
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
};
</script>

<style lang="scss" scoped>
.add-ticker {
	&__form {
		display: flex;
		gap: rem(12);
		align-items: center;
	}

	&__ticker-add {
		@media (max-width: $mobileSmall) {
			width: 100%;
		}
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

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease !important;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
