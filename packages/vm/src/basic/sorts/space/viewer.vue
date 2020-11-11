<template>
	<vm-viewer-layout
		class="vm-basic-space-viewer"
	>
		<div 
			:style="[{ height: `${height ? `${height}px` : 'auto' }`}]"
		/>
	</vm-viewer-layout>
</template>

<script>
import Viewer from '../../../viewer';

export default {
	name: 'vm-basic-space-viewer',
	components: {
		"vm-viewer-layout": Viewer.Layout
	},
	props: {
		height: {
			type: Number,
			default: 22
		},
	},
	data() {
		return {
		};
	},
	created() {
	}
};
</script>

<style lang="scss">
@import "../../../style/index.scss";
$block: vm-basic-space-viewer;

</style>
