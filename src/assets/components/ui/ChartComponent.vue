<template>
	<div class="chart-component">
		<Line :data="chartValue" :options="chartOptions" />
	</div>
</template>

<script>
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
	components: {
		Line,
	},
	name: 'ChartComponent',
	props: {
		dataValue: {
			type: Array,
			required: true,
		},
		wallet: {
			type: String,
			required: true,
		},
		labels: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			chartOptions: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: false,
					},
				},
			},
		};
	},
	computed: {
		chartValue() {
			return {
				labels: this.labels,
				datasets: [
					{
						label: this.wallet,
						data: this.dataValue.map((value) => Number(value)),
					},
				],
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
