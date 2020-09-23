<template>
	<div class="vca-gallery-no-category">
		<vc-button type="primary" @click="handleAdd">
			+新增分组
		</vc-button>
		<div class="vca-gallery-no-category__text">
			请先新增分组，再进行本地上传
		</div>
	</div>
</template>

<script>
import Button from '@wya/vc/lib/button';
import categoryMixin from './category';

export default {
	name: 'vca-gallery-no-category',
	inject: ['APIS', 'store', 'http'],
	components: {
		'vc-button': Button
	},
	mixins: [categoryMixin]
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/index.scss";

$block: vca-gallery-no-category;

@include block($block) {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	@include element(text) {
		margin-top: 14px;
		font-size: 12px;
		color: #999;
	}
}

</style>
