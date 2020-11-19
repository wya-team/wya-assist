<template>
	<vm-editor-layout
		title="页面设置"
		class="vm-basic-page-editor"
	>
		<vm-editor-cell label="页面标题：" multiple>
			<vc-input
				v-model="$attrs.title"
				:indicator="{ inline: true }"
				:maxlength="10"
				@input="handleChange(arguments[0], 'title')"
			/>
		</vm-editor-cell>

		<vm-editor-cell label="页面背景：" multiple>
			<vm-editor-radio
				v-model="$attrs.backgroundType"
				:data-source="radios"
				@change="handleChange(arguments[0], 'backgroundType')"
			/>
			<div style="margin-top: 10px">
				<div v-show="$attrs.backgroundType == 1">
					<vm-editor-color
						:color="$attrs.backgroundColor"
						default="#f2f2f2"
						alpha
						@change="handleChange(arguments[0], 'backgroundColor')"
					/>
				</div>
				<div v-show="$attrs.backgroundType == 2">
					<vm-editor-imgs-picker
						v-model="$attrs.backgroundImage"
						tips="建议宽度750像素"
						@change="handleChange(arguments[0], 'backgroundImage')"
					/>
				</div>
			</div>
		</vm-editor-cell>
	</vm-editor-layout>
</template>

<script>
import Input from "@wya/vc/lib/input";
import Editor from "../../../editor";

export default {
	name: 'vm-basic-page-editor',
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-radio': Editor.Radio,
		'vm-editor-layout': Editor.Layout,
		'vm-editor-color': Editor.Color,
		'vm-editor-imgs-picker': Editor.ImgsPicker,
		'vc-input': Input,
	},
	props: {

	},
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
@import "../../../style/index.scss";
$block: vm-basic-page-editor;
@include block($block) {
	@include element(divider){
		position: relative;
		top: -.06em;
		display: inline-block;
		width: 1px;
		height: .9em;
		margin: 0 4px;
		vertical-align: middle;
		box-sizing: border-box;
		padding: 0;
		font-size: 14px;
		font-variant: tabular-nums;
		line-height: 1.5;
		list-style: none;
		font-feature-settings: "tnum","tnum";
		background: #e8e8e8;
	}
}
</style>
