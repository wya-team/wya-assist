<template>
	<div :class="classes" class="vm-editor-cell">
		<div :style="{flex: `0 0 ${labelWidth}px` , textAlign: `${align}` }" class="vm-editor-cell__wrapper">
			<span v-if="required" style="color: red">*</span>
			<slot name="label">
				{{ label }}
			</slot>
		</div>
		<div class="vm-editor-cell__content">
			<div
				:style="!multiple ? 'display: flex; align-items: center' : ''"
				class="vm-editor-cell__extra"
			>
				<slot />
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'vm-editor-cell',
	props: {
		labelWidth: {
			type: [Number, String],
			default: 80
		},
		label: String,
		// label的对齐方式
		align: {
			type: String,
			default: 'right'
		},
		 // 多行模式
		multiple: {
			type: Boolean,
			default: false
		},
		required: {
			type: [Boolean, Number, String],
			default: false
		}
	},
	data() {
		return {
		};
	},
	computed: {
		classes() {
			/**
			 * form/list特殊处理
			 */
			return {
				'is-multi': this.multiple,
				'is-line': !this.multiple,
			};
		},
	},
	watch: {

	},

};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-cell;

@include block($block) {
	display: flex;
	justify-content: space-between;
	padding-left: 6px;
	margin-top: 10px;
	@include when(multi) {
		align-items: flex-start;
	}
	@include when(line) {
		align-items: center;
	}

	@include element(wrapper) {
		cursor: default;
		height: 22px;
		line-height: 22px;
		padding: 0 4px;
	}
	@include element(content) {
		flex: 1;
		min-height: 22px;
		display: flex;
	}
}
</style>
