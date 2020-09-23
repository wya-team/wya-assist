import Message from '@wya/vc/lib/message';
// import { ajax } from '@wya/http';

export default {
	data() {
		return {
			success: 0,
			error: 0,
			total: 0,
			complete: 0
		};
	},
	methods: {
		handleError(error) {
			Message.destroy();
			Message.error({
				content: error.msg
			});
		},
		/**
		 * 总线
		 */
		handleBegin(files) {
			Message.loading({
				content: '上传中'
			});
		},
		handleComplete(info = {}) {
			console.log(`Error: ${info.error}, Success: ${info.success}, 总数：${info.total}`);
		},
		/**
		 * 单个文件
		 */
		handleFileSuccess(res, file) {
			const { catId, fileUrl, fileName } = this.valueKey;
			this.http({
				url: this.apis['URL_GALLERY_IMG_UPLOAD'],
				type: 'POST',
				param: {
					[catId]: this.isWhole ? "" : this.curCategory[catId],
					[fileUrl]: res.data.url, // 这里存在耦合
					[fileName]: res.data.title
				},
				successTip: false,
				errorTip: false
			}).then(() => {
				this.success++;
				this.store.commit('GALLERY_IMG_LIST_INIT');
				Message.destroy();
				Message.success({
					content: '上传成功'
				});
			}).catch((err) => {
				Message.destroy();
				Message.error({
					content: err.msg
				});
				this.error++;
			}).finally(() => {
				this.complete++;
			});

		},
		handleFileError(res, file) {
			Message.destroy();
			Message.error({
				content: res.msg
			});
			this.complete++;
			this.error++;
		},
	}
};
