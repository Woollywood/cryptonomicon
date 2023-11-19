<template>
	<div class="ticker">
		<div class="ticker__wallet">{{ wallet }} - USD</div>
		<div class="ticker__value">{{ walletValue }}</div>
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
		wallet: {
			type: String,
			required: true,
		},
		walletValue: {
			type: [Number, String],
			required: true,
		},
	},
	data() {
		return {};
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
		font-size: rem(36);

		&:not(:last-child) {
			margin-bottom: rem(36);
		}
	}

	&__delete {
	}
}
</style>
