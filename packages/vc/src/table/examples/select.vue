<template>
	<div>
		<vca-table-select
			v-model="currentSelected1"
			:load-data="loadData"
		>
			<vc-table-column label="name" prop="name" />
			<vc-table-column label="status" prop="status" />
			<vc-table-column label="opt" prop="opt" />
		</vca-table-select>
		<br>
		<br>
		<div>{{ currentSelected1 }}</div>
		<br>
		<br>
		<vca-table-select
			v-model="currentSelected2"
			:max="3"
			:load-data="loadData"
		>
			<vc-table-column label="name" prop="name" />
			<vc-table-column label="status" prop="status" />
			<vc-table-column label="opt" prop="opt" />
		</vca-table-select>
		<br>
		<br>
			<div>{{ currentSelected2 }}</div>
		<br>
		<br>
	</div>
</template>

<script>
import VcaTable from '..';

export default {
	name: '',
	components: {
		'vca-table-select': VcaTable.Select
	},
	data() {
		return {
			currentSelected1: [],
			currentSelected2: []
		};
	},
	methods: {
		loadData(page, pageSize) {
			return new Promise((resolve, reject) => {
				console.log(`page: ${page}: @success`);
				// 模拟后端的数据
				resolve({
					status: 1,
					data: {
						page: {
							current: page,
							total: 100,
							count: pageSize * 100,
						},
						list: this.getFakeData(page, pageSize)
					}
				});
			});
		},
		getFakeData(page, pageSize) {
			let fakeData = [];
			for (let i = 0; i < pageSize; i++) {
				fakeData.push({
					id: `${page}_${i}`,
					name: `page: ${page}, type: ${this.type}, sort: ${i}`,
					status: Math.floor(Math.random() * 3 + 1),
					opt: Math.floor(Math.random() * 3 + 1)
				});
			}
			return fakeData;
		},
	},
};
</script>

<style lang="scss">
</style>
