<template>
	<div
		class="vm-basic-TPL-editor"
		style="display: flex; flex-direction: column;"
	>
		<vm-editor-header title="TPL" />
		<vm-editor-cell label="上下边距：" style="margin-top: 32px;">
			<vm-editor-slider
				v-model="$attrs.paddingVertical"
				@change="handleChange(arguments[0], 'paddingVertical')"
			/>
		</vm-editor-cell>
	</div>
</template>

<script>
import Editor from "../../../editor";

export default {
	name: 'vm-basic-TPL-editor', // eslint-disable-line
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-header': Editor.Header,
		'vm-editor-slider': Editor.Slider,
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
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-basic-TPL-editor;
@include block($block) {
	
}
</style>
