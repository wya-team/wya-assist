<template>
	<div class="vm-basic-q-text-select-viewer" :style="layoutStyle.wrapper">
		<components 
			:is="`vc-${multiple ? 'checkbox' : 'radio'}-group`" 
			:value="multiple ? answer : answer[0]"
			:style="[layoutStyle.content, { display: 'block' }]"
		>
			<vm-viewer-question 
				:title="title"
				:title-prefix="qIndex"
				:subhead="subhead"
				:tag="multiple ? '多选' : '单选'"
				:required="required"
				:data-source="options"
			>
				<template #item="{ it, prefix, index }">
					<div class="vm-basic-q-text-select-viewer__option">
						<div 
							:style="{ color: answer.includes(String(index)) ? '#87A3F7' : '#333'}"
						>
							{{ prefix }} {{ it.label }}
						</div>
						<!-- TODO: vc默认使用的是label作为value -->
						<vcm-checkbox v-if="multiple" :label="String(index)">
							<span />
						</vcm-checkbox>
						<vcm-radio v-else :label="String(index)">
							<span />
						</vcm-radio>
					</div>
				</template>
			</vm-viewer-question>
		</components>
	</div>
</template>

<script>
import { Checkbox, Radio } from '@wya/vc';
import { Viewer } from '../../../../src/index';
import Question from '../../viewers/question';

export default {
	name: 'vm-q-text-select-viewer',
	components: {
		'vm-viewer-question': Question,
		'vc-radio-group': Radio.Group,
		'vc-checkbox-group': Checkbox.Group,
		'vc-radio': Radio,
		'vc-checkbox': Checkbox,
	},
	mixins: Viewer.mixins(['layout-style', 'q-index']),
	props: {
		id: String,
		
		title: String,
		subhead: String,
		required: [Number, Boolean],
		multiple: Number,
		options: Array,
		answer: Array
	}
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-q-text-select-viewer;

@include block($block) {
	pointer-events: none;
	@include element(option) {
		color: #0D0D1E;
		font-size: 16px;
		word-break: break-word;
		margin: 35px 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
}
</style>
