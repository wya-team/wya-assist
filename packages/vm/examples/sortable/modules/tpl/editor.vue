<template>
	<div
		class="vm-basic-tpl-editor"
		style="display: flex; flex-direction: column;"
	>
		<vm-editor-header title="模版名称" />
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
		<vm-editor-cell label="NAME：" required>
			<vc-input
				v-model="$attrs.name"
				:maxlength="150"
				:indicator="{ inline: true }"
				clearable
				style="width: 240px"
				placeholder="请输入"
				@input="handleChange(arguments[0], 'name')"
			/>
		</vm-editor-cell>
	</div>
</template>

<script>
import { Editor } from '../../../../src/index';

export default {
	name: 'vm-basic-tpl-editor', // eslint-disable-line
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-header': Editor.Header,
		'vm-editor-slider': Editor.Slider,
		'vm-editor-radio': Editor.Radio,
		'vm-editor-color': Editor.Color,
		'vm-editor-imgs-picker': Editor.ImgsPicker,
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
$block: vm-basic-tpl-editor;
@include block($block) {
	
}
</style>
