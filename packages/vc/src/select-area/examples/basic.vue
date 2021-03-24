<template>
	<div>
		<vc-button @click="handleSeletArea">
			选择地区
		</vc-button>
	</div>
</template>

<script>
import SelectArea from '..';
import bigData from './big-data';

export default {
	name: 'vca-basic',
	components: {
	},
	data() {
		return {
			bigData,
		};
	},
	methods: {
		handleSeletArea() {
			SelectArea.popup({
				region: this.bigData,
			}).then(res => {
				console.log('res :>> ', res);
			}).catch(err => {
				console.log(err, 'error');
			});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
