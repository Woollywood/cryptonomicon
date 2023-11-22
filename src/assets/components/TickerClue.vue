<template>
	<div class="clue-item" @click="$emit('add-ticker-clue', ticker)">
		{{ ticker }}
	</div>
</template>

<script>
export default {
	props: {
		ticker: {
			type: String,
			required: true,
		},
	},
	emits: {
		'add-ticker-clue': (value) => typeof value === 'string',
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
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
</style>
