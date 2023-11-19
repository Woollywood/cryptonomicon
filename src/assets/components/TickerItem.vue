<template>
	<div class="ticker" :ticker="modelValue">
		<div class="ticker__wallet">{{ wallet }} - USD</div>
		<div class="ticker__value" v-if="walletValue">{{ walletValue }}</div>
		<div class="ticker__value ticker__value--error" v-else-if="getErrors">Ошибка</div>
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
		getErrors() {
			return this.modelValue.error;
		},
	},
	data() {
		return {
			ticker: {},
		};
	},
};
</script>

<style lang="scss" scoped>
.ticker {
	cursor: pointer;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: rem(16);
	transition: background-color 0.3s ease;
	padding: rem(12) rem(16);

	&:hover {
		background-color: color('grey', 0.4);
	}

	&__wallet {
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
		&:not(:last-child) {
			margin-bottom: rem(36);
		}
	}

	&__delete {
	}
}
</style>
