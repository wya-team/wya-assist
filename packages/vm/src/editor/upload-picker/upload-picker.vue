<template>
	<div class="vm-editor-upload-picker">
		<vc-upload-picker
			ref="upload-picker"
			v-model="currentValue"
			:max="max"
			:upload-opts="uploadOpts"
			@change="handleChange"
			@error="handleError"
		/>
		<p class="vm-editor-upload-picker__tips">
			{{ tips }}
		</p>
	</div>
</template>
<script>
import UploadPicker from '@wya/vc/lib/upload-picker';

export default {
	name: 'vm-editor-upload-picker',
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
			currentValue: this.value
		};
	},
	watch: {
		value(v, oldV) {
			if (v !== oldV) {
				this.currentValue = v;
				if (v.length && oldV.length) {
					setTimeout(() => {
						this.$refs['upload-picker'].reset(this.currentValue);
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
			this.$emit('change', this.currentValue);
		}
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-upload-picker;
$c51: #515151;
@include block($block) {
	@include element(tips){
		font-size: 12px;
		color: #999999;
	}
}
</style>
