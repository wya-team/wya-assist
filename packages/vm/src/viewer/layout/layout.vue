<template>
	<div class="vm-viewer-layout" :style="wrapper">
		<div :style="content">
			<slot />
		</div>
	</div>
</template>

<script>

export default {
	name: "vm-viewer-layout",
	props: {
		wrapper: {
			type: [String, Array, Object],
			default: () => ([])
		},
		content: {
			type: [String, Array, Object],
			default: () => ([])
		}
	}
};
</script>
