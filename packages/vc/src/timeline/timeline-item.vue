<template>
	<div class="vca-timeline-item">
		<div class="vca-timeline-item__left">
			<div 
				:style="dotStyle" 
				:class="{ 'is-circle': !$slots.dot && color }"
				class="vca-timeline-item__base"
			>
				<!-- 指示器 -->
				<slot name="dot" />
			</div>
			<div :style="lineStyle" class="vca-timeline-item__line" />
		</div>
		<div class="vca-timeline-item__right">
			<slot />
		</div>
	</div>
</template>
<script>
export default {
	name: "vca-timeline-item",
	props: {
		// TODO: 指示器左边文案
		label: {
			type: [String, Function],
			default: ''
		},
		color: {
			type: String,
			default: "#5495f6"
		},
		lineColor: {
			type: String,
			default: "#e8e8e8"
		}
	},
	computed: {
		dotStyle() {
			return { 
				borderColor: this.color,
			};
		},
		lineStyle() {
			return { 
				borderColor: this.lineColor,
			};
		}
	}
};
</script>

<style lang="scss">
.vca-timeline-item {
	display: flex;
	font-size: 12px;
	.vca-timeline-item__left {
		position: relative;
		margin-right: 5px;
	}
	&:last-child {
		.vca-timeline-item__left {
			.vca-timeline-item__line {
				display: none;
			}
		}
	}

	.vca-timeline-item__right {
		margin-top: -4px;
		color: #999;
	}

	.vca-timeline-item__line {
		position: absolute;
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
		transform: translateX(-50%);
		border-left-width: 1px;
		border-left-style: solid;
	}

	.vca-timeline-item__base {
		position: relative;
		border-radius: 50%;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		&.is-circle {
			width: 6px;
			height: 6px;
			border: 2px solid;
			box-sizing: content-box;
			background-color: #fff;
		}
	}
}
</style>
