<template>
	<vc-modal
		v-model="visible"
		:title="`上传${sourceName}`"
		size="medium"
		class="vca-gallery-uploader"
		@ok="handleOk"
	>
		<vc-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="120"
		>
			<vc-form-item label="选择分组：" :prop="valueKey.catId">
				<vc-select v-model="formData[valueKey.catId]" style="width: 300px">
					<vc-option
						v-for="item in categories"
						:key="item[valueKey.catId]"
						:value="item[valueKey.catId]"
					>
						{{ item[valueKey.catName] }}
					</vc-option>
				</vc-select>
			</vc-form-item>
			<vc-form-item v-if="accept !== 'image'" :label="`${sourceName}名称：`" :prop="valueKey.fileName">
				<vc-input
					v-model="formData[valueKey.fileName]"
					clearable
					:placeholder="`请输入${sourceName}名称`"
					style="width: 300px"
				/>
			</vc-form-item>
			<vc-form-item v-if="accept !== 'image'" label="本地文件：" prop="fileUrls">
				<vc-upload
					v-if="!formData.fileUrls.length"
					:size="uploadOpts.size"
					:max="1"
					show-tips
					:accept="uploadOpts.accept"
					@file-before="handleMediaBefore"
					@begin="handleMediaBegin"
					@file-error="handleMediaError"
					@error="handleMediaError"
					@file-success="handleMediaSuccess"
				>
					<div class="vca-gallery-uploader__upload-box">
						<vc-icon type="plus" style="margin-bottom:8px;font-size:14px;" />
						<span>上传</span>
					</div>
				</vc-upload>
				<div v-else class="vca-gallery-uploader__media" @click="handlePreview">
					<vc-img v-if="accept === 'video'" :src="videoPosterUrl" fit="cover" />
					<div class="vca-gallery-uploader__media-mask">
						<div class="vca-gallery-uploader__play">
							<vc-icon type="toplay" />
						</div>
					</div>
					<div class="vca-gallery-uploader__delete" @click.stop="handleDeleteMedia">
						<vc-icon type="clear" />
					</div>
				</div>
				<div style="color: #999">
					支持 {{ fileMimes }} 格式，{{ sourceName }}文件大小不超过 {{ uploadOpts.size }}Mb
				</div>
			</vc-form-item>
			<vc-form-item v-else label="本地文件：" prop="fileUrls">
				<vc-upload-picker
					v-model="formData.fileUrls"
					:max="10"
					:gallery="false"
					:upload-opts="uploadOpts"
					@success="handleImageSuccess"
				/>
				<div style="color: #999">
					支持 {{ fileMimes }} 格式，最多10张，单张图片大小不超过 {{ uploadOpts.size }}Mb
				</div>
			</vc-form-item>
		</vc-form>
	</vc-modal>
</template>

<script>
import Message from '@wya/vc/lib/message';
import UploadPicker from '@wya/vc/lib/upload-picker';
import Upload from '@wya/vc/lib/upload';
import Img from '@wya/vc/lib/img';
import Icon from '@wya/vc/lib/icon';
import Modal from '@wya/vc/lib/modal';
import Form from '@wya/vc/lib/form';
import Select from '@wya/vc/lib/select';
import Option from '@wya/vc/lib/select/option';
import Input from '@wya/vc/lib/input';
import { VideoPreviewer } from './video-previewer/index';
import { AudioPreviewer } from './audio-previewer/index';
import { SOURCE_MAP } from '../constants.js';
import { getExtsByMimeStr } from '../utils'; 

