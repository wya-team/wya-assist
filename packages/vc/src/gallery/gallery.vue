<template>
	<vc-modal
		v-model="isVisible"
		:mask-closable="false"
		size="large"
		:title="`我的${sourceName}`"
		class="vca-gallery vm-hack-editor"
		@cancel="handleCancel"
	>
		<div class="vca-gallery__content">
			<div class="vca-gallery__category--wrapper">
				<vca-gallery-category-menu
					:data-source="categories"
					:value="currentMenuId"
					:upload-opts="fileUploadOpts"
					@add-success="handleAddSuccess"
					@del-success="handleDelSuccess"
					@change="handleMenuChange"
				/>
			</div>

			<div class="vca-gallery__view--wrapper">
				<div class="vca-gallery__view">
					<div class="vca-gallery__view-imgs">
						<div 
							v-if="listInfo[currentMenuId].total && !listInfo[currentMenuId].count"
							class="vca-gallery__empty"
						>
							暂无素材，请上传
						</div>
						<vc-paging
							v-else-if="categories.length >= 1"
							ref="tableTarget"
							:data-source="listInfo[currentMenuId].data"
							:count="listInfo[currentMenuId].count"
							:total="listInfo[currentMenuId].total"
							:reset="listInfo[currentMenuId].reset"
							:current.sync="current[currentMenuId]"
							:history="false"
							:load-data="loadData"
							:page-opts="pageOpts"
							mode="piece"
							@page-size-change="handleChangePageSize"
						>
							<template #default="{ it }">
								<vca-gallery-file-item
									:it="it"
									:checked="selectedFileIds.includes(it[valueKey.fileId])"
									:disabled="disabledList.includes(it[valueKey.fileUrl])"
									@toggle="handleFileToggle(it)"
								/>
							</template>
						</vc-paging>
					</div>
				</div>
			</div>
		</div>

		<template #footer>
			<vca-gallery-footer
				:max="max"
				@cancel="handleCancel"
				@ok="handleConfirm"
				@refresh-category="loadCategories"
			/>
		</template>
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';
import Paging from '@wya/vc/lib/paging';
import Message from '@wya/vc/lib/message';

import { ajax } from '@wya/http';
import { SOURCE_MAP, DEFAULT_FIELD_MAP } from './constants.js';
import { isValidMime, getMimesByMimeStr } from './utils.js';

import GalleryStore from './store';
import CategoryMenu from './menu.vue';
import FileItem from './file-item.vue';
import Footer from './footer.vue';

