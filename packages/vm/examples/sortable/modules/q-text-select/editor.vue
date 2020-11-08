<template>
	<div
		class="vm-basic-q-text-select-editor"
		style="display: flex; flex-direction: column;"
	>
		<vm-editor-header title="文本选择题" />
		<vm-editor-cell label="上下边距：">
			<vm-editor-slider
				v-model="$attrs.paddingVertical"
				@change="handleChange(arguments[0], 'paddingVertical')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="左右边距：">
			<vm-editor-slider
				v-model="$attrs.paddingHorizontal"
				@change="handleChange(arguments[0], 'paddingHorizontal')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="圆角：">
			<vm-editor-slider
				v-model="$attrs.borderRadius"
				@change="handleChange(arguments[0], 'borderRadius')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="标题：" required>
			<vc-input
				v-model="$attrs.title"
				:maxlength="150"
				:indicator="{ inline: true }"
				clearable
				style="width: 240px"
				placeholder="请输入"
				@input="handleChange(arguments[0], 'title')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="副标题：">
			<vc-input
				v-model="$attrs.subhead"
				:maxlength="150"
				:indicator="{ inline: true }"
				clearable
				style="width: 240px"
				placeholder="请输入"
				@input="handleChange(arguments[0], 'subhead')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="单选/多选：">
			<vm-editor-radio
				v-model="$attrs.multiple"
				:data-source="radios"
				@change="handleChange(arguments[0], 'multiple')"
			/>
		</vm-editor-cell>
		<vm-editor-cell label="是否必填：">
			<vc-checkbox
				v-model="$attrs.required"
				:true-value="1"
				:false-value="0"
				@change="handleChange(arguments[0], 'required')"
			/>
			<span>必填</span>
		</vm-editor-cell>
		<vc-divider>选项</vc-divider>

		<vm-editor-add 
			:data-source="$attrs.options" 
			@change="handleChange(arguments[0], 'options')"
			@add="handleAdd"
		>
			<template #default="{ it, index }">
				<vm-editor-cell :key="it._id" label="选项：" required>
					<vc-input
						v-model="it.label"
						:maxlength="150"
						:indicator="{ inline: true }"
						clearable
						style="width: 240px"
						placeholder="请输入"
						@input="handleChangeOptions(arguments[0], index)"
					/>
				</vm-editor-cell>
			</template>
		</vm-editor-add>
	</div>
</template>

<script>
import { Utils } from '@wya/utils';
import { Editor } from '../../../../src/index';

export default {
	name: 'vm-basic-q-text-select-editor', // eslint-disable-line
	components: {
		'vm-editor-cell': Editor.Cell,
		'vm-editor-header': Editor.Header,
		'vm-editor-slider': Editor.Slider,
		'vm-editor-radio': Editor.Radio,
		'vm-editor-add': Editor.Add,
	},
	inheritAttrs: false,
	data() {
		return {
			radios: [
				{
					label: '单选',
					value: 0,

				},
				{
					label: '多选',
					value: 1,
				}
			]
		};
	},
	methods: {
		handleChange(value, key) {
			this.$emit('change', { [key]: value });
		},

		handleAdd() {
			this.$attrs.options.push({
				_id: Utils.getUid(),
				label: ''
			});

			this.$emit('change', { options: this.$attrs.options });
		},

		handleChangeOptions(v, index) {
			this.$attrs.options.splice(index, 1, {
				...this.$attrs.options[index],
				label: v
			});

			this.$emit('change', { options: this.$attrs.options });
		}
	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-q-text-select-editor;
@include block($block) {
	
}
</style>
