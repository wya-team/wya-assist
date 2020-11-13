<template>
	<!-- 仅这个组件添加了外部className -->
	<div class="g-reset"> 
		<slot />
	</div>
</template>
<script>
export default {
	name: "set-title",
	props: {
		title: String
	},
	mounted() {
		document.title = this.title || document.title;
	}
};
</script>