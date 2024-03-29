<template>
	<div class="vca-gallery-file-item">
		<div
			:class="{ 'is-checked': checked || disabled, 'is-disabled': disabled }"
			class="vca-gallery-file-item__file-wrapper"
			:title="disabled || it.disabled ? '该项不可选' : '该项可选'"
			@click="handleToggle"
		>
			<vc-img 
				v-if="it[valueKey.fileType] !== 3"
				:src="videoPosterUrl || `${it[valueKey.fileUrl]}!4-4`"
				class="vca-gallery-file-item__img"
			/>
			<div v-show="checked || disabled" class="vca-gallery-file-item__checked-icon-wrapper">
				<vc-icon type="correct" class="vca-gallery-file-item__checked-icon" />
			</div>
			<div v-if="it.disabled" class="vca-gallery-file-item__disabled-reason">
				<div v-for="(item, index) in it.disabledReasons" :key="index">
					{{ index + 1 }}.{{ item }}
				</div>
			</div>
			<div 
				v-if="it[valueKey.fileType] === 1"
				class="vca-gallery-file-item__preview-icon-wrapper"
				title="点击预览"
				@click.stop="handlePlay(it, $event)"
			>
				<vc-icon type="visible" class="vca-gallery-file-item__preview-icon" />
			</div>
			<template v-else>
				<div 
					class="vca-gallery-file-item__preview-icon-wrapper"
					title="点击预览"
					@click.stop="handlePlay(it, $event)"
				>
					<vc-icon type="toplay" class="vca-gallery-file-item__play-icon" />
				</div>
				<div class="vca-gallery-file-item__duration">
					{{ duration }}
				</div>
			</template>
		</div>
		<div class="vca-gallery-file-item__name-wrapper">
			<span class="vca-gallery-file-item__name" :title="it[valueKey.fileName]">{{ it[valueKey.fileName] }}</span>
			<vc-icon type="edit" class="vca-gallery-file-item__name-edit-icon" @click="handleRename" />
		</div>
	</div>
</template>

<script>
import Icon from '@wya/vc/lib/icon';
import Message from '@wya/vc/lib/message';
import Img from '@wya/vc/lib/img';
import ImgsPreview from '@wya/vc/lib/imgs-preview';

import { Editor, MoveFile, VideoPreviewer, AudioPreviewer } from './popup';

