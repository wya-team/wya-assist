<template>
	<vc-modal
		v-model="visible"
		title="修改分组"
		size="small"
		@cancel="handleCancel"
		@ok="handleOk"
	>
		<vc-radio-group v-model="targetCategoryId" vertical>
			<vc-radio 
				v-for="item in filteredCategories"
				:key="item[valueKey.catId]"
				:label="item[valueKey.catId]"
			>
				{{ item[valueKey.catName] }}
			</vc-radio>
		</vc-radio-group>
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Modal from '@wya/vc/lib/modal';
import Radio from '@wya/vc/lib/radio';

const wrapperComponent = {
	name: 'vca-gallery-move-img',
	components: {
		'vc-modal': Modal,
		'vc-radio': Radio,
		'vc-radio-group': Radio.Group
	},
	props: {
		store: {
			type: Object,
			default: () => ({})
		},
		api: {
			type: String,
			default: ''
		},
		http: Function,
		valueKey: Object
	},
	data() {
		const { catId } = this.valueKey;
		return {
			visible: false,
			targetCategoryId: this.store.state.curCategory[catId]
		};
	},
	computed: {
		filteredCategories() {
			const { isAll } = this.valueKey;
			const categoryList = this.store.state.categoryList;
			return categoryList.filter(item => !item[isAll]);
		},
		selectedFileIds() {
			const { fileId } = this.valueKey;
			const selectedFiles = this.store.state.selectedFiles;
			return selectedFiles.map(item => item[fileId]);
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleCancel() {
			this.$emit('close');
		},
		handleOk(e, cb) {
			const { catId, fileId } = this.valueKey;
			return this.http({
				url: this.api,
				type: 'POST',
				param: {
					[catId]: this.targetCategoryId,
					[`${fileId}s`]: this.selectedFileIds.join()
				}
			}).then(() => {
				this.$emit('sure');
				cb();
			}).catch((err) => {
				cb();
				console.log(err, 'error');
			});
		}
	}
};

export default wrapperComponent;
export const MoveImg = new Portal(wrapperComponent, {});

</script>

<style lang="scss">

</style>
