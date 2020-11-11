<template>
	<vm-editor-layout
		title="辅助空白"
		class="vm-basic-space-editor"
	>
		<vm-editor-cell label="空白高度：" style="margin-top: 36px;">
			<vm-editor-slider
				v-model="$attrs.height"
				:max="100"
				@change="handleChange(arguments[0], 'height')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="背景颜色：" style="margin-top: 22px;">
			<vm-editor-color 
				:color="$attrs.backgroundColor" 
				default="#fff" 
				alpha 
				@change="handleChange(arguments[0], 'backgroundColor')"
			/>
		</vm-editor-cell>
	</vm-editor-layout>
</template>

<script>
import VMEditor from "../../../editor";

export default {
	name: 'vm-basic-space-editor',
	components: {
		'vm-editor-cell': VMEditor.Cell,
		'vm-editor-layout': VMEditor.Layout,
		'vm-editor-color': VMEditor.Color,
		'vm-editor-slider': VMEditor.Slider,
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
