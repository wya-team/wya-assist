<template>
	<div 
		:style="style"
		class="vca-section-title"
	>	
		<p v-if="typeof content === 'string'" class="vca-section-title__text" v-html="content" /> <!-- eslint-disable-line -->
		<vc-customer 
			v-else-if="typeof content === 'function'" 
			:render="content" 
		/>
		<slot v-if="$slots.default" />
	</div>
</template>
<script>
export default {
	name: 'vca-section-title',
	components: {

	},
	props: {
		// TODO: vc-customer
		content: {
			type: [String, Number],
			default: ''
		},
		// 是否需要背景色
		background: {
			type: String,
			default: '#f9f9f9'
		}
	},
	computed: {
		style() {
			return {
				background: this.background
			};
		}
	}
};
</script>
<style lang="scss">
.vca-section-title {
	color: #000;
	font-size: 14px;
	padding: 0 24px;
	line-height: 50px;
	font-weight: bold;
	display: flex;
	&::before {
		content: '';
		width: 2px;
		height: 14px;
		background-color: #e6686b;
		margin: 18px 7px 0 0;
		display: inline-block;
	}
	&__text {
		display: flex;
	}
}
</style>


