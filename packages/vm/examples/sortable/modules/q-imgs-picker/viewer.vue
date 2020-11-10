<template>
	<vm-viewer-layout class="vm-basic-q-imgs-picker-viewer">
		<vm-viewer-question 
			:title="title"
			:title-prefix="qIndex"
			:subhead="subhead"
			:required="required"
			tag="图片"
		>
			<template>
				<div style="margin-top: 10px">
					<!-- max仅用于演示 -->
					<vcm-upload-picker v-model="answer" :max="answer.length ? answer.length : 9" />
					<span 
						style="color: #999;font-size: 11px"
					>最多9张、支持JPG,PNG,图片小于2M</span>
				</div>
			</template>
		</vm-viewer-question>
	</vm-viewer-layout>
</template>

<script>
import { Viewer } from '../../../../src/index';
import Question from '../../viewers/question';

export default {
	name: 'vm-q-imgs-picker-viewer',
	components: {
		'vm-viewer-layout': Viewer.Layout,
		'vm-viewer-question': Question,
	},
	mixins: Viewer.mixins(['q-index']),
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
$block: vm-basic-q-imgs-picker-viewer;

@include block($block) {
	.vcm-upload-picker__delete {
		display: none;
	}
}
</style>
