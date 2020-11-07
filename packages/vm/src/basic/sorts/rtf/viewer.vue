<template>
	<vm-viewer-layout 
		class="vm-rtf-viewer" 
		v-bind="layoutStyle"
	>
		<vcm-editor-view
			v-if="content"
			:content="content"
			class="vm-rtf-viewer__content"
		/>
		<p
			v-else
			style="font-size: 12px; color: #999;"
			class="vm-rtf-viewer__content-tip"
		>
			请在右侧输入文本内容
		</p>
	</vm-viewer-layout>
</template>

<script>
import Editor from '@wya/vc/lib/editor';
import Viewer from '../../../viewer';

export default {
	name: 'vm-rtf-viewer',
	components: {
		"vcm-editor-view": Editor.View,
		"vm-viewer-layout": Viewer.Layout
	},
	mixins: Viewer.mixins(['layout-style']),
	props: {
		id: String,
		content: String,
	}
};
</script>

<style lang="scss">
@import "../../../style/index.scss";
$block: vm-rtf-viewer;

@include block($block) {
	overflow: hidden;
	@include element(content) {
		line-height: 22px;
		padding: 0;
		overflow: hidden;
	}
	@include element(content-tip) {
		line-height: 22px;
		padding: 8px 12px;
		overflow: hidden;
	}
	.ql-editor {
		padding: 8px 12px;
		line-height: 22px;
		img {
			width: 100vw;
		}
	}
}
</style>
