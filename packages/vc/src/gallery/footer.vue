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
				<vc-button @click="handleDel">
					删除
				</vc-button>
				<vc-button v-if="!whole" @click="handleMove">
					移动到
				</vc-button>
			</div>
		</div>
	</div>
</template>

<script>
import Modal from '@wya/vc/lib/modal';
import Button from '@wya/vc/lib/button';
import Message from '@wya/vc/lib/message';
import { MoveImg } from './popup';

export default {
	name: 'vca-gallery-footer',
	components: {
		'vc-button': Button
	},
	inject: ['APIS', 'store', 'http', 'valueKey'],
	props: {
		whole: {
			type: Boolean,
			default: false
		},
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
			MoveImg.popup({
				storeInstance: this.store,
				api: this.APIS.URL_GALLERY_IMG_MOVE,
				http: this.http,
				valueKey: this.valueKey
			}).then(() => {
				this.$emit('refresh-category');
				this.store.commit('GALLERY_IMG_LIST_INIT');
				this.store.commit('GALLERY_SELECTED_FILES_SET', { target: [] });
			}).catch(() => {});
		},
		handleDel() {
			const { catId, fileId } = this.valueKey;
			Modal.warning({
				title: '您确定要删除所选的图片吗？',
				onOk: (e, cb) => {
					return this.http({
						url: this.APIS['URL_GALLERY_IMG_DEL'],
						type: 'POST',
						param: {
							[`${fileId}s`]: this.selectedFileIds.join()
						}
					}).then(() => {
						this.$emit('refresh-category');
						this.store.commit('GALLERY_IMG_LIST_RESET', { catId: this.curCategory[catId] });
						this.store.commit('GALLERY_SELECTED_FILES_SET', { target: [] });
						cb();
					}).catch(err => {
						console.log(err, 'error');
					});

				}
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
