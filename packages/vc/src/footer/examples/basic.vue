<template>
	<div>
		<vca-footer @ok="handleOk" @cancel="handleCancel" />
	</div>
</template>

<script>
import Footer from '..';

export default {
	name: 'vca-basic',
	components: {
		'vca-footer': Footer
	},
	methods: {
		handleOk() {
			alert('ok');
		},
		handleCancel() {
			alert('cancel');
		}		
	}
};
</script>

<style lang="scss" scoped>
</style>
