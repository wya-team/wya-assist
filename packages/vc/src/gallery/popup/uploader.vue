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
			<vc-form-item v-if="accept === 'video'" label="视频名称：" :prop="valueKey.fileName">
				<vc-input
					v-model="formData[valueKey.fileName]"
					clearable
					placeholder="请输入视频名称"
					style="width: 300px"
				/>
			</vc-form-item>
			<vc-form-item v-if="accept === 'video'" label="本地文件：" prop="fileUrls">
				<vc-upload
					v-if="!formData.fileUrls.length"
					:size="50"
					:max="1"
					show-tips
					accept="video/mp4"
					@file-before="handleFileBefore"
					@begin="handleBegin"
					@error="handleError"
					@file-success="handleVideoSuccess"
				>
					<div class="vca-gallery-uploader__upload-box">
						<vc-icon type="plus" style="margin-bottom:8px;font-size:14px;" />
						<span>上传</span>
					</div>
				</vc-upload>
				<div v-else class="vca-gallery-uploader__video" @click="handlePreviewVideo">
					<vc-img :src="videoPosterUrl" fit="cover" />
					<div class="vca-gallery-uploader__video-mask">
						<div class="vca-gallery-uploader__play">
							<vc-icon type="toplay" />
						</div>
					</div>
					<div class="vca-gallery-uploader__delete" @click.stop="handleDeleteVideo">
						<vc-icon type="clear" />
					</div>
				</div>
				<div style="color: #999">
					支持 .mp4格式，视频不能超过 50Mb
				</div>
			</vc-form-item>
			<vc-form-item v-else label="本地文件：" prop="fileUrls">
				<vc-upload-picker
					v-model="formData.fileUrls"
					:max="10"
					:gallery="false"
					:upload-opts="imageUploadOpts"
					@success="handleFileSuccess"
				/>
				<div style="color: #999">
					支持 .jpg, .gif, .png, .bmp 格式，最多10张，单个图片不超过 3Mb
				</div>
			</vc-form-item>
		</vc-form>
	</vc-modal>
</template>

<script>
import Portal from '@wya/vc/lib/portal';
import Message from '@wya/vc/lib/message';
import UploadPicker from '@wya/vc/lib/upload-picker';
import Upload from '@wya/vc/lib/upload';
import Img from '@wya/vc/lib/img';
import Icon from '@wya/vc/lib/icon';
import { VideoPreviewer } from '.';

const config = {
	name: 'vca-gallery-uploader',
	components: {
		'vc-upload-picker': UploadPicker,
		'vc-upload': Upload,
		'vc-img': Img,
		'vc-icon': Icon,
	},
	props: {
		accept: {
			type: String,
			default: 'image',
			validator: value => ['image', 'video'].includes(value)
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
				[fileName]: [{ required: true, message: '请填写视频名称' }],
				fileUrls: [{ required: true, type: 'array', message: '请上传本地文件' }]
			},
			imageUploadOpts: {
				...this.uploadOpts,
				accept: 'image/jpg,image/png,image/gif,image/bmp',
				size: 3
			}
		};
	},
	computed: {
		// 资源类型名称
		sourceName() {
			return this.accept === 'video' ? '视频' : '图片';
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
		handleBegin(files) {
			Message.loading({ content: '上传中' });
		},
		/**
		 * 获取视频时长
		 */
		handleFileBefore(videoFile) {
			const videoEl = document.createElement('video');
			videoEl.preload = 'metadata';
			
			return new Promise((resolve, reject) => {
				let timer = null;
				const handler = () => {
					window.URL.revokeObjectURL(videoEl.src);
					timer && clearTimeout(timer);
					videoFile.duration = videoEl.duration;
					resolve(videoFile);
				};
				timer = setTimeout(() => {
					videoEl.removeEventListener('loadedmetadata', handler, false);
					reject({ msg: '获取视频时长失败' }); // eslint-disable-line
				}, 5000);

				videoEl.addEventListener('loadedmetadata', handler, false);
				videoEl.src = window.URL.createObjectURL(videoFile);
			});
		},
		/**
		 * 图片文件上传成功回调
		 */
		handleFileSuccess(res, file) {
			this.formData.list.push({
				file_name: res.data.title,
				file_url: res.data.url,
				file_size: file.size,
			});
			Message.destroy();
		},
		/**
		 * 视频文件上传成功回调
		 */
		handleVideoSuccess(res, file) {
			this.formData.fileUrls.splice(0, 1, res.data.url);
			this.formData.list.splice(0, 1, {
				file_name: res.data.title,
				file_url: res.data.url,
				file_size: file.size,
				duration: file.duration || 0
			});
			Message.destroy();
		},
		handleError(error) {
			Message.destroy();
			Message.error({ content: error.msg });
		},
		handleDeleteVideo() {
			this.formData.fileUrls.splice(0, 1);
		},
		handlePreviewVideo() {
			VideoPreviewer.popup({
				dataSource: this.formData.fileUrls.slice(0, 1)
			});
		},
		/**
		 * 保存素材
		 */
		async handleOk(e, cb) {
			try {
				await this.$refs.form.validate();
				const { catId, fileId, fileName, fileSize } = this.valueKey;
				await this.http({
					url: this.apis.URL_GALLERY_FILE_UPLOAD,
					type: 'POST',
					param: {
						[catId]: this.formData[catId],
						// list中可能存在上传后又被删除的文件，但是fileUrls是最新的，所以要根据fileUrls来取
						list: this.formData.list.filter(it => this.formData.fileUrls.includes(it.file_url))
					}
				});
				this.$emit('sure', { catId: this.formData[catId] });
				cb();
			} catch (error) {
				error && console.log(error);
			}
		}
	},
};

export default config;
export const Uploader = new Portal(config);
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
	.vca-gallery-uploader__video {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 64px;
		height: 64px;
		border-radius: 4px;
		background-color: #fafafa;
		cursor: pointer;
		.vca-gallery-uploader__video-mask {
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
</style>
