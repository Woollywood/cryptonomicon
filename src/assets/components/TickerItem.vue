<template>
	<div class="ticker" :ticker="modelValue">
		<div class="ticker__wallet">{{ wallet }} - USD</div>
		<div class="ticker__value" v-if="walletValue">{{ formatPrice(walletValue) }}</div>
		<Preloader class="ticker__preloader" v-else />
		<Button
			class="ticker__delete"
			type="secondary"
			:prepend-icon="['fas', 'trash']"
			@click.stop="$emit('delete', wallet)">
			Удалить
		</Button>
	</div>
</template>

<script>
export default {
	props: {
		modelValue: {
			type: Object,
			required: true,
		},
	},
	computed: {
		wallet() {
			return this.modelValue.wallet;
		},
		walletValue() {
			return this.modelValue.walletValue;
		},
	},
	data() {
		return {
			ticker: {},
		};
	},
	methods: {
		formatPrice(price) {
			if (price === '-') {
				return price;
			} else {
				price = Number(price);
			}

			return price > 1 ? price.toFixed(2) : price.toPrecision(2);
		},
	},
};
</script>

<style lang="scss" scoped>
.ticker {
	cursor: pointer;
	display: grid;
	grid-template-rows: auto 1fr auto;
	justify-content: center;
	border-radius: rem(16);
	transition: background-color 0.3s ease;
	padding: rem(12) rem(16);

	&:hover {
		background-color: color('grey', 0.4);
	}

	&__wallet {
		text-align: center;
		text-transform: uppercase;
		font-size: rem(14);
		color: color('grey', 0.8);

		&:not(:last-child) {
			margin-bottom: rem(16);
		}
	}

	&__value {
		text-align: center;
		font-size: rem(36);

		&--error {
			color: color('red');
		}

		&:not(:last-child) {
			margin-bottom: rem(36);
		}
	}

	&__preloader {
		margin: 0 auto;

		&:not(:last-child) {
			margin-bottom: rem(36);
		}
	}

	&__delete {
	}
}
</style>
