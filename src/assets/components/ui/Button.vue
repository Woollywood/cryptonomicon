<template>
	<button
		class="button"
		:class="{ 'button-primary': type === 'primary', 'button-secondary': type === 'secondary' }"
		@mouseenter="hover = true"
		@mouseleave="hover = false">
		<font-awesome-icon v-if="prependIcon" :beat="hover" :icon="prependIcon" ref="prependIconRef" />
		<span v-if="hasSlots">
			<slot></slot>
		</span>
	</button>
</template>

<script>
export default {
	name: 'Button',
	data() {
		return {
			hover: false,
		};
	},
	props: {
		type: {
			type: String,
			default: 'primary',
		},
		prependIcon: {
			type: Array,
			required: false,
		},
	},
	computed: {
		hasSlots() {
			return Object.entries(this.$slots).length;
		},
	},
};
</script>

<style lang="scss" scoped>
.button {
	border-radius: rem(32);
	padding: rem(12) rem(16);

	display: flex;
	gap: rem(12);
	justify-content: center;
	align-items: center;

	font-size: rem(18);
	font-weight: 500;

	transition: background-color 0.3s ease;
}

.button-primary {
	background-color: color('grey', 0.8);

	&:not(&:disabled) {
		&:hover {
			background-color: color('grey');
		}
	}

	&:disabled {
		background-color: color('grey', 0.4);
	}
}

.button-secondary {
	background-color: transparent;

	&:hover {
		background-color: color('grey', 0.4);
	}
}
</style>
