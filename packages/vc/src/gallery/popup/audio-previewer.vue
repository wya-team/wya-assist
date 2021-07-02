<template>
	<vc-modal
		v-model="visible"
		title="音频预览"
		cancel-text=""
		class="vca-gallery-audio-previewer"
		@close="handleClose"
		@ok="handleClose"
	>
		<div v-if="name" class="vca-gallery-audio-previewer__name">
			音频文件名称：{{ name }}
		</div>
		<audio ref="audio" :src="src" controls class="vca-gallery-audio-previewer__audio" />
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';

const config = {
	name: 'vca-gallery-video-previewer',
	components: {
		'vc-modal': Modal,
	},
	props: {
		src: String,
		name: String
	},
	data() {
		return {
			visible: false,
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleClose() {
			this.$refs.audio.pause();
			this.visible = false;
		}
	},
};

export default config;
export const AudioPreviewer = new Portal(config, { promise: false });
</script>

<style lang="scss">
.vca-gallery-audio-previewer {
	.vca-gallery-audio-previewer__name {
		margin-bottom: 16px;
		font-size: 14px;
		color: #333;
	}
	.vc-modal__mask, .vc-modal__wrapper {
		z-index: 1100;
	}
}
</style>
