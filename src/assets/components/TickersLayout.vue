<template>
	<transition name="fade">
		<div class="layout__main" v-if="tickers.length">
			<hr class="layout__hr" />
			<div class="layout__main-inner">
				<TickerItem
					class="layout__ticker"
					v-for="(ticker, index) in paginatedTickers"
					:key="ticker.name"
					:id="ticker.id"
					:class="{ selected: sellectedTicker === ticker }"
					v-model="paginatedTickers[index]"
					@click="$emit('update:sellected-ticker', ticker)"
					@delete="$emit('delete', $event)" />
				<h3 class="layout__main-empty" v-if="!paginatedTickers.length">Тикеры не найдены</h3>
			</div>
			<hr class="layout__hr" />
		</div>
	</transition>
</template>

<script>
import TickerItem from '@/assets/components/TickerItem.vue';

export default {
	components: {
		TickerItem,
	},
	props: {
		sellectedTicker: {
			type: [Object, null],
			required: true,
		},
		page: {
			type: [Number, String],
			required: true,
		},
		tickers: {
			type: Array,
			required: true,
		},
		filter: {
			type: String,
			required: true,
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

		paginatedTickers() {
			return this.filteredTickers.slice(this.startIndex, this.endIndex);
		},
	},
};
</script>

<style lang="scss" scoped>
.layout {
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

	&__main-empty {
		font-size: rem(22);
	}

	&__hr {
		margin: rem(40) 0;
		background-color: color('black', 0.8);
		width: 100%;
		height: 1px;
	}

	&__ticker {
		&.selected {
			outline: 1px solid color('grey', 0.8);
		}
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
