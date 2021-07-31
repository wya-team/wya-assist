<template>
	<div>
		<vca-table-filter :data-source="dataSource">
			<div>filter</div>
		</vca-table-filter>
		<vca-table-sorter v-model="value" :options="dataSource" @select="handleSort">
			<div>sorter</div>
		</vca-table-sorter>

		<vca-table-operate :data-source="dataSource1" :split-count="2" @click="handleClick" />
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
					message: '确定要进行该项操作吗？',
					label: '操作项1 - 带确认'
				},
				{
					label: '操作项2'
				}
				// {
				// 	message: '确定要进行该项操作吗？',
				// 	label: '操作项3 - 带确认',
				// 	tip: '这是一个既有提示，又有操作确认的操作项'
				// },
				// {
				// 	message: '确定要进行该项操作吗？',
				// 	label: '操作项4 - 禁用',
				// 	disabled: true
				// },
				// {
				// 	label: '操作项5 - 带提示',
				// 	tip: '这是一个有提示的操作项'
				// },
				// {
				// 	label: '操作项6 - 禁用',
				// 	disabled: true
				// },
				// {
				// 	label: '操作项7 - 禁用 - 带提示',
				// 	disabled: true,
				// 	tip: '这是一个有提示的、但被禁用的操作项'
				// }
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
		handleClick(label, item) {
			Message.info(label);
		},
		handleSort(res) {
			console.log(res);
			console.log(this.value);
		}	
	}
};
</script>

<style lang="scss" scoped>
</style>
