<template>
	<div v-if="vm.type === 'frame'" class="vm-basic-steps-viewer" :style="layoutStyle.wrapper">
		<div :style="layoutStyle.content">
			<div class="vm-basic-steps-viewer__main">
				<template v-if="!isLast">
					<div :style="btnStyle">
						上一页
					</div>
					<div :style="btnStyle">
						下一页
					</div>
				</template>
				<div v-else :style="btnStyle">
					提交
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Viewer } from '../../../../src/index';

export default {
	name: 'vm-steps-viewer',  // eslint-disable-line
	inject: ['getVM', 'getData'],
	mixins: Viewer.mixins(['layout-style']),
	props: {
		id: String,
		buttonBackgroundColor: {
			type: String,
			default: "#87A3F7"
		},
		index: Number,
		vm: Object
	},
	computed: {
		btnStyle() {
			return {
				background: this.buttonBackgroundColor
			};
		},

		isLast() {
			return this.index === this.getData().length - 1;
		}
	}
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-steps-viewer;

@include block($block) {
	@include element(main) {
		display: flex;
		justify-content: space-around;
		align-items: center;
		> div {
			height: 36px;
			border-radius: 18px;
			padding: 0 48px;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-weight: bold;
			font-size: 16px;
		}
	}
}
</style>
