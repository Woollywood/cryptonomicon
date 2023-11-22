<template>
	<div class="pagination">
		<div class="pagination__buttons">
			<Button class="pagination__button" :disabled="page == 1" @click="$emit('prev-page')">Назад</Button>
			<Button class="pagination__button" :disabled="!hasNextPage" @click="$emit('next-page')">Вперед</Button>
		</div>
		<div class="layout__filter" v-tippy="'Фильтр по названию тикера'">
			<Input placeholder="Фильтр" type="text" v-model="filter" @input="$emit('update-filter', filter)" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			filter: '',
		};
	},
	props: {
		page: {
			type: [Number, String],
			required: true,
		},
		filteredTickers: {
			type: Array,
			required: true,
		},
	},
	emits: {
		'prev-page': null,
		'next-page': null,
		'update-filter': (value) => typeof value === 'string',
	},
	computed: {
		startIndex() {
			return (this.page - 1) * 8;
		},

		endIndex() {
			return this.page * 8;
		},
		hasNextPage() {
			return this.filteredTickers.length > this.endIndex;
		},
	},
};
</script>

<style lang="scss" scoped>
.pagination {
	display: flex;
	gap: rem(36);
	align-items: center;

	&:not(:last-child) {
		margin-bottom: rem(32);
	}

	&__buttons {
		display: flex;
		align-items: center;
		gap: rem(16);
	}

	&__button {
		flex: 0 0 rem(160);
		width: rem(160);
	}
}
</style>
