<template>
	<div>
		<vca-editable-text :value="value" @complete="handleComplete" />
		<vca-editable-text 
			:value="value"
			input-type="number"
			complete="onConfirm"
			@complete="handleComplete"
		/>
	</div>
</template>

<script>
import EditableText from '../index';

export default {
	name: '',
	components: {
		'vca-editable-text': EditableText
	},
	data() {
		return {
			value: '100'
		};
	},
	methods: {
		handleComplete(value) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					this.value = value;
					resolve();
				}, 2000);
			});	
		}
	},
};
</script>

<style lang="scss">

</style>
