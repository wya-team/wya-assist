<template>
	<div :class="{ 'is-select': isSelect }" class="vm-editor-input">
		<div :class="{ 'is-radio': radio }" class="vm-editor-input__label">
			<vc-checkbox
				v-if="checkbox"
				v-model="currentSelectValue"
				:true-value="trueValue"
				:false-value="falseValue"
				style="position: relative; top: -1px;"
				v-bind="checkboxOpts"
				@change="handleCheckChange"
			/>
			<vm-editor-radio
				v-if="radio"
				v-model="currentSelectValue"
				:data-source="selects"
				style="flex: 1"
				@change="handleCheckChange"
			/>
			<span v-if="label" :style="[currentLabelStyle, labelStyle]">
				{{ label }}
			</span>
		</div>
		<vc-input
			v-model="currentInputValue"
			:maxlength="maxlength"
			:style="[currentInputStyle, inputStyle]"
			:indicator="indicator"
			clearable
			v-bind="inputOpts"
			@input="handleInputChange"
		/>
	</div>
</template>
<script>
import Checkbox from '@wya/vc/lib/checkbox';
import Input from '@wya/vc/lib/input';
import Radio from '../radio';

export default {
	name: 'vm-editor-input',
	components: {
		'vc-checkbox': Checkbox,
		'vc-input': Input,
		'vm-editor-radio': Radio
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: [String, Array],
			default: ''
		},
		checkbox: {
			type: Boolean,
			default: false,
		},
		radio: {
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
		labelWidth: {
			type: Number,
			default: 0
		},
		labelStyle: Object,
		inputWidth: {
			type: Number,
			default: 240
		},
		inputStyle: Object,
		maxlength: {
			type: Number,
			default: 30
		},
		indicator: {
			type: [Boolean, Object],
			default: () => ({ inline: true })
		},
		checkboxOpts: Object,
		inputOpts: Object
	},
	data() {
		return {
			selects: [
				{
					label: '显示',
					value: 1
				},
				{
					label: '隐藏',
					value: 0
				}
			],
			currentInputValue: '',
			currentSelectValue: 0
		};
	},
	computed: {
		isSelect() {
			return this.checkbox || this.radio || false;
		},
		currentLabelStyle() {
			const { isSelect, checkbox, radio, labelWidth } = this;
			return {
				width: labelWidth ? `${labelWidth}px` : 'auto',
				textAlign: !checkbox && !radio ? 'right' : 'left',
			};
		},
		currentInputStyle() {
			const { inputWidth } = this;
			return {
				width: inputWidth ? `${inputWidth}px` : 'auto'
			};
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(newVal, oldVal) {
				if (!this.isSelect && typeof newVal === 'string') {
					this.currentInputValue = newVal;
				} else {
					this.currentInputValue = newVal[0];
					this.currentSelectValue = newVal[1];
				}
			}
		}
	},
	methods: {
		handleInputChange(value) {
			this.currentInputValue = value;
			this.$emit('change', this.isSelect ? [value, this.currentSelectValue] : value);
			this.$emit('input-change', value);
		},

		/**
		 * isSelect: true 下才有此回调
		 */
		handleCheckChange(value) {
			this.currentSelectValue = value;
			this.$emit('change', [this.currentInputValue, value]);
			this.$emit('select-change', this.currentInputValue);
		}
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-input;

@include block($block) {
	position: relative;
	// display: inline-block;
	display: flex;

	@include element(label) {
		display: flex;
		align-items: center;
		@include when(radio) {
			flex-direction: row-reverse;
		}
	}

	@include when(select) {
		flex-direction: column;
	}
}
</style>