export default {
	name: 'vca-gallery-file-item',
	inject: ['APIS', 'store', 'http', 'valueKey', 'sourceName'],
	components: {
		'vc-icon': Icon,
		'vc-img': Img,
	},
	props: {
		it: {
			type: Object,
			default: () => ({})
		},
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		duration() {
			const { duration } = this.it;
			const hours = Math.floor(duration / (60 * 60));
			let rest = duration % (60 * 60);
			const minutes = Math.floor(rest / 60);
			rest %= 60;
			return `${this.paddingZero(hours)}:${this.paddingZero(minutes)}:${this.paddingZero(rest)}`;
		},
		videoPosterUrl() {
			const { fileUrl, fileType } = this.valueKey;
			// 阿里云视频截帧 -> https://help.aliyun.com/document_detail/64555.html
			return this.it[fileType] === 2 
				? `${this.it[fileUrl]}?x-oss-process=video/snapshot,t_0,f_png,w_0,h_0,m_fast`
				: '';
		},
	},
	methods: {
		paddingZero(value) {
			return value < 10 ? `0${value}` : `${value}`;
		},
		handleRename() {
			const { fileName, fileId } = this.valueKey;
			Editor.popup({
				title: `${this.sourceName}重命名`,
				originalText: this.it[fileName],
				placeholder: `请输入新的${this.sourceName}名称`,
				maxlength: 10
			}).then(({ inputValue }) => {
				const v = inputValue || this.it[fileName];
				this.http({
					url: this.APIS['URL_GALLERY_FILE_RENAME'],
					type: 'POST',
					param: {
						[fileId]: this.it[fileId],
						[fileName]: v
					}
				}).then(() => {
					this.it[fileName] = v;
				}).catch(err => {
					console.log(err, 'error');
				});
			}).catch(() => {});
		},

		handleToggle() {
			if (this.disabled || this.it.disabled) return;
			this.$emit('toggle');
		},
		handlePlay(item, event) {
			const { fileName, fileType, fileUrl } = this.valueKey;
			const type = item[fileType];
			// 音频
			if (type === 3) {
				AudioPreviewer.popup({
					src: item[fileUrl],
					name: item[fileName]
				});
			// 视频
			} else if (type === 2) {
				VideoPreviewer.popup({
					dataSource: [item[fileUrl]]
				});
			// 图片
			} else {
				let pos = {};
				try {
					const target = event.target; // 先得到pos, 否则getThumbBoundsFn再计划，target已变化（比如弹窗transition的影响）
					const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
					const rect = target.getBoundingClientRect();

					pos = { x: rect.left, y: rect.top + pageYScroll, w: rect.width };

				} catch (e) {
					console.log(e);
				}

				const url = item[fileUrl];
				ImgsPreview.open({
					dataSource: [{
						src: url,
						thumbnail: url,
						title: item[fileName]
					}],
					opts: {
						index: 0,
						history: false,
						getThumbBoundsFn: (index) => pos
					},
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import "../style/index.scss";

$block: vca-gallery-file-item;

@include block($block) {
	overflow: hidden;
	display: inline-block;
	width: 104px;
	border-radius: 4px;

	@include element(file-wrapper) {
		position: relative;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 104px;
		height: 104px;
		background: #f8f8f8;
		cursor: pointer;
		border: 1px solid transparent;
		border-radius: 4px;
		z-index: 0;
		@include when(checked) {
			border-color: #5495f6;
			@include element(checked-icon-wrapper) {
				position: absolute;
				bottom: 0;
				right: 0;
				border-width: 10px 12px;
				border-style: solid;
				border-color: transparent #5495f6 #5495f6 transparent;
				z-index: 10;
			}
			@include element(checked-icon) {
				position: absolute;
				top: -2px;
				right: -10px;
				color: #fff;
				font-size: 8px;
			}
		}
		@include when(disabled) {
			border-color: rgba(84, 149, 246, .5);
			@include element(checked-icon-wrapper) {
				border-color: transparent rgba(84, 149, 246, .5) rgba(84, 149, 246, .5) transparent;
			}
		}

		@include element(disabled-reason) {
			display: none;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 8px;
			font-size: 10px;
			color: #fff;
			background: rgba(0, 0, 0, .5);
		}

		@include element(preview-icon-wrapper) {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-top: -16px;
			margin-left: -16px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 32px;
			height: 32px;
			border: 1px solid #fff;
			border-radius: 50%;
			background: rgba(0, 0, 0, .5);
			transition: all .2s .15s ease;
			transform: scale(0);
			opacity: 0;
		}
		@include element(play-icon) {
			margin-right: -4px;
			color: #fff;
			font-size: 18px;
		}
		@include element(preview-icon) {
			color: #fff;
			font-size: 18px;
		}
		&:hover {
			@include element(preview-icon-wrapper) {
				display: flex;
				justify-content: center;
				align-items: center;
				transform: scale(1);
				opacity: 1;
			}
			@include element(disabled-reason) {
				display: block;
			}
		}
		@include element(duration) {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding-left: 4px;
			width: 100%;
			height: 20px;
			line-height: 20px;
			font-size: 12px;
			color: #fff;
			background: rgba(0, 0, 0, .5);
			z-index: 9;
		}
	}
	@include element(img) {
		width: 104px;
		height: 104px;
		border: none;
		img {
			object-fit: cover;
		}
	}
	@include element(name-edit-icon) {
		display: none;
		flex-shrink: 0;
		color: #5495f6;
		cursor: pointer;
	}

	@include element(name-wrapper) {
		margin-top: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 22px;
		line-height: 22px;
		@include pseudo(hover) {
			@include element(name-edit-icon) {
				display: inline-block;
			}
		}
	}

	@include element(name) {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		flex: 1;
	}

	@include element(toolbar) {
		display: flex;
		justify-content: space-between;
	}
	@include element(tool) {
		font-size: 12px;
		color: #5495f6;
		cursor: pointer;
	}
}
</style>
