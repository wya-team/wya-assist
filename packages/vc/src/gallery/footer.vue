<template>
	<div class="vca-gallery-footer">
		<div class="vca-gallery-footer__selected-tip">
			已选择{{ selectedFileIds.length }}个
			<template v-if="max">
				，最多可选择{{ max }}个
			</template>
		</div>
		<div class="vca-gallery-footer__btn-wrapper">
			<div class="vca-gallery-footer__btn-group">
				<vc-button 
					class="vca-gallery-footer__btn-cancel" 
					@click="handleCancel"
				>
					取消
				</vc-button>
				<vc-button type="primary" @click="handleConfirm">
					确定
				</vc-button>
			</div>

			<div v-show="selectedFileIds.length" class="vca-gallery-footer__btn-group">
				<vc-button @click="handleClearSelected">
					取消选中
				</vc-button>
				<vc-popconfirm
					title="确定要删除所选文件吗？"
					@ok="handleDel"
				>
					<vc-button>
						删除
					</vc-button>
				</vc-popconfirm>
				<vc-button @click="handleMove">
					移动到
				</vc-button>
			</div>
		</div>
	</div>
</template>

<script>
import Button from '@wya/vc/lib/button';
import Popconfirm from '@wya/vc/lib/popconfirm';
import { MoveFile } from './popup';

export default {
	name: 'vca-gallery-footer',
	components: {
		'vc-button': Button,
		'vc-popconfirm': Popconfirm
	},
	inject: ['APIS', 'store', 'http', 'valueKey'],
	props: {
		max: {
			type: Number,
			default: 0
		}
	},
	computed: {
		selectedFileIds() {
			const { fileId } = this.valueKey;
			const selectedFiles = this.store.state.selectedFiles;
			return selectedFiles.map(item => item[fileId]);
		},
		curCategory() {
			return this.store.state.curCategory;
		},
	},
	methods: {
		handleClearSelected() {
			this.store.commit('GALLERY_SELECTED_FILES_SET', { target: [] });
		},
		handleCancel() {
			this.$emit('cancel');
		},
		handleConfirm() {
			this.$emit('ok');
		},
		handleMove() {
			MoveFile.popup({
				value: this.curCategory[this.valueKey.catId],
				api: this.APIS.URL_GALLERY_FILE_MOVE,
				http: this.http,
				valueKey: this.valueKey,
				categories: this.store.state.categories,
				fileIds: this.selectedFileIds
			}).then(() => {
				this.$emit('refresh-category');
				this.store.commit('GALLERY_FILE_LIST_INIT');
				this.store.commit('GALLERY_SELECTED_FILES_SET', { target: [] });
			});
		},
		handleDel() {
			const { catId, fileId } = this.valueKey;
			this.http({
				url: this.APIS['URL_GALLERY_FILE_DELETE'],
				type: 'POST',
				param: {
					[fileId]: this.selectedFileIds.join()
				}
			}).then(() => {
				this.$emit('refresh-category');
				this.store.commit('GALLERY_FILE_LIST_RESET', { catId: this.curCategory[catId] });
				this.store.commit('GALLERY_SELECTED_FILES_SET', { target: [] });
			}).catch(err => {
				console.log(err, 'error');
			});

		},
	},
};
</script>

<style lang="scss">
@import "../style/index.scss";

@include block(vca-gallery-footer) {
	display: flex;
	align-items: center;
	@include element(selected-tip) {
		width: 230px;
		text-align: left;
	}
	@include element(btn-wrapper) {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		flex: 1;
	}
	@include element(btn-cancel) {
		margin-right: 8px;
	}
}
</style>
