<template>
	<div class="vm-basic-TPL-viewer">
		<p
			:style="[{ margin: `${paddingVertical}px 0`,background: `${backgroundColor}`}]"
		>
			{{ content }}
		</p>
	</div>
</template>

<script>
export default {
	name: 'vm-TPL-viewer',  // eslint-disable-line
	props: {
		id: String,
		content: String,
		paddingVertical: Number,
		backgroundColor: String,
	}
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-basic-TPL-viewer;

@include block($block) {
	
}
</style>
