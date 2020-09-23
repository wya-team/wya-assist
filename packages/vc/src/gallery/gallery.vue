<template>
	<vc-modal
		v-model="isVisible"
		:mask-closable="false"
		size="large"
		title="选择图片"
		class="vca-gallery vm-hack-editor"
		@cancel="handleCancel"
	>
		<div class="vca-gallery__content">
			<div class="vca-gallery__category--wrapper">
				<vca-gallery-category-menu
					:data-source="categoryList"
					:current="curCategory"
					@add-success="handleAddSuccess"
					@del-success="handleDelSuccess"
				/>
			</div>

			<div class="vca-gallery__view--wrapper">
				<div class="vca-gallery__view">
					<div class="vca-gallery__view-toolbar">
						<div>
							<template>
								<vc-upload
									v-bind="uploadOpts"
									accept="image/*"
									@error="handleError"
									@begin="handleBegin"
									@complete="handleComplete"
									@file-error="handleFileError"
									@file-success="handleFileSuccess"
								>
									<vc-button type="primary">
										<vc-icon type="upload" />
										本地上传
									</vc-button>
								</vc-upload>
							</template>
						</div>
						<div>
							<vc-input
								v-model="keyword"
								clearable
								placeholder="搜索图片"
								style="width: 240px;"
								@change="handleChange"
								@enter="handleSearch"
							>
								<template #append>
									<vc-button type="primary" @click="handleSearch">
										<vc-icon type="search" />
									</vc-button>
								</template>
							</vc-input>
						</div>
					</div>
					<div class="vca-gallery__view-imgs">
						<vc-paging
							v-if="categoryList.length >= 1"
							ref="tableTarget"
							:data-source="listInfo[curCategory[valueKey.catId]].data"
							:count="listInfo[curCategory[valueKey.catId]].count"
							:total="listInfo[curCategory[valueKey.catId]].total"
							:reset="listInfo[curCategory[valueKey.catId]].reset"
							:current.sync="current[curCategory[valueKey.catId]]"
							:history="false"
							:load-data="loadData"
							:page-opts="pageOpts"
							mode="piece"
							@page-size-change="handleChangePageSize"
						>
							<template #default="{ it }">
								<vca-gallery-img-item
									:it="it"
									:checked="selectedFileIds.includes(it[valueKey.fileId])"
									:disabled="disabledList.includes(it[valueKey.fileUrl])"
									class="vca-gallery__img-item"
									@toggle="handleFileToggle(it)"
								/>
							</template>
						</vc-paging>
						<!-- <vca-gallery-no-category v-else @add-success="handleAddSuccess"/> -->
					</div>
				</div>
			</div>
		</div>

		<template #footer>
			<vca-gallery-footer
				:whole="isWhole"
				:max="max"
				@cancel="handleCancel"
				@ok="handleConfirm"
				@refresh-category="loadCategory"
			/>
		</template>
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';
import Input from '@wya/vc/lib/input';
import Icon from '@wya/vc/lib/icon';
import Button from '@wya/vc/lib/button';
import Paging from '@wya/vc/lib/paging';
import Message from '@wya/vc/lib/message';
import Upload from '@wya/vc/lib/upload';

import { ajax } from '@wya/http';
import GalleryStore from './store';
import CategoryMenu from './category-menu.vue';
import ImgItem from './img-item.vue';
import uploadMixin from './upload';
import Footer from './footer.vue';
import NoCategory from './no-category.vue';

export default {
	name: 'vca-gallery',
	components: {
		'vc-modal': Modal,
		'vc-paging': Paging,
		'vc-input': Input,
		'vc-button': Button,
		'vc-icon': Icon,
		'vc-upload': Upload,
		'vca-gallery-category-menu': CategoryMenu,
		'vca-gallery-img-item': ImgItem,
		'vca-gallery-footer': Footer,
		// 'vca-gallery-no-category': NoCategory
	},
	mixins: [uploadMixin],
	provide() {
		return {
			APIS: this.apis,
			store: this.store,
			http: this.http,
			valueKey: this.valueKey
		};
	},
	props: {
		ajax: Function,
		apis: {
			type: Object,
			default: () => ({})
		},
		max: {
			type: Number,
			default: 0
		},
		uploadOpts: {
			type: Object,
			default: () => ({
				multiple: true,
				max: 10,
				size: 0
			})
		},
		disabledList: {
			type: Array,
			default: () => ([])
		},
		valueKey: {
			type: Object,
			default: () => ({
				catId: 'cat_id',
				catName: 'cat_name',
				// 与 filename, fileid 做区分
				fileName: 'file_name',
				fileId: 'file_id',
				fileUrl: 'file_url',
				isAll: 'is_all',
				count: 'count',
			})
		}
	},
	data() {
		const store = new GalleryStore(this, {
			max: this.max
		});

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
			}
		};
	},
	computed: {
		http() {
			return this.ajax || ajax;
		},
		listInfo() {
			return this.store.state.listInfo;
		},
		isWhole() {
			return !!this.curCategory.is_all;
		},
		categoryList() {
			return this.store.state.categoryList;
		},
		curCategory() {
			return this.store.state.curCategory;
		},
		selectedFiles() {
			return this.store.state.selectedFiles;
		},
		selectedFileIds() {
			const { fileId } = this.valueKey;
			return this.selectedFiles.map(item => item.fileId);
		}
	},
	created() {
		this.store.commit('GALLERY_CATEGORY_LIST_GET_SUCCESS', { data: this.baseData.paths });
		this.store.commit('GALLERY_CURRENT_CATEGORY_SET', { target: this.baseData.paths[0] });
	},
	mounted() {
		this.isVisible = true;
		console.log(this.isVisible);
	},
	methods: {
		loadCategory() {
			const { fileName } = this.valueKey;
			this.http({
				url: this.apis['URL_GALLERY_CATEGORY_LIST'],
				type: 'GET',
				param: {
					[fileName]: this.keyword
				}
			}).then(({ data }) => {
				this.store.commit('GALLERY_CATEGORY_LIST_GET_SUCCESS', { data: data.paths });
			}).catch((err) => {
				console.log(err, 'error');
			});
		},
		handleCancel() {
			console.log(2);
			this.isVisible = false;
			this.$emit('close');
		},
		loadData(page, pageSize) {
			const { catId, fileName } = this.valueKey;
			return this.http({
				url: this.apis['URL_GALLERY_IMG_LIST'],
				type: 'GET',
				param: {
					page,
					pageSize,
					[catId]: this.curCategory[catId],
					[fileName]: this.keyword
				}
			}).then(({ data }) => {
				this.store.commit('GALLERY_IMG_LIST_GET_SUCCESS', {
					data,
					param: {
						catId: this.curCategory[catId],
						page: data.currentPage
					}
				});
			}).catch((err) => {
				console.log(err, 'error');
			});
		},
		handleSearch() {
			this.loadCategory();
			this.store.commit('GALLERY_IMG_LIST_INIT');
		},
		handleChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleChangePageSize() {
			this.handleSearch();
		},
		handleAddSuccess() {
			this.loadCategory();
		},
		handleDelSuccess(catId) {
			const index = this.categoryList
				.findIndex(item => item[this.valueKey.catId] === catId);
			this.categoryList.splice(index, 1);
			this.store.commit('GALLERY_CURRENT_CATEGORY_SET', { target: this.categoryList[0] });
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

	.vca-gallery-img-item {
		margin: 5px;
		background: #fff;
	}

	.vc-modal__container {
		height: 674px !important;
	}

}

</style>
