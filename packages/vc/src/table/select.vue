<!-- 通常用于弹层, TODO: 是否考虑集成tabs -->
<template>
	<div class="vca-table-select">
		<vc-radio-group 
			v-model="currentRadio" 
			style="width: 100%;"
			v-bind="radioGroupOpts"
		>
			<vc-paging
				ref="paging"
				:data-source="listInfo.data"
				:count="listInfo.count"
				:reset="listInfo.reset"
				:history="false"
				:show="show"
				:load-data="rebuildLoadData"
				:page-opts="pageOpts"
				:current.sync="current"
				:auth="{ pageSize: false }"
				mode="table"
				v-bind="pagingOpts"
				@row-click="handleRowClick"
				@page-size-change="handleChangePageSize"
				@page-change="handleChangePage"
				@selection-change="handleSelectChange"
			>
				<vc-table-item>
					<!-- 多选 -->
					<vc-table-column
						v-if="multiple"
						:selectable="selectable"
						type="selection"
						width="80"
					/>

					<!-- 单选 -->
					<vc-table-column
						v-if="!multiple"
						width="80"
					>
						<template #default="{ row }">
							<vc-radio
								:label="row[valueKey]"
								:disabled="!selectable(row)"
								v-bind="radioOpts"
							>
								{{ '' }}
							</vc-radio>
						</template>
					</vc-table-column>
					<slot />
				</vc-table-item>
				<template v-if="showSelectCount" #extra>
					已选择 {{ currentSelected.length }} 条
				</template>
			</vc-paging>
		</vc-radio-group>
	</div>
</template>

<script>
import { cloneDeep } from 'lodash';
import Table from '@wya/vc/lib/table';
import Paging from '@wya/vc/lib/paging';
import Radio from '@wya/vc/lib/radio';

const initialState = {
	reset: false,
	current: 0,
	total: 0,
	count: 0,
	data: {

	}
};

export default {
	name: 'vca-table-select',
	components: {
		'vc-paging': Paging,
		'vc-table-column': Table.Column,
		'vc-radio': Radio,
		'vc-radio-group': Radio.Group,
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		// 已选择的数据
		value: {
			type: [Array, Object],
			default: () => []
		},
		 // 1: 单选 >1: 多选
		max: {
			type: [Number, String],
			default: 1
		},

		valueKey: {
			type: String,
			default: 'id'
		},

		// 当前行是否可选择
		selectable: {
			type: Function,
			default: (row) => true
		},

		showSelectCount: {
			type: Boolean,
			default: true
		},

		// paging
		show: {
			type: Boolean,
			default: true
		},

		loadData: {
			type: Function,
			required: true
		},

		pageOpts: {
			type: Object,
			default: () => ({
				showCount: true,
				showSizer: true,
				showElevator: true,
				placement: 'top',
				pageSizeOpts: [5, 10, 20]
			})
		},

		pagingOpts: {
			type: Object,
			default: () => ({})
		},

		radioGroupOpts: {
			type: Object,
			default: () => ({})
		},

		radioOpts: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {
			currentRadio: '', // 单选时使用
			currentSelected: [], // 已选中的数据
			current: 1, // 当前页
			listInfo: {
				...initialState
			}
		};
	},
	computed: {

		// 是否多选
		multiple() { 
			return this.max > 1;
		},

		// 获得已选中的属性值数组
		selectedIds() {
			return this.currentSelected.map(it => it[this.valueKey]) || [];
		}
	},
	watch: {
		'listInfo.data': function (v) {
			this.selectByCheckbox();
			this.selectByRadio();
		},

		value: {
			immediate: true,
			handler(v) {
				if (typeof v !== 'object' || !v) {
					this.currentSelected = [];
					return;
				}
				this.currentSelected = cloneDeep(v instanceof Array ? v : [v]);
			}
		}
	},
	methods: {
		rebuildLoadData(page, pageSize) {
			return this.loadData(page, pageSize).then(res => {

				this.listInfo = {
					...this.listInfo,
					...res.data.page,
					data: {
						...this.listInfo.data,
						[page]: res.data.list
					}
					
				};

				return res;
			});
		},

		/**
		 * 外部方法，当前页刷新 -> { reset: true }
		 */
		refresh(opts = {}) {
			const { reset = false } = opts;
			this.listInfo = {
				...initialState,
				reset
			};
		},

		// 处理单选
		selectByRadio() {
			if (this.multiple) return;
			if (this.selectedIds.length) {
				this.currentRadio = this.selectedIds[0];
			}
		},

		// 处理多选
		selectByCheckbox() {
			if (!this.multiple) return;
			const { data = [] } = this.listInfo;
			const { valueKey, current } = this;
			const hasData = data[current] && data[current].length;

			// 多选 初始化当前页选择
			if (hasData && this.selectedIds.length) {
				const pageData = data[current];
				let indexArr = [];
				pageData.forEach((it, i) => {
					if (this.selectedIds.includes(it[valueKey])) {
						indexArr.push(i);
					}
				});
				this.$refs.paging.clearSelection();
				indexArr.forEach(index => {
					this.$nextTick(() => {
						this.$refs.paging.toggleRowSelection(this.listInfo.data[current][index], true);
					});
				});
			}
		},

		// 点击
		handleRowClick(row) {
			if (!this.selectable(row)) return; // 不可选

			// 单选
			if (!this.multiple) {
				this.currentSelected = [{ ...row }];
				this.currentRadio = row[this.valueKey];

				this.sync();

				return;
			}

			// 多选
			const { [this.valueKey]: id } = row;
			const hasSelect = this.selectedIds.includes(id);
			hasSelect
				? this.currentSelected.splice(this.selectedIds.indexOf(id), 1)
				: this.currentSelected.push(row);

			// this.sync(); 由以下控制
			this.$refs.paging.toggleRowSelection(row, !hasSelect);
		},


		/**
		 * 切换页面也会执行此方法
		 * TODO: 来回调用，存在内存问题
		 */
		handleSelectChange(selection) {
			const curData = this.listInfo.data[this.current] || [];
			const curIds = curData.map(it => it[this.valueKey]); // 当前页的id集合

			const curSelected = [
				...selection,
				...this.currentSelected.filter(it => !curIds.includes(it[this.valueKey]))
			];

			// 超出最大选择, 截取
			this.currentSelected = curSelected.length > this.max 
				? curSelected.slice(0, this.max) 
				: curSelected;

			this.sync();
		},

		// 切换分页数量
		handleChangePageSize() {
			this.reset();
		},

		// 切换分页
		handleChangePage(page) {
			this.selectByCheckbox();
		},

		/**
		 * 
		 */
		sync() {
			this.$emit('change', this.currentSelected);
		}
	}
};
</script>
