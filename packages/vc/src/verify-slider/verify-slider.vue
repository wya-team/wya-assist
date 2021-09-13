<template>
	<vc-popover
		ref="popover" 
		v-model="isActive"
		:arrow="false"
		:portal="true"
		trigger="click"
		placement="top"
		portal-class-name="vca-verify-slider"
		@close="handleClose"
		@visible-change="handleVisibleChange"
	>
		<slot />
		<template #content>
			<div class="vca-verify-slider__box">
				<vc-icon
					type="close" 
					class="vca-verify-slider__box-close" 
					@click="handleClose"
				/>
				<vca-verify-slider-core
					ref="sliderCore"
					v-bind="$props"
					@success="handleSuccess"
				/>
			</div>
		</template>
	</vc-popover>
</template>

<script>
/**
 * 来自业务提取，对于后端传图有一定要求
 */
import { Draggable } from '@wya/vm';
import Popover from '@wya/vc/lib/popover';
import Icon from '@wya/vc/lib/icon';
import Core from './core.vue';

export default {
	name: "vca-verify-slider",
	components: {
		'vc-popover': Popover,
		'vc-icon': Icon,
		'vca-verify-slider-core': Core
	},
	model: {
		prop: 'visible',
		event: 'visible-change'
	},
	props: {
		...Core.props,
		visible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isActive: false,
		};
	},
	watch: {
		visible: {
			immediate: true,
			handler(v) {
				this.isActive = v;

				if (this.isActive) {
					this.$refs.sliderCore && this.$refs.sliderCore.rebuildPic();
				}
			}
		},

	},
	methods: {
		handleSuccess() {
			this.handleClose();
			this.$emit('success');
		},
		handleVisibleChange(v) {
			this.isActive = v;

			this.isActive && this.$refs.sliderCore && this.$refs.sliderCore.rebuildPic();

			this.$emit('visible-change', this.isActive);
		},
		handleClose(e) {
			this.isActive = false;
			this.$emit('visible-change', this.isActive);
		},
	},
};

</script>

<style lang="scss">
.vca-verify-slider {
	.vc-popover-core__container {
		padding: 0;
	}
	.vca-verify-slider-core {
		box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.18);
	}
	&__box {
		position: relative;
	}
	&__box-close {
		position: absolute;
		right: 15px;
		top: 10px;
		&:hover {
			cursor: pointer;
		}
	}
}
</style>

