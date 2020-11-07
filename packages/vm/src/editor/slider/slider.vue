<template>
	<div class="vm-editor-slider">
		<div class="vm-editor-slider__wrapper">
			<vcm-slider
				:value="+num"
				:step="step"
				:min="min"
				:max="max"
				@change="handleSliderChange"
			/>
		</div>
		<div class="vm-editor-slider__content">
			<vcm-input-number
				v-model="num"
				:max="max"
				:min="min"
				:step="false"
			/>
		</div>
	</div>
</template>
<script>
export default {
	name: 'vm-editor-slider',
	props: {
		value: {
			type: [Number, String],
			required: true
		},
		step: {
			type: Number,
			default: 1
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 30
		}
	},
	data() {
		return {
			num: ''
		};
	},

	watch: {
		num: {
			handler(newVal, oldVal) {
				if (oldVal !== '' && oldVal !== newVal) {
					this.$emit("change", Number(newVal));
				}
			},
		},
		value: {
			immediate: true,
			handler(val) {
				this.num = val;
			}
		}
	},
	methods: {
		handleSliderChange() {
			this.num = arguments[0];
		}
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-slider;
$cb6: #b6b6b6;

@include block($block) {
	display: flex;
	justify-content: space-between;
	align-items: center;
	@include element(wrapper) {
		width: 190px;
		padding: 0 12px 0 0;
	}
	@include element(content) {
		width:52px;
		height: 28px;
		border: 1px solid $cb6;
		padding: 0 8px;
		border-radius: 4px;
	}
}
.vcm-input__content input{
	font-size: 12px;
	height: 26px;
	line-height: 26px;
}
</style>
