<template>
	<vm-editor-layout title="文本题" class="vm-basic-q-text-input-editor">
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
		<vm-editor-cell label="圆角：">
			<vm-editor-slider
				v-model="$attrs.borderRadius"
				@change="handleChange(arguments[0], 'borderRadius')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="标题：" required>
			<vc-input
				v-model="$attrs.title"
				:maxlength="150"
				:indicator="{ inline: true }"
				clearable
				style="width: 240px"
				placeholder="请输入"
				@input="handleChange(arguments[0], 'title')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="副标题：">
			<vc-input
				v-model="$attrs.subhead"
				:maxlength="150"
				:indicator="{ inline: true }"
				clearable
				style="width: 240px"
				placeholder="请输入"
				@input="handleChange(arguments[0], 'subhead')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="是否必填：">
			<vc-checkbox
				v-model="$attrs.required"
				:true-value="1"
				:false-value="0"
				:max="150"
				@change="handleChange(arguments[0], 'required')"
			/>
			<span>必填</span>
		</vm-editor-cell>
	</vm-editor-layout>
</template>

<script>
import { Editor } from '../../../../src/index';

export default {
	name: 'vm-basic-q-text-input-editor',
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-layout': Editor.Layout,
		'vm-editor-slider': Editor.Slider
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
$block: vm-basic-q-text-input-editor;
@include block($block) {
	
}
</style>
