<template>
	<input :value="value" @input="handleChange($event.target.value)" />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
	props: {
		value: String,
	},
	setup(props, { emit }) {
		return { handleChange };

		function handleChange(value: String) {
			emit('input', value);
		}
	},
});
</script>
