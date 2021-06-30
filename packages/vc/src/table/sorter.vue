<template>
	<div
		class="vca-table-sorter"
		@click="handleToggle"
	>
		<div class="vca-table-sorter__label">
			<slot />
		</div>
		<vc-dropdown
			v-if="options.length"
			v-model="isVisible"
			v-bind="$attrs"
			trigger="click"
			placement="bottom"
			tag="div"
			class="vca-table-sorter_box"
			@visible-change="handleVisibleChange"
		>
			<vc-icon
				class="vca-table-sorter-more---icon"
				type="filter-solid"
			/>
			<template #list>
				<div class="vca-table-sorter_title">
					排序
				</div>
				<vc-dropdown-menu class="vca-table-sorter_list">
					<div
						v-for="(item, index) in options"
						:key="index"
						:label="item.value"
						class="vca-table-sorter_item"
					>
						{{ item.label }}
						<span 
							class="vca-table-sorter_asc vca-table-sorter_btn"
							:class="{'is_select':statusIndex == 1 && current === index}"
							@click="handleCaretClick(statusIndex == 1 && current === index ? 0 : 1, item, index)"
						>
							升序
						</span>
						<span 
							class="vca-table-sorter_desc vca-table-sorter_btn"
							:class="{'is_select':statusIndex == 2 && current === index}"
							@click="handleCaretClick(statusIndex == 2 && current === index ? 0 : 2, item, index)"
						>
							降序
						</span>
					</div>
				</vc-dropdown-menu>
			</template>
		</vc-dropdown>
		<div v-else class="vca-table-sorter__wrapper">
			<span
				:class="{'is-active': statusIndex === 1}"
				class="vca-table-sorter__caret is-ascending"
				@click.stop="handleCaretClick(1)"
			/>
			<span
				:class="{'is-active': statusIndex === 2}"
				class="vca-table-sorter__caret is-descending"
				@click.stop="handleCaretClick(2)"
			/>
		</div>
	</div>
</template>

<script>
import Dropdown from '@wya/vc/lib/dropdown';
import Icon from '@wya/vc/lib/icon';

const statusList = ['unsort', 'ascending', 'descending'];
const statusShortList = ['', 'asc', 'desc'];

export default {
	name: 'vca-table-sorter',
	components: {
		'vc-dropdown': Dropdown,
		'vc-dropdown-menu': Dropdown.Menu,
		'vc-icon': Icon,
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		short: Boolean, // 排序值缩写
		value: {
			type: String,
			default: 'unsort', // value传入的值为null || undefined是default才会生效
			validator(value) {
				return statusList.includes(value) || statusShortList.includes(value);
			}
		},
		options: {
			type: Array,
			default: () => ([])
		} // 多个排序值 {value: 排序字段, label: 排序名称}
	},
	data() {
		return {
			isVisible: false,
			current: ''
		};
	},
	computed: {
		curStatusList() {
			return this.short ? statusShortList : statusList;
		},
		statusIndex: {
			get() {
				return this.curStatusList.indexOf(this.value);
			},
			set(value) {
				this.$emit('change', this.curStatusList[value]);
			}
		}
	},
	methods: {
		handleToggle() {
			if (!this.options.length) {
				this.statusIndex = this.statusIndex >= 2 ? 0 : this.statusIndex + 1;
			}
		},
		handleCaretClick(index, item, i) {
			if (item) {
				this.statusIndex = this.statusIndex === index && i === this.current ? 0 : index;
				this.$emit('select', item.value);
				this.current = i;
				this.isVisible = false;
			} else {
				this.statusIndex = this.statusIndex === index ? 0 : index;
			}
		},
		handleVisibleChange() {

		}
	}
};
</script>

<style lang="scss">
.vca-table-sorter {
	padding: 0 !important;
	display: flex !important;
	align-items: center;
	line-height: 23px !important;
	cursor: pointer;

	.vca-table-sorter__label {
		padding: 0;
		line-height: inherit !important;
	}
	.vca-table-sorter__wrapper {
		position: relative;
		width: 12px;
		height: 20px;
	}
	.vca-table-sorter__caret {
		width: 0;
		height: 0;
		border: 5px solid transparent;
		position: absolute;
		left: 9px;
		&.is-ascending {
			border-bottom-color: #666;
			top: -2px;
			&.is-active {
				border-bottom-color:  #5495f6;
			}
		}
		&.is-descending {
			border-top-color: #666;
			bottom: 0px;
			&.is-active {
				border-top-color:  #5495f6;
			}
		}
	}
	.vca-table-sorter_box {
		.vca-table-sorter-more---icon {
			margin-left: 6px;
			margin-top: -2px;
		}
	}
}
.vca-table-sorter_title {
	padding: 7px 16px;
	border-bottom: 1px solid #efefef;
}
.vca-table-sorter_list {
	padding: 7px 16px;
	.vca-table-sorter_item {
		display: flex;
		.vca-table-sorter_btn {
			color: #5495f6;
			cursor: pointer;
			padding: 1px 2px;
			&.is_select {
				border-radius: 2px;
				color: #fff;
				background: #5495f6;
			}
		}
		.vca-table-sorter_asc {
			margin: 0 10px 0 20px;
		}
	}
}
</style>
