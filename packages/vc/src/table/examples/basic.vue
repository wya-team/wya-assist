<template>
	<div>
		<vca-table-filter :data-source="dataSource">
			<div>filter</div>
		</vca-table-filter>
		<vca-table-sorter v-model="value">
			<div>sorter</div>
		</vca-table-sorter>
	</div>
</template>

<script>
import Table from '..';

export default {
	name: 'vca-basic',
	components: {
		'vca-table-filter': Table.Filter,
		'vca-table-sorter': Table.Sorter
	},
	data() {
		return {
			value: 'unsort',
			dataSource: [
				{
					value: '1',
					label: '1'
				},
				{
					value: '2',
					label: '2'
				}
			]
		};
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
