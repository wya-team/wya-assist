<template>
	<div>
		<vca-table-filter :data-source="dataSource">
			<div>filter</div>
		</vca-table-filter>
		<vca-table-sorter v-model="value">
			<div>sorter</div>
		</vca-table-sorter>

		<vca-table-operate :data-source="dataSource1" @click="handleClick" />
	</div>
</template>

<script>
import Message from '@wya/vc/lib/message';
import Table from '..';

export default {
	name: 'vca-basic',
	components: {
		'vca-table-filter': Table.Filter,
		'vca-table-sorter': Table.Sorter,
		'vca-table-operate': Table.Operate
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
			],
			dataSource1: [
				{
					message: '带提示',
					name: '按钮1 - 带提示'
				},
				{
					name: '按钮2'
				},
				{
					message: '带提示',
					name: '按钮3 - 带提示'
				},
				{
					name: '按钮4'
				}

			] 
		};
	},
	methods: {
		handleOk() {
			Message.info('ok');
		},
		handleCancel() {
			Message.info('cancel');
		},
		handleClick(name, item) {
			Message.info(name);
		}	
	}
};
</script>

<style lang="scss" scoped>
</style>
