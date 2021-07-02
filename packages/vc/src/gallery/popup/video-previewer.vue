<template>
	<vc-modal
		v-model="visible"
		title=""
		class="vca-gallery-video-previewer"
		mask-closable
		@close="handleClose"
	>
		<div class="vca-gallery-video-previewer__video-wrapper">
			<video 
				ref="video"
				:src="srcList[0]"
				controlslist="nodownload"
				class="vca-gallery-video-previewer__video"
				controls
				disablePictureInPicture
			/>
		</div>
		<div class="vca-gallery-video-previewer__close-wrapper">
			<vc-icon type="close" class="vca-gallery-video-previewer__close" @click="handleClose" />
		</div>
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';
import Icon from '@wya/vc/lib/icon';

const config = {
	name: 'vca-gallery-video-previewer',
	components: {
		'vc-modal': Modal,
		'vc-icon': Icon
	},
	props: {
		/**
		 * 视频数据，目前只支持一个视频预览
		 * TODO：多个视频切换预览，类似于imgs-preview ？？
		 */
		dataSource: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {
		srcList() {
			return this.dataSource.map(it => {
				return typeof it === 'string' ? it : it.src;
			});
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleClose() {
			this.$refs.video.pause();
			this.visible = false;
			this.$emit('close');
		}
	},
};

export default config;
export const VideoPreviewer = new Portal(config, { promise: false });
</script>

<style lang="scss">
@import "../../style/index.scss";

@include block(vca-gallery-video-previewer) {
	position: relative;
	width: 80%;
	@include element(video-wrapper) {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	@include element(video) {
		max-width: 100%;
		max-height: 100%;
		width: 60vw;
		outline: none;
	}

	@include element(close-wrapper) {
		position: absolute;
		top: 12px;
		right: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		font-size: 16px;
		color: #fff;
		cursor: pointer;
		background: rgba(0, 0, 0, .3)
	}

	.vc-modal__header, .vc-modal__footer {
		display: none;
	}
	.vc-modal__container, .vc-modal__content {
		padding: 0;
		min-height: auto !important;
	}
}
</style>
