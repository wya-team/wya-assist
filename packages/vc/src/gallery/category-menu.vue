<template>
	<div class="vca-gallery-category-menu">
		<div class="vca-gallery-category-menu__list">
			<vc-transition-slide group>
				<div 
					v-for="item in dataSource"
					:key="item[valueKey.catId]"
					:class="{ 'is-active': current[valueKey.catId] === item[valueKey.catId] }"
					class="vca-gallery-category-menu__item"
					@click="handleCategoryItem(item)"
				>
					<span class="vca-gallery-category-menu__item-name">{{ item[valueKey.catName] }}（{{ item[valueKey.count] }}）</span>
					<span v-if="!item.is_all" class="vca-gallery-category-menu__icon-wrapper">
						<vc-icon 
							type="edit" 
							class="vca-gallery-category-menu__item-icon"
							@click.stop="handleRename(item)"
						/>
						<span class="vca-gallery-category-menu__item-icon-devider">|</span>
						<vc-icon 
							type="empty" 
							class="vca-gallery-category-menu__item-icon"
							@click.stop="handleDelCategory(item[valueKey.catId])"
						/>
					</span>
				</div>
			</vc-transition-slide>
			<div class="vca-gallery-category-menu__add" @click="handleAdd">+新增分组</div>
		</div>
	</div>
</template>

<script>
import Icon from '@wya/vc/lib/icon';
import Transition from '@wya/vc/lib/transition';
import categoryMixin from './category';

export default {
	name: 'vca-gallery-category-menu',
	inject: ['APIS', 'store', 'http', 'valueKey'],
	components: {
		'vc-transition-slide': Transition.Slide,
		'vc-icon': Icon
	},
	mixins: [categoryMixin],
	props: {
		dataSource: {
			type: Array,
			default: () => ([])
		},
		current: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		curCategory() {
			return this.store.state.curCategory;
		},
	},
	methods: {
		handleCategoryItem(item) {
			const { catId } = this.valueKey;
			if (item[catId] === this.curCategory[catId]) return;
			this.store.commit('GALLERY_CURRENT_CATEGORY_SET', { target: item });
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

	@include element(add) {
		color: #5495f6;
		background-color: #fff;
		@extend .category-item;
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
