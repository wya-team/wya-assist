<template>
	<div class="vm-editor-title">
		<vc-checkbox
			v-if="checkbox"
			v-model="currentCheckValue"
			:true-value="trueValue"
			:false-value="falseValue"
			style="position: relative; top: -1px;"
			v-bind="checkboxOpts"
			@change="handleCheckChange"
		/>
		<span :style="labelStyle">
			{{ label }}
		</span>
		<vc-input
			v-model="currentInputValue"
			:maxlength="maxlength"
			:style="{
				'width': checkbox ? '160px' : '240px',
			}"
			:indicator="{ inline: true }"
			clearable
			style="margin-top: 4px;"
			v-bind="inputOpts"
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
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: Array,
			default: () => ([])
		},
		checkbox: {
			type: Boolean,
			default: false,
		},
		trueValue: {
			type: Number,
			default: 1,
		},
		falseValue: {
			type: Number,
			default: 0,
		},
		label: {
			type: String,
			default: ''
		},
		labelWidth: Number,
		maxlength: {
			type: Number,
			default: 30
		},

		checkboxOpts: Object,
		inputOpts: Object
	},
	data() {
		return {
			currentInputValue: '',
			currentCheckValue: 0
		};
	},
	computed: {
		labelStyle() {
			const { checkbox, labelWidth } = this;
			return {
				width: `${labelWidth || (checkbox ? 100 : 50)}px`,
				textAlign: checkbox ? 'left' : 'right',
				display: 'inline-block'
			};
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(newVal, oldVal) {
				this.currentInputValue = newVal[0];
				this.currentCheckValue = newVal[1];
			}
		}
	},
	methods: {
		handleInputChange(value) {
			this.$emit('change', [value, this.currentCheckValue]);
		},
		handleCheckChange(value) {
			this.$emit('change', [this.currentInputValue, value]);
		}
	}
};
</script>
<style lang="scss">

</style>
