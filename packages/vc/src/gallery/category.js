import Modal from '@wya/vc/lib/modal';
import { Editor } from './popup/editor';

export default {
	methods: {
		handleAdd() {
			const { catName } = this.valueKey;
			Editor.popup({
				title: '新增分组',
				originalText: '分组',
				placeholder: '请输入分组名称',
				maxlength: 10
			}).then(({ inputValue }) => {
				this.http({
					url: this.APIS['URL_GALLERY_CATEGORY_ADD'],
					type: 'POST',
					param: {
						[catName]: inputValue
					}
				}).then(({ data }) => {
					this.store.commit('GALLERY_CURRENT_CATEGORY_SET', { target: data });
					this.$emit('add-success');
				}).catch((err) => {
					console.log(err, 'error');
				});
			}).catch(() => {});
		},
		handleRename(it) {
			const { catName, catId } = this.valueKey;
			Editor.popup({
				title: '重命名分组',
				originalText: it[catName],
				placeholder: '新建分组',
				maxlength: 10
			})
				.then(({ inputValue }) => {
					this.http({
						url: this.APIS['URL_GALLERY_CATEGORY_RENAME'],
						type: 'POST',
						param: {
							[catId]: it[catId],
							[catName]: inputValue
						}
					}).then(() => {
						it[catName] = inputValue;
					}).catch(err => {
						console.log(err, 'error');
					});
				})
				.catch(() => {});
		},
		handleDelCategory(catId) {
			Modal.warning({
				title: '您确定要删除该分组吗？',
				onOk: (e, cb) => {
					return this.http({
						url: this.APIS['URL_GALLERY_CATEGORY_DEL'],
						type: 'POST',
						param: {
							[this.valueKey.catId]: catId
						}
					}).then(() => {
						this.$emit('del-success', catId);
						cb();
					}).catch((err) => {
						cb();
					});
						
				}
			});
		}
	}
};