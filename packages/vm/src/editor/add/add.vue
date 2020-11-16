<template>
	<div class="vm-editor-add">
		<vc-sort-list
			:data-source="currentValue"
			:mask="false"
			:value-key="valueKey"
			v-bind="$attrs"
			class="vm-editor-add__sorts"
			@change="handleChange"
		>
			<template #default="{ it, index }">
				<div class="vm-editor-add__item">
					<vc-icon
						type="error"
						class="vm-editor-add__close"
						@click="handleDelete(index)"
					/>
					<slot :it="it" :index="index" />
				</div>
			</template>
		</vc-sort-list>
		<div
			v-if="max === 0 || dataSource.length < max"
			class="vm-editor-add__btn"
			@click="handleAdd"
		>
			<div class="vm-editor-add__btn--operate">
				<vc-icon
					type="plus"
					style="position: relative; top: -1px;"
				/>
				<span>{{ addText }}</span>
			</div>
			<span 
				v-if="tip" 
				class="vm-editor-add__btn--tip"
			>{{ tip }}</span>
		</div>
	</div>
</template>
<script>
import Icon from '@wya/vc/lib/icon';
import SortList from '@wya/vc/lib/sort-list';

export default {
	name: 'vm-editor-add',
	components: {
		'vc-sort-list': SortList,
		'vc-icon': Icon,
	},
	inheritAttrs: false,
	model: {
		prop: 'dataSource',
		event: 'change'
	},
	props: {
		dataSource: {
			type: Array,
			default: () => ([])
		},
		addText: {
			type: String,
			default: '添加选项'
		},
		tip: {
			type: String,
			default: ''
		},

		// max为0时可以无限选择
		max: {
			type: Number,
			default: 0
		},

		// max为0时可以无限选择
		valueKey: {
			type: String,
			default: '_id'
		},
	},
	data() {
		return {
			currentValue: []
		};
	},
	watch: {
		dataSource: {
			immediate: true,
			handler(v) {
				if (this.currentValue !== v) {
					this.currentValue = v;
				}
			}
		}
	},
	methods: {
		handleDelete(index) {
			this.currentValue.splice(index, 1);
			this.$emit('change', this.currentValue);
		},

		handleAdd() {
			this.$emit('add', this.currentValue);
		},

		handleChange(v) {
			this.currentValue = v;

			this.$emit('change', v);
		}
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-add;

@include block($block) {
	@include element(sorts) {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
	}
	@include element(item) {
		// height: 83px;
		border: 1px dashed #e8e8e8;
		padding: 10px;
		margin-right: 10px;
		position: relative;
		display: flex;
	}
	@include element(close) {
		position: absolute;
		right: -8px;
		top: -8px;
		color: #999;
		font-size: 16px;
		z-index: 999;
		cursor: pointer;
	}
	@include element(btn) {
		margin: 15px 20px 0 10px;;
		padding: 8px 0;

		border: 1px dashed #e8e8e8;
		background: #F8F8F8;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		cursor: pointer;

		@include modifier(operate) {
			color: #5495F6;
		}
	}
}
</style>
