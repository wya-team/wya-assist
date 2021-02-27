<template>
	<div class="vca-timeline-item">
		<div class="vca-timeline-item__left">
			<div 
				:style="borderColor ? borderStyle : circleStyle" 
				:class="{ 'vca-timeline-item__left--circle' : borderColor }"
				class="vca-timeline-item__left--base g-flex-cc"
			>
				<slot name="content">
					<vcm-icon
						:type="type === 'success' ? 'success' : 'error'"
						:class="['vca-timeline-item__left--icon', type === 'success' ? '' : 'is-error']" 
						:style="iconStyle"
					/>
				</slot>
			</div>
			<div :style="lineStyle" class="vca-timeline-item__left--line" />
		</div>
		<div class="vca-timeline-item__right">
			<slot />
		</div>
	</div>
</template>
<script>
export default {
	name: 'vca-timeline-item',
	props: {
		borderColor: {
			type: String
		},
		circleStyle: {
			type: Object,
			default: () => ({})
		},
		lineStyle: {
			type: Object,
			default: () => ({})
		},
		iconStyle: {
			type: Object,
			default: () => ({})
		},
		type: {
			type: String
		}
	},
	data() {
		return {
			borderStyle: `border-color: ${this.borderColor}`
		};
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
		.vca-timeline-item__left--base {
			position: relative;
			border-radius: 50%;
			z-index: 100;
		}
		.vca-timeline-item__left--circle {
			width: 6px;
			height: 6px;
			border: 2px solid;
			box-sizing: content-box;
			background-color: #fff;
		}
	   .vca-timeline-item__left--line{
			position: absolute;
			left: 50%;
			top: 0;
			width: 1px;
			height: 100%;
			transform: translateX(-50%);
			border-left: 1px solid #e8e8e8;
		}
		.vca-timeline-item__left--icon {
			font-size: 16px;
			color: #26be76;
			&.is-error {
				color: #ff3c4a;
			}
		}
	}
	&:last-child {
		.vca-timeline-item__left {
			.vca-timeline-item__left--line {
				display: none;
			}
		}
	}
	.vca-timeline-item__right {
		margin-top: -4px;
		color: #999;
	}
}
</style>
