<template>
	<div style="display: flex; flex-direction: column;">
		<vm-editor-header :title="title" />
		<slot />
	</div>
</template>

<script>
import Header from '../header';

export default {
	name: 'vm-editor-layout',
	components: {
		'vm-editor-header': Header
	},
	props: {
		title: {
			type: [Number, String],
			default: ''
		}
	}
};
</script>
