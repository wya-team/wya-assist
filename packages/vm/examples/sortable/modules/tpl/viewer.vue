<template>
	<vm-viewer-layout>
		Name: {{ name }}
	</vm-viewer-layout>
</template>

<script>
import { Viewer } from '../../../../src/index';

export default {
	name: 'vm-tpl-viewer',
	components: {
		'vm-viewer-layout': Viewer.Layout,
	},
	props: {
		vm: {
			type: Object,
			default: () => ({})
		},
		id: String,
		name: [Number, String],
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
		
	},
};
</script>