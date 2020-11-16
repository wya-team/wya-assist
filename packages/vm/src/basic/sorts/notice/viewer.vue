<template>
	<vm-viewer-layout class="vm-basic-notice-viewer">
		<div class="vm-basic-notice-viewer__wrapper">
			<div>
				<span class="vm-basic-notice-viewer__tag ">公告</span>
				<div class="vm-basic-notice-viewer__content">
					<vc-marquee
						:style="{ color: `${color}` }"
						class="vm-basic-notice-viewer__text"
					>
						{{ content || '请在右侧输入内容' }}
					</vc-marquee>
				</div>
			</div>
			<vcm-icon
				v-if="icon"
				:type="icon"
				style="{ color: iconColor }"
				class="vm-basic-notice-viewer__icon"
			/>
		</div>
	</vm-viewer-layout>
</template>

<script>
import Marquee from '@wya/vc/lib/marquee';
import Icon from '@wya/vc/lib/icon/index.m';
import Viewer from "../../../viewer";

export default {
	name: 'vm-basic-notice-viewer',
	components: {
		'vc-marquee': Marquee,
		'vcm-icon': Icon,
		'vm-viewer-layout': Viewer.Layout
	},
	props: {
		id: String,
		content: String,
		color: String,
		icon: {
			type: String,
			default: 'close'
		},
		iconColor: {
			type: String,
			default: '#ff3c4a'
		}
	},
};
</script>

<style lang="scss">
@import "../../../style/index.scss";
$block: vm-basic-notice-viewer;
$red: #ff3c4a;

@include block($block) {
	@include element(wrapper) {
		position: relative;
		height: 37px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		padding-right: 12px;
		> div {
			flex: 1;
			display: flex;
			align-items: center;
			overflow: hidden;
			padding: 0 10px 0 12px;
		}
	}
	@include element(tag) {
		color: $red;
		background: rgba($red, 0.1);
		padding: 1px 7px;
		border-radius: 2px;
		font-size: 11px;
		position: relative;
		top: -1px;
		margin-right: 8px;
	}
	@include element(content) {
		font-size: 13px;
		flex: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		@include element(text) {
			width: 100%;
			line-height: 23px;
		}
	}
	@include element(icon) {
		font-size: 11px;
	}
}

</style>
