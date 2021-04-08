<template>
	<div class="c-editable-text">
		<span v-if="status === 'preview'" class="c-editable-text__value">
			{{ value }}
			<span v-if="activeComplete" class="c-editable-text__edit" @click="handleEdit">编辑</span>
			<vc-icon v-else type="edit" class="c-editable-text__edit-icon" @click="handleEdit" />
		</span>
		<template v-if="status === 'edit'">
			<!-- 数值输入 -->
			<vc-input-number
				v-if="inputType === 'number'"
				v-model="editValue"
				clearable
				autofocus
				:step="false"
				v-bind="inputOpts"
				class="c-editable-text__input"
				@blur="handleComplete"
				@enter="handleComplete"
			/>
			<!-- 其他字符输入 -->
			<vc-input
				v-else
				v-model="editValue"
				clearable
				autofocus
				v-bind="inputOpts"
				class="c-editable-text__input"
				@blur="handleComplete"
				@enter="handleComplete"
			/>
			<template v-if="activeComplete && !isLoading">
				<span class="c-editable-text__save" @click="doComplete">确定</span>
				<span class="c-editable-text__cancel" @click="handleCancel">取消</span>
			</template>
		</template>
		<vc-spin
			v-if="isLoading"
			:size="14"
			fix="relative"
		/>
	</div>
</template>

<script>
import Icon from '@wya/vc/lib/icon';
import Input from '@wya/vc/lib/input';
import Spin from '@wya/vc/lib/spin';

export default {
	name: 'vca-editable-text',
	components: {
		'vc-icon': Icon,
		'vc-input': Input,
		'vc-input-number': Input.Number,
		'vc-spin': Spin,
	},
	props: {
		value: {
			type: [String, Number],
			default: ''
		},
		inputType: {
			type: String,
			default: 'string',
			validator: value => ['string', 'number'].includes(value)
		},
		inputOpts: {
			type: Object,
			default: () => ({})
		},
		complete: {
			type: String,
			default: 'onBlur',
			validator: (value) => ['onBlur', 'onConfirm'].includes(value)
		}
	},
	data() {
		return {
			// 用于异步保存时的loading效果
			isLoading: false,
			status: 'preview',
			editValue: ''
		};
	},
	computed: {
		activeComplete() {
			return this.complete === 'onConfirm';
		}
	},
	methods: {
		handleEdit() {
			this.editValue = this.value;
			this.status = 'edit';
		},
		handleComplete() {
			if (!this.activeComplete) {
				this.doComplete();
			}
		},
		handleCancel() {
			this.editValue = this.value;
			this.status = 'preview';
		},
		async doComplete() {
			const { complete } = this.$listeners;
			this.isLoading = true;
			await complete(this.editValue);
			this.isLoading = false;
			this.status = 'preview';
		}
	}
};
</script>

<style lang="scss">
.c-editable-text {
	.c-editable-text__edit-icon, .c-editable-text__edit {
		display: none;
		color: #5495f6;
		cursor: pointer;
	}
	.c-editable-text__value {
		&:hover {
			.c-editable-text__edit-icon, .c-editable-text__edit {
				display: inline-block;
			}
		}
	}
	.c-editable-text__input {
		width: 100px;
	}
	.c-editable-text__save, .c-editable-text__cancel {
		color: #5495f6;
		cursor: pointer;
	}
}
</style>
