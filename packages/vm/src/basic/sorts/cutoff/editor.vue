<template>
	<div
		class="vm-basic-cut-off-editor"
		style="display: flex; flex-direction: column;"
	>
		<vm-editor-header title="分割线" />
		<vm-editor-cell label="上下边距：">
			<vm-editor-slider
				v-model="$attrs.paddingVertical"
				@change="handleChange(arguments[0], 'paddingVertical')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="左右边距：">
			<vm-editor-slider
				v-model="$attrs.paddingHorizontal"
				@change="handleChange(arguments[0], 'paddingHorizontal')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="选择颜色：" style="margin-top: 20px;">
			<vm-editor-color
				:color="$attrs.color"
				default="#e8e8e8"
				alpha
				@change="handleChange(arguments[0], 'color')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="背景颜色：" style="margin-top: 20px;">
			<vm-editor-color
				:color="$attrs.backgroundColor"
				default="#fff"
				alpha
				@change="handleChange(arguments[0], 'backgroundColor')"
			/>
		</vm-editor-cell>
	</div>
</template>

<script>
import Editor from "../../../editor";

export default {
	name: 'vm-basic-cut-off-editor',
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-header': Editor.Header,
		'vm-editor-color': Editor.Color,
		'vm-editor-slider': Editor.Slider,
	},
	props: {

	},
	data() {
		return {

		};
	},
	computed: {
	},
	created() {
	},
	methods: {
		handleChange(value, key) {
			this.$emit('change', { [key]: value });
		},
	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-basic-cut-off-editor;
@include block($block) {




}
</style>
