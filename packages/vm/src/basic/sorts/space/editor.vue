<template>
	<div
		class="vm-basic-space-editor"
		style="display: flex; flex-direction: column;"
	>
		<vm-editor-header
			title="辅助空白"
		/>
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
	</div>
</template>

<script>
import VMEditor from "../../../editor";

export default {
	name: 'vm-basic-space-editor',
	components: {
		'vm-editor-cell': VMEditor.Cell,
		'vm-editor-header': VMEditor.Header,
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
