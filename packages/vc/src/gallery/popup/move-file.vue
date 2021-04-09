<template>
	<vc-modal
		v-model="visible"
		title="调整分组"
		size="small"
		@ok="handleOk"
	>
		移动至：
		<vc-select v-model="targetId" style="width: 360px">
			<vc-option
				v-for="item in categories"
				:key="item[valueKey.catId]"
				:value="item[valueKey.catId]"
			>
				{{ item[valueKey.catName] }}
			</vc-option>
		</vc-select>
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';
import Select from '@wya/vc/lib/select';

export default {
	name: 'vca-gallery-move-file',
	components: {
		'vc-modal': Modal,
		'vc-select': Select
	},
	props: {
		// 当前所在分组
		value: Number,
		api: {
			type: String,
			default: ''
		},
		http: Function,
		valueKey: Object,
		// 可选的分组
		categories: Array,
		// 选中的文件id数组
		fileIds: Array
	},
	data() {
		return {
			visible: false,
			targetId: this.value
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(e, cb) {
			const { catId, fileId } = this.valueKey;
			if (this.targetId === this.value) {
				cb();
				return;
			}
			return this.http({
				url: this.api,
				type: 'POST',
				param: {
					[catId]: this.targetId,
					[fileId]: this.fileIds.join()
				}
			}).then(() => {
				this.$emit('sure');
				cb();
			}).catch((err) => {
				console.log(err, 'error');
			});
		}
	}
};
</script>

<style lang="scss">

</style>
