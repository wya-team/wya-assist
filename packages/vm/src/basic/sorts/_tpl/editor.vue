
<template>
	<vm-editor-layout title="TPL" class="vm-basic-TPL-editor">
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
	</vm-editor-layout>
</template>

<script>
import Editor from "../../../editor";

export default {
	name: 'vm-basic-TPL-editor', // eslint-disable-line
	components: {
		'vm-editor-radio': Editor.Radio,
		'vm-editor-cell': Editor.Cell,
		'vm-editor-layout': Editor.Layout,
		'vm-editor-slider': Editor.Slider,
	},
	inheritAttrs: false,
	data() {
		return {
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
	methods: {
		handleChange(value, key) {
			this.$emit('change', { [key]: value });
		},
	},
};
</script>

<style lang="scss">
@import "../../../style/index.scss";
$block: vm-basic-TPL-editor;
@include block($block) {
	
}
</style>
