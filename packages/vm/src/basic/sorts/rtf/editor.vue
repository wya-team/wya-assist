<template>
	<vm-editor-layout title="富文本" class="vm-rtf-editor">
		<vm-editor-cell label="填充方式：" multiple>
			<vm-editor-radio
				v-model="$attrs.inner"
				:data-source="paddingRadios"
				@change="handleChange(arguments[0], 'inner')"
			/>
		</vm-editor-cell>
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
		<vm-editor-cell label="背景颜色：">
			<vm-editor-color
				:color="$attrs.backgroundColor"
				default="#fff"
				alpha
				@change="handleChange(arguments[0], 'backgroundColor')"
			/>
		</vm-editor-cell>
		<div style="width: 342px; margin: 24px 0 20px 14px;">
			<vc-editor
				ref="editor"
				v-model="$attrs.content"
				style="height: 308px;"
				@change="handleChange(arguments[0].html, 'content')"
			/>
		</div>
		<vm-editor-tip content="平铺展示，文本长的情况下可以分行展示" />
	</vm-editor-layout>
</template>

<script>
import Editor from '@wya/vc/lib/editor';

import VMEditor from "../../../editor";


export default {
	name: 'vm-rtf-editor',
	components: {
		'vc-editor': Editor,
		'vm-editor-radio': VMEditor.Radio,
		'vm-editor-cell': VMEditor.Cell,
		'vm-editor-layout': VMEditor.Layout,
		'vm-editor-color': VMEditor.Color,
		'vm-editor-slider': VMEditor.Slider,
		'vm-editor-tip': VMEditor.Tip,
	},
	inheritAttrs: false,
	props: {

	},
	data() {
		return {
			len: 0,
			component: [
				{
					label: '纯色背景',
					value: 1,

				},
				{
					label: '自定义背景图',
					value: 2,
				}
			],
			paddingRadios: [
				{
					label: '外填充',
					value: 0,

				},
				{
					label: '内填充',
					value: 1,
				}
			]
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
@import "../../../style/index.scss";
$block: vm-rtf-editor;
@include block($block) {
	.ql-picker-options{
		right: 0;
	}
}
</style>
