<template>
	<vm-viewer-layout
		:class="`is-layout-${layout}`"
		class="vm-basic-cut-off-viewer"
		reverse
	>
		<div
			v-if="layout === 1"
			:style="[{ borderBottom: `1px solid ${color}` }]"
			class="vm-basic-cut-off-viewer__line"
		/>
		<div
			v-else
			:style="[{ borderBottom: `1px dotted ${color}` }]"
			class="vm-basic-cut-off-viewer__line"
		/>
	</vm-viewer-layout>
</template>

<script>
import Viewer from '../../../viewer';

export default {
	name: 'vm-basic-cut-off-viewer',
	components: {
		"vm-viewer-layout": Viewer.Layout
	},
	props: {
		id: String,
		layout: Number,
		color: String,
	}
};
</script>

<style lang="scss">
@import "../../../style/index.scss";

$block: vm-basic-cut-off-viewer;

@include block($block) {
	overflow: hidden;
	@include element(line) {
		height: 1px;
		display: block;
		position: relative;
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
	}
}


</style>
