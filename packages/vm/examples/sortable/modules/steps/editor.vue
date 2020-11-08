<template>
	<div
		class="vm-basic-steps-editor"
		style="display: flex; flex-direction: column;"
	>
		<vm-editor-header title="分页" />
		<vm-editor-cell label="上下边距：">
			<vm-editor-slider
				v-model="$attrs.paddingVertical"
				@change="handleChange(arguments[0], 'paddingVertical')"
			/>
		</vm-editor-cell>
		<!-- <vm-editor-cell label="左右边距：">
			<vm-editor-slider
				v-model="$attrs.paddingHorizontal"
				@change="handleChange(arguments[0], 'paddingHorizontal')"
			/>
		</vm-editor-cell> -->
		<!-- <vm-editor-cell label="圆角：">
			<vm-editor-slider
				v-model="$attrs.borderRadius"
				@change="handleChange(arguments[0], 'borderRadius')"
			/>
		</vm-editor-cell> -->
		<vm-editor-cell label="按钮颜色：" style="margin-top: 20px;" multiple>
			<vm-editor-color
				:color="$attrs.buttonBackgroundColor"
				default="#87A3F7"
				alpha
				@change="handleChange(arguments[0], 'buttonBackgroundColor')"
			/>
		</vm-editor-cell>
		<vm-editor-tip content="提示：问卷可使用此分页控件，切勿添加多个『连续』的分页控件，用户将会看到空白的表单; 默认最后一项为『提交』" />
	</div>
</template>

<script>
import { Editor } from '../../../../src/index';

export default {
	name: 'vm-basic-steps-editor', // eslint-disable-line
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-header': Editor.Header,
		'vm-editor-slider': Editor.Slider,
		'vm-editor-color': Editor.Color,
		'vm-editor-tip': Editor.Tip,
	},
	inheritAttrs: false,
	methods: {
		handleChange(value, key) {
			this.$emit('change', { [key]: value });
		},

	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-steps-editor;
@include block($block) {
	
}
</style>
