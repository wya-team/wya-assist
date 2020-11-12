<template>
	<div class="vm-editor-title">
		<vc-checkbox
			v-if="mode === 'checkbox'"
			v-model="currentCheck"
			:true-value="1"
			:false-value="0"
			style="position: relative; top: -1px;"
			@change="handleCheckChange"
		/>
		<span
			:style="mode === 'normal'
				? `width: ${titleWidth || 50}px; text-align: right;` 
				: `width: ${titleWidth || 100}px; text-align: left;`"
			style="display: inline-block;"
		>
			{{ label }}
		</span>
		<vc-input
			:value="currentVal"
			:maxlength="maxlength"
			:style="{
				'width': mode === 'normal' ? '240px' : '160px',
			}"
			:indicator="{ inline: true }"
			clearable
			style="margin-top: 4px;"
			@input="handleInputChange"
		/>
	</div>
</template>
<script>
import Checkbox from '@wya/vc/lib/checkbox';
import Input from '@wya/vc/lib/input';

export default {
	name: 'vm-editor-title',
	components: {
		'vc-checkbox': Checkbox,
		'vc-input': Input,
	},
	props: {
		mode: {
			type: String,
			validator: (val) => {
				return ['normal', 'checkbox'].includes(val);
			}
		},
		label: String,
		value: {
			type: [String, Number],
			default: ''
		},
		check: {
			type: Number,
			default: 0
		},
		titleWidth: Number,
		maxlength: Number,
	},
	data() {
		return {
			currentVal: '',
			currentCheck: 0
		};
	},
	watch: {
		value: {
			immediate: true,
			handler(newVal, oldVal) {
				this.currentVal = newVal;
			}
		},
		check: {
			immediate: true,
			handler(newVal, oldVal) {
				this.currentCheck = newVal;
			}
		}
	},
	methods: {
		handleInputChange(val) {
			this.$emit('change', this.mode === 'normal' ? val : {
				name: val,
				show: this.currentCheck
			});
		},
		handleCheckChange(val) {
			this.$emit('change', {
				name: this.currentVal,
				show: val
			});
		}
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-title;

@include block($block) {
	position: relative;
	display: inline-block;
	@include element(tip) {
		position: absolute;
		right: 10px;
		z-index: 99;
		top: 50%;
		transform: translate(0, -50%);
	}
}
</style>
