<template>
	<vm-viewer-layout class="vm-basic-q-text-input-viewer">
		<vm-viewer-question 
			:title="title"
			:title-prefix="rebuildIndex"
			:subhead="subhead"
			:required="required"
			tag="文本"
		>
			<template>
				<div style="margin: 10px 0">
					<vcm-textarea
						:value="answer[0]"
						style="border: 1px solid #CDCDCD; padding: 5px; min-height: 100px"
						placeholder="请输入"
					/>
				</div>
			</template>
		</vm-viewer-question>
	</vm-viewer-layout>
</template>

<script>
import { Viewer } from '../../../../src/index';
import Question from '../../viewers/question';

export default {
	name: 'vm-q-text-input-viewer',
	components: {
		'vm-viewer-layout': Viewer.Layout,
		'vm-viewer-question': Question,
	},
	mixins: Viewer.mixins(['rebuild-index']),
	props: {
		id: String,
		
		title: String,
		subhead: String,
		required: [Number, Boolean],
		answer: Array
	}
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/common.scss";
$block: vm-basic-q-text-input-viewer;

@include block($block) {
	pointer-events: none;
}
</style>