export default {
	name: 'vca-gallery',
	components: {
		'vc-modal': Modal,
		'vc-paging': Paging,
		'vca-gallery-category-menu': CategoryMenu,
		'vca-gallery-file-item': FileItem,
		'vca-gallery-footer': Footer
	},
	provide() {
		return {
			APIS: this.apis,
			store: this.store,
			http: this.http,
			valueKey: this.valueKey,
			accept: this.accept,
			sourceName: this.sourceName
		};
	},
	props: {
		// 类型：图片image、视频video、音频audio
		accept: {
			type: String,
			default: 'image',
			validator: value => Object.keys(SOURCE_MAP).includes(value)
		},
		ajax: Function,
		apis: {
			type: Object,
			default: () => ({})
		},
		max: {
			type: Number,
			default: 0
		},
		// 可选的最大视频或音频时长，0表示不限制，单位：s
		maxDuration: {
			type: Number,
			default: 0
		},
		uploadOpts: {
			type: Object,
			default: () => ({
				multiple: true,
				max: 10,
				size: 0,
			})
		},
		disabledList: {
			type: Array,
			default: () => ([])
		},
		valueKey: {
			type: Object,
			default: () => DEFAULT_FIELD_MAP
		}
	},
	data() {
		const store = new GalleryStore(this, {
			max: this.max
		});

		let fileUploadOpts;
		switch (this.accept) {
			case 'video':
				fileUploadOpts = {
					size: 50,
					...this.uploadOpts,
					accept: this.uploadOpts.accept || 'video/mp4',
				};
				break;

			case 'audio':
				fileUploadOpts = {
					size: 20,
					...this.uploadOpts,
					accept: this.uploadOpts.accept || 'audio/mp3,audio/aac',
				};
				break;

			default:
				fileUploadOpts = {
					size: 3,
					...this.uploadOpts,
					accept: this.uploadOpts.accept || 'image/jpg,image/png,image/gif,image/bmp',
				};
		}

		return {
			isVisible: false,
			keyword: '',
			store,
			current: {},
			baseData: this.$options.propsData.data,

			pageOpts: {
				showTotal: true,
				showSizer: true,
				showElevator: true,
				placement: 'top',
				pageSizeOpts: [30, 40, 50, 100]
			},
			fileUploadOpts,
			validMimeTypes: getMimesByMimeStr(fileUploadOpts.accept, this.accept)
		};
	},
	computed: {
		// 资源类型名称
		sourceName() {
			return SOURCE_MAP[this.accept].name;
		},
		http() {
			return this.ajax || ajax;
		},
		listInfo() {
			return this.store.state.listInfo;
		},
		categories() {
			return this.store.state.categories;
		},
		currentMenuId() {
			return this.store.state.curCategory[this.valueKey.catId];
		},
		selectedFiles() {
			return this.store.state.selectedFiles;
		},
		selectedFileIds() {
			const { fileId } = this.valueKey;
			return this.selectedFiles.map(item => item[fileId]);
		}
	},
	created() {
		this.store.commit('GALLERY_CATEGORIES_SET', { data: this.baseData });
		this.store.commit('GALLERY_CURRENT_CATEGORY_SET', { id: this.baseData[0][this.valueKey.catId] });
	},
	mounted() {
		this.isVisible = true;
	},
	methods: {
		loadCategories() {
			const { catType, fileName } = this.valueKey;
			this.http({
				url: this.apis['URL_GALLERY_CATEGORY_LIST'],
				type: 'GET',
				param: {
					[catType]: SOURCE_MAP[this.accept].fileType,
					[fileName]: this.keyword
				}
			}).then(({ data }) => {
				this.store.commit('GALLERY_CATEGORIES_SET', { data });
			}).catch((err) => {
				console.log(err, 'error');
			});
		},
		handleCancel() {
			this.isVisible = false;
			this.$emit('close');
		},
		loadData(page, pageSize) {
			const { catId, fileName } = this.valueKey;
			return this.http({
				url: this.apis['URL_GALLERY_FILE_LIST'],
				type: 'GET',
				param: {
					page,
					pageSize,
					[catId]: this.currentMenuId,
					[fileName]: this.keyword
				}
			}).then(({ data }) => {
				data.list.forEach(it => {
					// 禁用原因
					it.disabledReasons = this.getDisabledReason(it);
					// 是否禁用
					it.disabled = !!it.disabledReasons.length;
				});
				this.store.commit('GALLERY_FILE_LIST_GET_SUCCESS', {
					data,
					param: {
						catId: this.currentMenuId,
						page
					}
				});
			}).catch((err) => {
				console.log(err, 'error');
			});
		},
		handleSearch() {
			this.loadCategories();
			this.store.commit('GALLERY_FILE_LIST_INIT');
		},
		handleChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleChangePageSize() {
			this.handleSearch();
		},
		handleMenuChange(id) {
			this.store.commit('GALLERY_CURRENT_CATEGORY_SET', { id });
		},
		handleAddSuccess() {
			this.loadCategories();
		},
		handleDelSuccess(catId) {
			this.store.commit('GALLERY_CATEGORIES_SET', { 
				data: this.categories.filter(it => it[this.valueKey.catId] !== catId) 
			});
			// 如果删除的是当前激活的分类，则回到第一个分类
			if (catId === this.currentMenuId) {
				this.store.commit('GALLERY_CURRENT_CATEGORY_SET', { id: this.categories[0][this.valueKey.catId] });
			}
		},

		handleFileToggle(it) {
			const { fileId } = this.valueKey;

			const temp = [...this.selectedFiles];

			const index = temp.findIndex(item => item[fileId] === it[fileId]);

			if (index === -1) {
				if (!this.max || temp.length < this.max) {
					temp.push(it);
				} else if (this.max === 1) {
					temp.splice(0, 1, it);
				} else {
					Message.info({
						content: `最多选择${this.max}个，请取消后再进行选择`
					});
					return;
				}
			} else {
				temp.splice(index, 1);
			}

			this.store.commit('GALLERY_SELECTED_FILES_SET', { target: temp });
		},

		handleConfirm() {
			const { fileUrl } = this.valueKey;
			this.isVisible = false;
			const list = this.selectedFiles.map(it => it[fileUrl]);
			this.$emit('sure', { list });
		},
		/**
		 * 获取文件禁用原因
		 * 1、格式不匹配
		 * 2、文件大小不匹配
		 * 3、时长不匹配（针对媒体文件）
		*/
		getDisabledReason(file) {
			const { fileUrl, fileSize } = this.valueKey;
			const { size } = this.fileUploadOpts;
			const reasons = [];
			// 文件格式判断
			!isValidMime(file[fileUrl], this.validMimeTypes) && reasons.push('格式不匹配');
			// 文件大小判断
			size > 0 && file[fileSize] > size * 1024 * 1024 && reasons.push(`大小超过${size}M`);
			// 媒体文件时长判断
			this.accept !== 'image' 
				&& this.maxDuration > 0 
				&& file.duration > this.maxDuration 
				&& reasons.push(`时长超过${this.maxDuration}s`);
			return reasons;
		}
	}
};

</script>

<style lang="scss">
@import "../style/index.scss";

$block: vca-gallery;
$c-border: #e8e8e8;

@include block($block) {
	.vc-modal__container {
		padding-bottom: 0;
	}
	.vc-modal__content {
		padding: 0 0 63px 0;
		flex: 1;
		display: flex;
	}
	font-size: 14px;

	@include element(content) {
		flex: 1;
		display: flex;
	}

	@include element(category) {
		@include modifier(wrapper) {
			flex-shrink: 0;
			width: 229px;
			border-right: 1px solid $c-border;
		}
	}

	@include element(view-toolbar) {
		padding: 0 24px;
		height: 46px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e8e8e8;
		.vc-input {
			.vc-btn {
				border-radius: 0 4px 4px 0;
			}
		}
	}
	@include element(view-imgs) {
		position: relative;
		overflow: hidden;
		padding: 0 24px;
		flex: 1;
		display: flex;
	}

	@include element(view) {
		display: flex;
		flex-direction: column;
		height: 100%;
		@include modifier(wrapper) {
			padding: 0;
			flex: 1;
		}

		.vc-paging {
			overflow-y: auto;
			margin-top: 10px;
			padding-bottom: 58px;
			width: 100%;
			background: #fff;
			.vc-paging__footer {
				position: absolute;
				bottom: 0;
				padding-bottom: 10px;
				flex-direction: row-reverse;
				background: #fff;
			}
		}
	}
	@include element(empty) {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.vca-gallery-file-item {
		margin: 5px;
		background: #fff;
	}

	.vc-modal__container {
		height: 674px !important;
	}

}

</style>
