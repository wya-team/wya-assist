<template>
	<vc-popconfirm
		v-if="info.message"
		:title="info.message"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<span class="vca-table-operate-item__text">
			{{ info.label }}
		</span>
	</vc-popconfirm>
	<span
		v-else
		class="vca-table-operate-item__text is-inline"
		@click="handleOk"
		v-text="info.label"
	/>
</template>

<script>
import Popconfirm from '@wya/vc/lib/popconfirm';

export default {
	name: 'vca-table-operate-item',
	components: {
		'vc-popconfirm': Popconfirm
	},
	props: {
		info: {
			type: Object,
			default: () => ({})
		}
	},
	methods: {
		handleCancel() {
			this.$emit('cancel');
		},
		handleOk() {
			this.$emit('ok');
		}
	},
};
</script>

<style lang="scss">
.vca-table-operate-item__text {
	color: #5495f6;
	cursor: pointer;
	&.is-inline {
		display: inline-block;
		text-align: right;
	}
}
</style>
