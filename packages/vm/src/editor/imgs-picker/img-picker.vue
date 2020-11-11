<template>
	<div class="vm-editor-imgs-picker">
		<vc-upload-picker
			ref="imgs-picker"
			v-model="imgs"
			:max="max"
			:upload-opts="uploadOpts"
			@change="handleChange"
			@error="handleError"
		/>
		<p class="vm-editor-imgs-picker__tips">
			{{ tips }}
		</p>
	</div>
</template>
<script>
import UploadPicker from '@wya/vc/lib/upload-picker';

export default {
	name: 'vm-editor-imgs-picker',
	components: {
		'vc-upload-picker': UploadPicker,
	},
	props: {
		value: {
			type: Array,
			default: () => []
		},
		uploadOpts: {
			type: Object,
			default: () => {
				return {
					multiple: false
				};
			}
		},
		max: {
			type: Number,
			default: 1
		},
		tips: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			imgs: this.value
		};
	},
	watch: {
		value(v, oldV) {
			if (v !== oldV) {
				this.imgs = v;
				if (v.length && oldV.length) {
					setTimeout(() => {
						this.$refs['imgs-picker'].reset(this.imgs);
					}, 0);
				}
			}
		}
	},
	methods: {
		handleError(error) {
			console.log(error);
		},
		handleChange() {
			this.$emit('change', this.imgs);
		}
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-imgs-picker;
$c51: #515151;
@include block($block) {
	@include element(tips){
		font-size: 12px;
		color: #999999;
	}
}
</style>
