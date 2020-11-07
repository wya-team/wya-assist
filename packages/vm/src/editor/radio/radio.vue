<template>
	<div class="vm-editor-radio">
		<vc-radio-group
			v-model="val"
			:vertical="vertical"
		>
			<vc-radio
				v-for="(item, index) in dataSource"
				:key="index"
				:label="item.value"
			>
				<span>{{ item.label }}</span>
			</vc-radio>
		</vc-radio-group>
	</div>
</template>
<script>
export default {
	name: 'vm-editor-radio',
	model: {
		prop: 'value',
		event: 'change',
	},
	props: {
		dataSource: {
			type: Array,
			default: () => []
		},
		label: String,
		value: [String, Number],
		 // 纵向排列模式
		vertical: {
			type: Boolean,
			default: false
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
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-radio;

@include block($block) {
	display: flex;
	align-items: center;
	line-height: 22px;
	.vc-radio {
		>span:last-child {
			display: inline-block;
			padding-right: 12px;
		}
	}
}
</style>
