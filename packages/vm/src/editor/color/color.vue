<template>
	<div class="vm-editor-color">
		<vc-color-picker v-model="value" :alpha="alpha" @change="handleSelect" />
		<div class="vm-editor-color__reset" @click="handleReset">
			重置
		</div>
	</div>
</template>
<script>
import ColorPicker from '@wya/vc/lib/color-picker';

export default {
	name: 'vm-editor-color',
	components: {
		'vc-color-picker': ColorPicker
	},
	props: {
		color: String,
		alpha: {
			type: Boolean,
			default: false,
		},
		default: String
	},
	data() {
		return {
			value: this.color
		};
	},
	watch: {
		color(v) {
			this.value = v;
		}
	},
	mounted() {

	},
	methods: {
		handleReset() {
			this.handleSelect(this.default);
		},
		handleSelect(value) {
			this.value = value;
			this.$emit("change", this.value);
		}
	}

};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-color;
$c54: #5495F6;
@include block($block) {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	@include element(reset){
		cursor: pointer;
		margin-left: 10px;
		display: inline-block;
		padding:2px;
		width: 30px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		color: $c54;
		font-size: 12px;
	}
}
</style>
