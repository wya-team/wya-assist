<template>
	<div>
		<vc-button @click="handleGallery('image')">
			图片 gallery
		</vc-button>
		<vc-button @click="handleGallery('video')">
			视频 gallery
		</vc-button>
		<vc-button @click="handleGallery('audio')">
			音频 gallery
		</vc-button>
		<vc-upload-picker />
		<!-- <vc-upload @file-success="handleSuccess" @file-error="handleSuccess">
			<vc-button>upload</vc-button>
		</vc-upload> -->
	</div>
</template>

<script>
import Vc from '@wya/vc/lib/vc';
import UploadPicker from '@wya/vc/lib/upload-picker';
import createHttpClient from '@wya/http';

import Gallery from '..';

const { ajax } = createHttpClient({
	onBefore({ options }) {
		return {
			...options,
			headers: {
				'admin-token': '352b75f4b9d9254d25422c373b15ae75',
				token: 'd16440b18b41c797e214d5d3b0fa24061c050690'
			}
		};
	}
});
const OSS = 'https://wyatest.oss-cn-hangzhou.aliyuncs.com';
const BASE = 'https://chyy.wyawds.com';

const galleryOptions = {
	ajax,
	max: 9,
	uploadOpts: {
		max: 30,
		multiple: true
	},
	maxDuration: 10,
	// output: 'original',
	disabledList: [],
	apis: {
		URL_GALLERY_CATEGORY_LIST: `${BASE}/product/upload/cat-list.json`,
		URL_GALLERY_CATEGORY_RENAME: `${BASE}/product/upload/save-cat.json`,
		URL_GALLERY_CATEGORY_ADD: `${BASE}/product/upload/save-cat.json`,
		URL_GALLERY_CATEGORY_DELETE: `${BASE}/product/upload/delete-cat.json`,
		URL_GALLERY_FILE_LIST: `${BASE}/product/upload/file-list.json`,
		URL_GALLERY_FILE_UPLOAD: `${BASE}/product/upload/add-file.json`,
		URL_GALLERY_FILE_RENAME: `${BASE}/product/upload/rename-file.json`,
		URL_GALLERY_FILE_MOVE: `${BASE}/product/upload/remove-file.json`,
		URL_GALLERY_FILE_DELETE: `${BASE}/product/upload/delete-file.json`,
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

const parseFile = (file) => {
	return {
		type: `.${file.name.split('.').pop()}`,
		uid: file.uid,
		title: file.name,
		size: file.size
	};
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
					url: `${BASE}/base/upload/get-oss-sign.json`,
					type: "GET",
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

			if (process.env.NODE_ENV === 'development') {
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
		handleGallery(accept) {
			Gallery.popup({
				...galleryOptions,
				accept
			}).then((res) => {
				console.log(res, '---');
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
