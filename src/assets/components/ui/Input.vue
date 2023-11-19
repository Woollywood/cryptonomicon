<template>
	<input class="input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script>
export default {
	name: 'Input',
	props: {
		modelValue: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="scss" scoped>
.input {
	background-color: transparent;
	padding: rem(4) 0;
	border-bottom: 1px solid color('grey', 0.6);
}
</style>
