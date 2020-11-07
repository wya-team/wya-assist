<template>
	<div class="vm-editor-checkboxes">
		<vc-checkbox-group
			v-model="currentVal"
			:class="column ? 'is-column' : ''"
			class="vm-editor-checkboxes__group"
			@change="handleChange"
		>
			<vc-checkbox
				v-for="(item, index) in dataSource"
				:key="index"
				:label="item.value"
				:disabled="item.disabled || false"
				class="vm-editor-checkboxes__item"
			>
				<span>{{ item.label }}</span>
			</vc-checkbox>
		</vc-checkbox-group>
	</div>
</template>
<script>
export default {
	name: 'vm-editor-checkboxes',
	props: {
		dataSource: {
			type: Array,
			default: () => []
		},
		value: {
			type: Array,
			default: () => []
		},
		column: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			currentVal: ''
		};
	},
	watch: {
		value: {
			immediate: true,
			handler(newVal, oldVal) {
				this.currentVal = newVal;
			}
		}
	},
	methods: {
		handleChange(val) {
			this.$emit('change', this.currentVal);
		}
	}
};
</script>
<style lang="scss">
@import "../../style/index.scss";
$block: vm-editor-checkboxes;

@include block($block) {
	@include element(group) {
		display: flex;
		@include element(item) {
			margin-right: 20px;
			>span:last-child {
				padding-left: 8px;
			}
		}
		@include when(column) {
			flex-direction: column;
			@include element(item) {
				margin-bottom: 15px;
			}
		}
	}
}
</style>
