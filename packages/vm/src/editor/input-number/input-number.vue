<template>
	<div class="vm-editor-input-number">
		<vcm-input-number
			v-model="val"
			:max="max"
			:min="min"
			:step="step"
			:placeholder="placeholder"
			class="vm-editor-input-number__input"
		/>
	</div>
</template>
<script>
export default {
	name: 'vm-editor-input-number',
	props: {
		value: [String, Number],
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 100,
		},
		step: {
			type: [Number, Boolean],
			default: 0, // 为0时不展示
		},
		placeholder: {
			type: String,
			default: '请输入'
		},
		showLimit: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			val: ''
		};
	},
	watch: {
		value: {
			immediate: true,
			handler(newVal, oldVal) {
				this.val = newVal;
			}
		},
		val(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.$emit('change', newVal);
			}
		}
	},
	created() {
	}

};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-input-number;
$c54: #5495F6;
$cb6: #b6b6b6;

@include block($block) {
	width: 240px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid $cb6;
	border-radius: 4px;
	padding: 2px;
	@include element(input) {
		font-size: 12px;
		color: #333;
	}
	>span {
		flex: 0 0 30px;
		padding: 0 2px;
		line-height: 24px;
		text-align: right;
		color: #AAAAAA;
		font-style: 12px;
	}
}
</style>
