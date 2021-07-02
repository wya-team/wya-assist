<template>
	<div class="vca-gallery-category-menu">
		<div class="vca-gallery-category-menu__tools">
			<vc-button type="primary" @click="handleUpload">
				上传{{ sourceName }}
			</vc-button>
			<vc-button type="default" @click="handleAdd">
				添加分组
			</vc-button>
		</div>
		<div class="vca-gallery-category-menu__list">
			<vc-transition-slide group>
				<div 
					v-for="item in dataSource"
					:key="item[valueKey.catId]"
					:class="{ 'is-active': value === item[valueKey.catId] }"
					class="vca-gallery-category-menu__item"
					@click="handleCategoryItem(item)"
				>
					<span class="vca-gallery-category-menu__item-name">
						{{ item[valueKey.catName] }}（{{ item[valueKey.count] }}）
					</span>
					<span 
						v-if="!item[valueKey.isDefault]"
						class="vca-gallery-category-menu__icon-wrapper"
					>
						<vc-icon 
							type="edit" 
							class="vca-gallery-category-menu__item-icon"
							@click.stop="handleRename(item)"
						/>
						<span class="vca-gallery-category-menu__item-icon-devider">|</span>
						<vc-icon 
							type="empty" 
							class="vca-gallery-category-menu__item-icon"
							@click.stop="handleDelCategory(item)"
						/>
					</span>
				</div>
			</vc-transition-slide>
		</div>
	</div>
</template>

<script>
import Icon from '@wya/vc/lib/icon';
import Button from '@wya/vc/lib/button';
import Transition from '@wya/vc/lib/transition';
import categoryMixin from './category';
import { Uploader } from './popup';
import { SOURCE_MAP } from './constants.js';

export default {
	name: 'vca-gallery-category-menu',
	inject: ['APIS', 'http', 'store', 'valueKey', 'accept', 'sourceName'],
	components: {
		'vc-transition-slide': Transition.Slide,
		'vc-icon': Icon,
		'vc-button': Button,
	},
	mixins: [categoryMixin],
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		dataSource: {
			type: Array,
			default: () => ([])
		},
		value: {
			type: Number,
			default: 0
		},
		uploadOpts: {
			type: Object,
			default: () => ({})
		},
	},
	methods: {
		handleUpload() {
			Uploader.popup({
				accept: this.accept,
				uploadOpts: this.uploadOpts,
				categories: this.dataSource,
				valueKey: this.valueKey,
				apis: this.APIS,
				http: this.http
			}).then(({ catId }) => {
				this.$emit('change', catId);
			});
		},
		handleCategoryItem(item) {
			const { catId } = this.valueKey;
			if (item[catId] === this.value) return;
			this.$emit('change', item[catId]);
		}
	}
};
</script>

<style lang="scss">
@import "../style/index.scss";

$block: vca-gallery-category-menu;
$c-border: #e9e9e9;

@include block($block) {
	display: flex;
	flex-direction: column;
	height: 100%;
	font-size: 12px;

	// TODO: 使用share模块
	.category-item {
		padding-left: 20px;
		padding-right: 20px;
		height: 46px;
		line-height: 46px;
		transition: background-color .1s;
		cursor: pointer;
		@include pseudo(hover) {
			background-color: #f4f4f4;
			@include element(icon-wrapper) {
				display: block;
				color: #666;
				text-align: right;
			}
		}

	}

	@include element(tools) {
		display: flex;
		padding: 12px;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1px solid #d9d9d9;
	}
	@include element(list) {
		flex: 1;
		overflow-y: auto;
	}
	@include element(item) {
		display: flex;
		justify-content: space-between;
		
		background-color: #fff;
		@extend .category-item;

		@include when(active) {
			background-color: #f4f4f4;
		}
	}
	@include element(item-name) {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding-right: 8px;
		color: #000;
	}
	@include element(icon-wrapper) {
		display: none;
		color: #666;
		text-align: right;
		flex-shrink: 0;
	}
	@include element(item-icon) {
		@include pseudo(hover) {
			color: #5495f6;
		}
	}
	@include element(item-icon-devider) {
		margin: 0 5px;
		color: #dbdbdb;
	}
}

</style>
