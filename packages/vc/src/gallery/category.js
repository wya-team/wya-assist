import Modal from '@wya/vc/lib/modal';
import { Editor } from './popup';

export default {
	methods: {
		handleAdd() {
			const { catName, catType } = this.valueKey;
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
						[catType]: this.accept === 'video' ? 2 : 1,
						[catName]: inputValue
					}
				}).then(() => {
					this.$emit('add-success');
				}).catch((err) => {
					console.log(err, 'error');
				});
			});
		},
		handleRename(it) {
			const { catName, catId, catType } = this.valueKey;
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
							[catType]: this.accept === 'video' ? 2 : 1,
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
		handleDelCategory(item) {
			const { catName, catId } = this.valueKey;
			const id = item[catId];
			Modal.warning({
				title: `您确定要删除分组"${item[catName]}"吗？`,
				onOk: (e, cb) => {
					return this.http({
						url: this.APIS['URL_GALLERY_CATEGORY_DELETE'],
						type: 'POST',
						param: {
							[catId]: id
						}
					}).then(() => {
						this.$emit('del-success', id);
						cb();
					}).catch((err) => {
						cb();
					});
						
				}
			});
		}
	}
};