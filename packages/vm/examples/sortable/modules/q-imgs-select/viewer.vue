<template>
	<div class="vm-basic-q-imgs-select-viewer" :style="layoutStyle.wrapper">
		<components 
			:is="`vc-${multiple ? 'checkbox' : 'radio'}-group`" 
			:style="[layoutStyle.content, { display: 'block' }]"
			:value="multiple ? answer : answer[0]"
		>
			<vm-viewer-question 
				:title="title"
				:title-prefix="qIndex"
				:subhead="subhead"
				:tag="multiple ? '多选' : '单选'"
				:required="required"
				:data-source="options"
				options-class-name="vm-basic-q-imgs-select-viewer__options"
			>
				<template #item="{ it, prefix, index }">
					<div 
						:class="`is-layout-${layout}`"
						class="vm-basic-q-imgs-select-viewer__option"
					>
						<div style="border: 1px solid #CDCDCD; display: flex; flex-direction: column;">
							<div style="position: relative;">
								<vc-img 
									v-if="it.image && it.image[0]" 
									:src="it.image[0]"
									:style="imageStyle"
									fit="cover"
								/>
								<div v-else class="vm-basic-q-imgs-select-viewer__placeholder" />
								<div class="vm-basic-q-imgs-select-viewer__btn">
									<vcm-checkbox v-if="multiple" :label="String(index)">
										<span />
									</vcm-checkbox>
									<vcm-radio v-else :label="String(index)">
										<span />
									</vcm-radio>
									<span>选这个</span>
								</div>
							</div>
							<p class="vm-basic-q-imgs-select-viewer__label">
								{{ prefix }} {{ it.label }}
							</p>
						</div>
					</div>
				</template>
			</vm-viewer-question>
		</components>
	</div>
</template>

<script>
import { Checkbox, Radio } from '@wya/vc';
import { $ } from '@wya/utils';
import { Viewer } from '../../../../src/index';
import Question from '../../viewers/question';

export default {
	name: 'vm-q-imgs-select-viewer',
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
		layout: Number,
		multiple: Number,
		options: Array,
		answer: Array
	},
	data() {
		return {
			imageStyle: {
				height: 'auto'
			}
		};
	},
	mounted() {
		if (this.layout == 2) {
			const { clientWidth } = $(this.$el).getScroller();
			this.imageStyle = {
				height: (clientWidth - this.paddingHorizontal * 2 - 10 * 2 - 20 * 2) / 2 + 20 + 'px'
			};
		}
	}
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-q-imgs-select-viewer;

@include block($block) {
	pointer-events: none;
	@include element(options) {
		display: flex;
		flex-wrap: wrap;
		margin: 5px 0;
	}
	@include element(option) {
		width: 100%;
		img {
			width: 100%;
		}
		@include when(layout-1) {
			margin: 10px 0;
		}

		@include when(layout-2) {
			width: 50%;
			padding: 5px;
			@include element(placeholder) {
				height: 150px
			}
		}
	}

	@include element(placeholder) {
		background: #E7F4FF; 
		height: 200px
	}

	@include element(label) {
		padding: 5px;
		color: #0D0D1E;
		word-break: break-word;
		font-size: 16px;
		position: relative;
	}

	@include element(btn) {
		position: absolute; 
		bottom: 10px; 
		right: 10px;

		background: rgba(0, 0, 0, .5);
		padding: 0 8px;
		height: 28px;

		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 14px;

		color: #fff;
		.vcm-radio {
			margin-right: 4px;
		}
		.vcm-checkbox {
			margin-right: 4px;
		}
	}
}
</style>
