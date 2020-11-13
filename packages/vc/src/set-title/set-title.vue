<template>
	<!-- 仅这个组件添加了外部className -->
	<div class="g-reset"> 
		<vca-bread-crumb :routes="routes" />
		<slot />
	</div>
</template>
<script>
import BreadCrumb from './bread-crumb.vue';

export default {
	name: "vca-set-title",
	aliasName: 'set-title',
	components: {
		'vca-bread-crumb': BreadCrumb
	},
	props: {
		title: String,
		routes: {
			type: Array,
			default: () => ([])
		}
	},
	watch: {
		title: 'resetTitle'
	},
	mounted() {
		this.resetTitle();
	},
	methods: {
		resetTitle() {
			document.title = this.title || document.title;
		}
	}
};
</script>