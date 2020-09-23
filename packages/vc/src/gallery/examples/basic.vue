<template>
	<div>
		<vc-button @click="handleClick">
			gallery
		</vc-button>
		<vc-upload-picker />
		<vc-upload @file-success="handleSuccess" @file-error="handleSuccess">
			<vc-button>upload</vc-button>
		</vc-upload>
	</div>
</template>

<script>
import Vc from '@wya/vc/lib/vc';
import UploadPicker from '@wya/vc/lib/upload-picker';
import createHttpClient, { ajax } from '@wya/http';

import Gallery from '..';

const OSS = 'https://wyatest.oss-cn-hangzhou.aliyuncs.com';
const BASE = 'https://is-manage.wyawds.com';

const galleryOptions = {
	ajax: createHttpClient({
		onBefore({ options }) {
			return {
				...options,
				headers: {
					token: '539995a80a612e02852c2b1cb6ac5d6bde7d7cfc'
				}
			};
		}
	}).ajax,
	max: 9,
	uploadOpts: {
		max: 30,
		multiple: true
	},
	disabledList: [],
	apis: {
		URL_GALLERY_CATEGORY_LIST: `${BASE}/base/photo-gallery/get-all-category.json`,
		URL_GALLERY_CATEGORY_RENAME: `${BASE}/base/photo-gallery/rename-category.json`,
		URL_GALLERY_CATEGORY_ADD: `${BASE}/base/photo-gallery/add-category.json`,
		URL_GALLERY_CATEGORY_DEL: `${BASE}/base/photo-gallery/delete-category.json`,
		URL_GALLERY_IMG_LIST: `${BASE}/base/photo-gallery/get-img-list.json`,
		URL_GALLERY_IMG_UPLOAD: `${BASE}/base/photo-gallery/upload-img.json`,
		URL_GALLERY_IMG_RENAME: `${BASE}/base/photo-gallery/rename-img.json`,
		URL_GALLERY_IMG_MOVE: `${BASE}/base/photo-gallery/move-img.json`,
		URL_GALLERY_IMG_DEL: `${BASE}/base/photo-gallery/delete-images.json`,
	}
};

const vaildFile = (file) => {
	if (!file) {
		return '文件丢失';
	}

	if (/[@#￥%&+ ']/.test(file.name)) {
		return `文件名称不合法, 不能包含@#￥%&+ '和空格`;
	}

	if (/image/.test(file.type) && file.size > 20971520) {
		return '图片大小不能超过20M';
	}
};

Vc.instance.init({
	UploadPicker: {
		gallery(ctx, type) {
			if (type !== 'image') return;
			return Gallery.popup(galleryOptions)
				.then(({ list }) => {
					ctx.add(list, 'image');
				}).catch((res) => {
					console.log(res);
				});
		}
	},
	Upload: {
		URL_UPLOAD_IMG_POST: OSS,
		URL_UPLOAD_FILE_POST: OSS,
		onPostBefore: ({ options }) => {
		// 约定的字段为file
			let { file, ...rest } = options.param;

			let msg = vaildFile(file);

			if (msg) {
				throw new Error(msg);
			}

			return new Promise((resolve, reject) => {
				ajax({
					url: `${BASE}/base/upload/get-sign.json`,
					type: "POST",
					param: {},
					successTip: false,
				}).then(res => {
					resolve({
						...options,
						param: {
							...rest,
							bucket: res.data.bucket,
							policy: res.data.policy,
							OSSAccessKeyId: res.data.OSSAccessKeyId,
							signature: res.data.signature,
							success_action_status: 200,
							key: `${res.data.key}${file.name}`,
							file // 要求在最后一个字段
						}
					});
				}).catch(error => {
					console.error('onPostBefore: vc.config', error);
					return Promise.reject(error);
				});
			});
		},

		onPostAfter: ({ response, options }) => {
			// 约定的字段为file
			let { file } = options.param;

			if (env === 'development') {
				return {
					status: 1,
					data: {
						url: `https://wya-oa.oss-cn-hangzhou.aliyuncs.com/common/file-download.png?v=${new Date().getTime()}`,
						...parseFile(file)
					}
				};
			}

			// 如果已经存在
			if (response.status === 1) {
				return response;
			}

			// response.httpStatus === 200 && options.url.includes('oss-cn-hangzhou')用来判断是不是阿里云
			return response.httpStatus === 200 && options.url.includes(OSS_FILE_SUBMIT_URL)
				? {
					status: 1,
					data: {
						url: `${OSS}/${options.param.key}`,
						...parseFile(file)
					}
				}
				: {
					status: 0,
					msg: `${response.msg || `上传失败 ${response.httpStatus || ''}`}`
				};
		}
	}
});
export default {
	name: 'vca-basic',
	components: {
		'vc-upload-picker': UploadPicker
	},
	methods: {
		handleClick() {
			Gallery.popup(galleryOptions).then((res) => {

			}).catch((res) => {
				console.log(res);
			});
		},
		handleSuccess(e) {
			console.log(e);
		}
	},
};
</script>

<style lang="scss">
</style>
