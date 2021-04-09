<template>
	<div class="vca-gallery-file-item">
		<div
			:class="{ 'is-checked': checked || disabled, 'is-disabled': disabled }"
			class="vca-gallery-file-item__file-wrapper"
			@click="handleToggle"
		>
			<img :src="`${it[valueKey.fileUrl]}!4-4`" class="vca-gallery-file-item__img">
			<div v-show="checked || disabled" class="vca-gallery-file-item__checked-icon-wrapper">
				<vc-icon type="correct" class="vca-gallery-file-item__checked-icon" />
			</div>
			<div 
				v-if="it[valueKey.fileType] === 2"
				class="vca-gallery-file-item__play-icon-wrapper"
				@click.stop="handlePlay(it)"
			>
				<vc-icon type="toplay" class="vca-gallery-file-item__play-icon" />
			</div>
		</div>
		<div class="vca-gallery-file-item__name-wrapper">
			<span class="vca-gallery-file-item__name">{{ it[valueKey.fileName] }}</span>
			<vc-icon type="edit" class="vca-gallery-file-item__name-edit-icon" @click="handleRename" />
		</div>
	</div>
</template>

<script>
import Icon from '@wya/vc/lib/icon';
import Message from '@wya/vc/lib/message';

import { Editor, MoveFile, VideoPreviewer } from './popup';

export default {
	name: 'vca-gallery-file-item',
	inject: ['APIS', 'store', 'http', 'valueKey', 'sourceName'],
	components: {
		'vc-icon': Icon
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
	methods: {
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
			if (this.disabled) return;
			this.$emit('toggle');
		},
		handlePlay(item) {
			VideoPreviewer.popup({
				dataSource: [item[this.valueKey.fileUrl]]
			});
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
		@include when(checked) {
			border-color: #5495f6;
			@include element(checked-icon-wrapper) {
				position: absolute;
				bottom: 0;
				right: 0;
				border-width: 10px 12px;
				border-style: solid;
				border-color: transparent #5495f6 #5495f6 transparent;
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

		@include element(play-icon-wrapper) {
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
			margin-right: -3px;
			color: #fff;
			font-size: 18px;
		}
		&:hover {
			@include element(play-icon-wrapper) {
				display: flex;
				justify-content: center;
				align-items: center;
				transform: scale(1);
				opacity: 1;
			}
		}
	}
	@include element(img) {
		width: 104px;
		height: 104px;
		object-fit: cover;
		border: none;
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