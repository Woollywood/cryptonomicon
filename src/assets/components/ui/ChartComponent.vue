<template>
	<div class="chart-component">
		<Bar :data="chartValue" :options="chartOptions" ref="bar" />
	</div>
</template>

<script>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
	components: {
		Bar,
	},
	name: 'ChartComponent',
	props: {
		dataValue: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			chartOptions: {
				responsive: true,
			},
		};
	},
	computed: {
		chartValue() {
			return {
				labels: ['January', 'February', 'March'],
				datasets: [{ data: this.dataValue.map((value) => Number(value)) }],
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.chart-component {
	position: relative;

	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
