<template>
	<div class="vca-gallery-img-item">
		<div
			:class="{ 'is-checked': checked || disabled, 'is-disabled': disabled }"
			class="vca-gallery-img-item__img-wrapper"
			@click="handleToggle"
		>
			<img :src="`${it[valueKey.fileUrl]}!4-4`" class="vca-gallery-img-item__img">
			<div v-show="checked || disabled" class="vca-gallery-img-item__checked-icon-wrapper">
				<vc-icon type="correct" class="vca-gallery-img-item__checked-icon" />
			</div>
		</div>
		<div class="vca-gallery-img-item__name-wrapper">
			<span class="vca-gallery-img-item__name">{{ it[valueKey.fileName] }}</span>
			<vc-icon type="edit" class="vca-gallery-img-item__name-edit-icon" @click="handleRename" />
		</div>
	</div>
</template>

<script>
import Icon from '@wya/vc/lib/icon';
import Message from '@wya/vc/lib/message';

import { Editor, MoveImg } from './popup';

export default {
	name: 'vca-gallery-img-item',
	inject: ['APIS', 'store', 'http', 'valueKey'],
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
				title: '图片重命名',
				originalText: this.it[fileName],
				placeholder: '请输入新的图片名称',
			}).then(({ inputValue }) => {
				const v = inputValue || this.it[fileName];
				this.http({
					url: this.APIS['URL_GALLERY_IMG_RENAME'],
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
		}
	}
};
</script>

<style lang="scss">
@import "../style/index.scss";

$block: vca-gallery-img-item;

@include block($block) {
	overflow: hidden;
	display: inline-block;
	width: 104px;
	border-radius: 4px;

	@include element(img-wrapper) {
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
