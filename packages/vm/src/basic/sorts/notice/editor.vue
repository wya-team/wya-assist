<template>
	<vm-editor-layout title="公告" class="vm-basic-notice-editor">
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
		<vm-editor-cell label="背景颜色：" style="margin-top: 20px;">
			<div style="margin-top:20px;">
				<vm-editor-color
					:color="$attrs.backgroundColor"
					default="#fff"
					alpha
					@change="handleChange(arguments[0], 'backgroundColor')" 
				/>
			</div>
		</vm-editor-cell>
		<vm-editor-cell label="文本颜色：" style="margin-top: 20px;">
			<vm-editor-color
				:color="$attrs.color"
				default="#333"
				alpha
				@change="handleChange(arguments[0], 'color')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="公告内容：" style="margin-top: 20px;" multiple>
			<div style="width: 300px; margin-bottom: 30px;">
				<vc-textarea
					v-model="$attrs.content"
					:maxlength="300"
					:rows="4"
					indicator
					placeholder="请填写内容，如果内容过长，将会在手机上滚动显示"
					style="width: 100%;"
					@input="handleChange(arguments[0], 'content')"
				/>
			</div>
		</vm-editor-cell>
	</vm-editor-layout>
</template>

<script>
import Editor from "../../../editor";

export default {
	name: 'vm-basic-notice-editor',
	components: {
		'vm-editor-layout': Editor.Layout,
		'vm-editor-cell': Editor.Cell,
		'vm-editor-color': Editor.Color,
		'vm-editor-slider': Editor.Slider
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
$block: vm-basic-notice-editor;
@include block($block) {

}
</style>
