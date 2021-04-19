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
		inner: {
			type: [Boolean, Number],
			default: false
		},
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
		currentInner() {
			const { inner: $$inner } = this.$parent.$attrs;
			const { inner: $inner } = this.$parent;
			const { inner } = this;

			return $$inner || $inner || inner;
		},
		wrapperStyle() {
			if (this.wrapper) return this.wrapper;
			let { backgroundColor, paddingVertical, paddingHorizontal, borderRadius } = this.$parent;
			let { 
				backgroundColor: $backgroundColor, 
				paddingVertical: $paddingVertical, 
				paddingHorizontal: $paddingHorizontal, 
				borderRadius: $borderRadius, 
			} = this.$parent.$attrs || {};
			
			backgroundColor = backgroundColor || $backgroundColor || 'transparent';
			paddingVertical = paddingVertical || $paddingVertical || 0;
			paddingHorizontal = paddingHorizontal || $paddingHorizontal || 0;
			borderRadius = borderRadius || $borderRadius || 0;
			
			return {
				padding: `${paddingVertical}px ${paddingHorizontal}px`,
				background: this.currentInner ? `${backgroundColor}` : 'transparent',
				borderRadius: this.currentInner ? `${borderRadius}px` : 'inherit',
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
				borderRadius: !this.currentInner ? `${borderRadius}px` : undefined,
				overflow: 'hidden'
			};
		}
	}
};
</script>
