<template>
	<vc-dropdown
		v-model="isVisible"
		v-bind="$attrs"
		trigger="click"
		placement="bottom"
		tag="div"
		:portal-class-name="portalClassName"
		class="vca-table-filter"
		@visible-change="handleVisibleChange"
	>
		<div class="vca-table-filter__trigger">
			<slot />
			<vc-icon
				v-show="showIcon"
				:class="{'is-selectable': !isAllSelected}"
				class="vca-table-filter__trigger--icon"
				type="filter-solid"
			/>
		</div>
		<template #list>
			<vc-dropdown-menu>
				<vc-checkbox
					:value="isAllSelected"
					:indeterminate="indeterminate"
					:disabled="required && isAllSelected"
					class="vca-table-filter__select"
					@change="handleToggleAll"
				>
					全部
				</vc-checkbox>
				<vc-checkbox-group :value="selected" @change="handleChange">
					<vc-checkbox
						v-for="item in dataSource"
						:key="item.value"
						:label="item.value"
						:disabled="required && selected.length === 1 && selected.includes(item.value)"
						class="vca-table-filter__select"
					>
						{{ item.label }}
					</vc-checkbox>
				</vc-checkbox-group>
			</vc-dropdown-menu>
			<div class="vca-table-filter__table">
				<vc-button 
					class="vca-table-filter__table--btn" 
					@click="isVisible = false"
				>
					取消
				</vc-button>
				<vc-button
					type="primary"
					class="vca-table-filter__table--btn"
					@click="handleConfirm"
				>
					确认
				</vc-button>
			</div>
		</template>
	</vc-dropdown>
</template>

<script>
import Button from '@wya/vc/lib/button';
import Dropdown from '@wya/vc/lib/dropdown';
import Checkbox from '@wya/vc/lib/checkbox';
import Icon from '@wya/vc/lib/icon';

export default {
	name: 'vca-table-filter',
	components: {
		'vc-button': Button,
		'vc-dropdown': Dropdown,
		'vc-dropdown-menu': Dropdown.Menu,
		'vc-checkbox': Checkbox,
		'vc-checkbox-group': Checkbox.Group,
		'vc-icon': Icon,
	},
	inheritAttrs: false,
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		// 初始选中的选项
		value: {
			type: Array,
			default() {
				return [];
			}
		},

		// 所有选项
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		},

		// 是否至少选一个
		required: {
			type: Boolean,
			default: false
		},

		showIcon: {
			type: Boolean,
			default: true
		},

		portalClassName: {
			type: String,
			default: 'vca-table-filter'
		}
	},
	data() {
		return {
			isVisible: false,
			isAllSelected: true,
			selected: [],
		};
	},
	computed: {
		indeterminate() {
			return !this.isAllSelected && !!this.selected.length;
		}
	},
	created() {
		this.checkSelection(this.value);
	},
	methods: {
		handleConfirm() {
			let hasChanged = false;
			if (this.value.length !== this.selected.length) {
				hasChanged = true;
			} else {
				hasChanged = this.value.some((item, index) => {
					return item !== this.selected[index];
				});
			}

			// 同table下的api
			hasChanged && this.$emit('change', [...this.selected]);
			this.isAllSelected && this.$emit('select-all', [...this.selected]);
			!this.selected.length && this.$emit('select-none');
			this.isVisible = false;
		},
		handleChange(list) {
			this.checkSelection(list);
			this.selected = list;
		},
		handleToggleAll(value) {
			if (value === this.isAllSelected) return;

			this.selected = value ? this.dataSource.map(item => item.value) : [];
			this.isAllSelected = value;
		},
		checkSelection(list) {
			this.isAllSelected = list.length === this.dataSource.length;
		},
		handleVisibleChange(value) {
			if (value) {
				this.selected = [...this.value];
				this.checkSelection(this.value);
			}
		}
	}
};
</script>

<style lang="scss">
.vca-table-filter {
	min-width: 144px;
	padding-bottom: 0;
	.vca-table-filter__trigger {
		padding: 0;
		display: flex;
		align-items: center;
		cursor: pointer !important;
	}
	.vca-table-filter__trigger--icon {
		margin-left: 6px;
		margin-top: -2px;
		color: #cc6677;
		&.is-selectable {
			color: #5495f6;
		}
	}

	.vca-table-filter__select {
		display: block;
		width: 100%;
		margin: 0;
		line-height: normal;
		padding: 7px 16px;
		clear: both;
		font-size: 12px !important;
		white-space: nowrap;
		list-style: none;
		cursor: pointer;
		transition: background-color .2s ease-in-out;
		&:hover {
			// background-color: $cf3;
		}
	}
	.vca-table-filter__table {
		display: flex;
		.vca-table-filter__table--btn  {
			flex: 1;
			height: 32px !important;
			border-radius: 0 !important;
		}
	}

	// vc-reset
	.vc-checkbox-group {
		overflow-y: auto;
		max-height: 160px;
		.vc-dropdown-item {
			height: 32px;
		}
	}
	.vc-checkbox {
		margin-right: 8px;
		width: 100%;
	}
}

</style>
