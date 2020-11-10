<template>
	<div class="vm-viewer-layout" :style="wrapperStyle">
		<div :style="contentStyle">
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
			default: ''
		},
		content: {
			type: [String, Array, Object],
			default: ''
		}
	},
	computed: {
		wrapperStyle() {
			if (this.wrapper) return this.wrapper;
			let { paddingVertical, paddingHorizontal } = this.$parent;
			let { 
				paddingVertical: $paddingVertical, 
				paddingHorizontal: $paddingHorizontal, 
			} = this.$parent.$attrs || {};
			
			paddingVertical = paddingVertical || $paddingVertical || 0;
			paddingHorizontal = paddingHorizontal || $paddingHorizontal || 0;
			
			return {
				padding: `${paddingVertical}px ${paddingHorizontal}px`,
			};
		},
		contentStyle() {
			if (this.content) return this.content;
			let { backgroundColor, backgroundImage, backgroundSize, borderRadius } = this.$parent;
			let { 
				backgroundColor: $backgroundColor, 
				backgroundImage: $backgroundImage, 
				backgroundSize: $backgroundSize, 
				borderRadius: $borderRadius, 
			} = this.$parent.$attrs || {};
			
			backgroundColor = backgroundColor || $backgroundColor || 'transparent';
			backgroundImage = backgroundImage || $backgroundImage || '';
			backgroundSize = backgroundSize || $backgroundSize || 'cover';
			borderRadius = borderRadius || $borderRadius || 0;
			
			return {
				background: `${backgroundColor}`,
				backgroundImage: backgroundImage && backgroundImage[0] 
					? `url(${backgroundImage[0]})`
					: undefined,
				backgroundSize,
				borderRadius: `${borderRadius}px`,
				overflow: 'hidden'
			};
		}
	}
};
</script>
