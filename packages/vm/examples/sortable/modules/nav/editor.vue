<template>
	<vm-editor-layout
		title="阶段导航"
		class="vm-basic-nav-editor"
	>
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
		<vm-editor-cell label="页面背景：" style="margin-top: 20px;" multiple>
			<vm-editor-radio
				v-model="$attrs.backgroundType"
				:data-source="radios"
				@change="handleChange(arguments[0], 'backgroundType')"
			/>
			<div v-show="$attrs.backgroundType == 1" style="margin-top:20px;">
				<vm-editor-color
					:color="$attrs.backgroundColor"
					default="#f2f2f2"
					alpha
					@change="handleChange(arguments[0], 'backgroundColor')"
				/>
			</div>
			<div v-show="$attrs.backgroundType == 2" style="margin-top:20px;">
				<vm-editor-imgs-picker
					v-model="$attrs.backgroundImage"
					tips="建议宽度750像素"
					@change="handleChange(arguments[0], 'backgroundImage')"
				/>
			</div>
		</vm-editor-cell>
		<vm-editor-cell label="图标：">
			<vm-editor-imgs-picker
				v-model="$attrs.icon"
				:gallery="true"
				tips="建议尺寸：36x36像素"
				@change="handleChange(arguments[0], 'icon')"
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
	</vm-editor-layout>
</template>

<script>
import { Editor } from '../../../../src/index';

export default {
	name: 'vm-basic-nav-editor', // eslint-disable-line
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-radio': Editor.Radio,
		'vm-editor-layout': Editor.Layout,
		'vm-editor-imgs-picker': Editor.ImgsPicker,
		'vm-editor-color': Editor.Color,
		'vm-editor-slider': Editor.Slider,
	},
	inheritAttrs: false,
	data() {
		return {
			radios: [
				{
					label: '纯色背景',
					value: 1,

				},
				{
					label: '自定义背景图',
					value: 2,
				}
			],
		};
	},
	methods: {
		handleChange(value, key) {
			this.$emit('change', { [key]: value });
		},

	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-nav-editor;
@include block($block) {
	
}
</style>