export default {
	name: 'vca-gallery-uploader',
	components: {
		'vc-modal': Modal,
		'vc-form': Form,
		'vc-form-item': Form.Item,
		'vc-select': Select,
		'vc-option': Option,
		'vc-input': Input,
		'vc-upload-picker': UploadPicker,
		'vc-upload': Upload,
		'vc-img': Img,
		'vc-icon': Icon,
	},
	props: {
		accept: {
			type: String,
			default: 'image',
			validator: value => Object.keys(SOURCE_MAP).includes(value)
		},
		uploadOpts: {
			type: Object,
			default: () => ({})
		},
		valueKey: Object,
		categories: Array,
		http: Function,
		apis: Object
	},
	data() {
		const { catId, fileName } = this.valueKey;
		const mimes = getExtsByMimeStr(this.uploadOpts.accept, this.accept);
		return {
			visible: false,
			
			formData: {
				// 文件url数组
				fileUrls: [],
				// 文件信息数组
				list: []
			},
			rules: {
				[catId]: [{ required: true, message: '请选择分组' }],
				[fileName]: [{ required: true, message: `请填写文件名称` }],
				fileUrls: [{ required: true, type: 'array', message: '请上传本地文件' }]
			},
			fileMimes: mimes.includes('*') ? '所有' : mimes.join('、')
		};
	},
	computed: {
		// 资源类型名称
		sourceName() {
			return SOURCE_MAP[this.accept].name;
		},
		videoPosterUrl() {
			if (this.accept !== 'video' || !this.formData.fileUrls.length) return '';
			// 阿里云视频截帧 -> https://help.aliyun.com/document_detail/64555.html
			return `${this.formData.fileUrls[0]}?x-oss-process=video/snapshot,t_0,f_png,w_0,h_0,m_fast`;
		},
	},
	mounted() {
		this.visible = true;	
	},
	methods: {
		handleMediaBegin(files) {
			Message.loading({ content: '上传中' });
		},
		/**
		 * 获取媒体文件时长
		 */
		handleMediaBefore(mediaFile) {
			const mediaEl = document.createElement(SOURCE_MAP[this.accept].elementTag);
			mediaEl.preload = 'metadata';
			
			return new Promise((resolve, reject) => {
				let timer = null;
				const handler = () => {
					window.URL.revokeObjectURL(mediaEl.src);
					timer && clearTimeout(timer);
					mediaFile.duration = mediaEl.duration;
					resolve(mediaFile);
				};
				timer = setTimeout(() => {
					mediaEl.removeEventListener('loadedmetadata', handler, false);
					reject({ msg: `获取${this.sourceName}时长失败` }); // eslint-disable-line
				}, 5000);

				mediaEl.addEventListener('loadedmetadata', handler, false);
				mediaEl.src = window.URL.createObjectURL(mediaFile);
			});
		},
		/**
		 * 图片文件上传成功回调
		 */
		handleImageSuccess(res, file) {
			const { fileName, fileSize, fileUrl } = this.valueKey;
			this.formData.list.push({
				[fileName]: res.data.title,
				[fileUrl]: res.data.url,
				[fileSize]: file.size,
			});
			Message.destroy();
		},
		/**
		 * 媒体文件上传成功回调
		 */
		handleMediaSuccess(res, file) {
			const { fileName, fileSize, fileUrl } = this.valueKey;
			this.formData.fileUrls.splice(0, 1, res.data.url);
			if (!this.formData[fileName]) {
				this.formData[fileName] = res.data.title;
			}
			
			this.formData.list.splice(0, 1, {
				[fileName]: this.formData[fileName],
				[fileUrl]: res.data.url,
				[fileSize]: file.size,
				duration: file.duration || 0
			});
			Message.destroy();
		},
		handleMediaError(error) {
			Message.destroy();
			Message.error({ content: error.msg });
		},
		handleDeleteMedia() {
			this.formData.fileUrls.splice(0, 1);
		},
		handlePreview() {
			if (this.accept === 'video') {
				VideoPreviewer.popup({
					dataSource: this.formData.fileUrls.slice(0, 1)
				});
			} else {
				AudioPreviewer.popup({
					src: this.formData.fileUrls[0]
				});
			}
		},
		/**
		 * 保存素材
		 */
		async handleOk(e, cb) {
			try {
				await this.$refs.form.validate();
				const { catId, fileId, fileName, fileSize, fileUrl } = this.valueKey;
				const payload = {
					[catId]: this.formData[catId],
					// list中可能存在上传后又被删除的文件，但是fileUrls是最新的，所以要根据fileUrls来取
					list: this.formData.list.filter(it => this.formData.fileUrls.includes(it[fileUrl]))
				};
				if (this.accept !== 'image') {
					payload.list[0][fileName] = this.formData[fileName];
				}
				await this.http({
					url: this.apis.URL_GALLERY_FILE_UPLOAD,
					type: 'POST',
					param: payload
				});
				this.$emit('sure', { catId: this.formData[catId] });
				cb();
			} catch (error) {
				error && console.log(error);
			}
		}
	},
};
</script>

<style lang="scss">
.vca-gallery-uploader {
	.vca-gallery-uploader__upload-box {
		border: 1px dashed #D9D9D9;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: #999999;
		line-height: 1;
		width: 64px;
		height: 64px;
		border-radius: 4px;
		background-color: #F5F5F6;
		cursor: pointer;
	}
	.vca-gallery-uploader__media {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 64px;
		height: 64px;
		border-radius: 4px;
		background-color: #fafafa;
		cursor: pointer;
		.vca-gallery-uploader__media-mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 4px;
		}
		.vca-gallery-uploader__delete {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: -6px;
			right: -6px;
			width: 14px;
			height: 14px;
			border-radius: 7px;
			background-color: #fff;
			color: #5495f6;
			font-size: 14px;
			z-index: 1;
		}
		.vca-gallery-uploader__play {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			width: 24px;
			height: 24px;
			border: 1px solid #fff;
			border-radius: 50%;
			background-color: rgba(0, 0, 0, .5);
			.vc-icon {
				margin-right: -2px;
				font-size: 12px;
				color: #fff;
			}
		}
		.vc-img {
			width: 100%;
			height: 100%;
		}
	}
}
.vc-upload-tips {
	z-index: 99999;
}
</style>
