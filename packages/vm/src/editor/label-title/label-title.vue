<template>
	<div class="vm-editor-label-title">
		{{ label }}
	</div>
</template>
<script>
export default {
	name: 'vm-editor-label-title',
	props: {
		label: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
		};
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-label-title;
$c51: #515151;
@include block($block) {
	font-size: 12px;
	color: $c51;
	line-height: 22px;
}
</style>
