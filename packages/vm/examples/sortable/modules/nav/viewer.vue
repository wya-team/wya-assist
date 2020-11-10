<template>
	<vm-viewer-layout class="vm-basic-nav-viewer">
		<div class="vm-basic-nav-viewer__main">
			<div v-if="icon && icon[0]">
				<img :src="icon[0]">
				<!-- <div v-else class="vm-basic-nav-viewer__placeholder" /> -->
			</div>
			<div class="vm-basic-nav-viewer__text">
				<p>
					{{ title }}
				</p>
				<span v-if="subhead">{{ subhead }}</span>
			</div>
		</div>
	</vm-viewer-layout>
</template>

<script>
import { Viewer } from '../../../../src/index';

export default {
	name: 'vm-nav-viewer',
	components: {
		'vm-viewer-layout': Viewer.Layout
	},
	props: {
		id: String,
		title: String,
		subhead: String,
		icon: Array
	}
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-nav-viewer;

@include block($block) {
	img {
		width: 56px;
		height: 56px;
	}

	@include element(main){
		padding: 20px;
		display: flex;
	}

	@include element(placeholder){
		background: #E7F4FF;
		width: 56px;
		height: 56px;
	}

	@include element(text){
		padding: 0 10px 4px;
		> p {
			color: #0D0D1E;
			font-size: 16px;
			font-weight: 500;
			line-height: 24px;
			word-break: break-word;	
		}
		> span {
			color: #999;
			font-size: 12px;
			word-break: break-word;
		}
	}
}
</style>
