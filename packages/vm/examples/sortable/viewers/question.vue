<template>
	<div class="vm-viewer-question" style="position: relative;">
		<div class="vm-viewer-question__tag">
			<div class="vm-viewer-question__before" />
			<span style="color: white">{{ tag }}</span>
		</div>
		<div class="vm-viewer-question__content">
			<div class="vm-viewer-question__text">
				<p>
					{{ titlePrefix }}{{ title }}
					<span v-if="required" style="color: red">*</span>
				</p>
				<span>{{ subhead }}</span>
			</div>
			<slot>
				<div :class="optionsClassName" :style="optionsStyle">
					<template v-for="(item, index) in dataSource">
						<slot
							name="item" 
							:index="index" 
							:prefix="formatter && formatter(index)"
							:it="item" 
						/>
					</template>
				</div>
			</slot>
		</div>
	</div>
</template>

<script>

export default {
	name: "vm-viewer-question",
	props: {
		tag: String,
		title: String,
		subhead: String,
		required: [Number, Boolean],
		dataSource: {
			type: Array,
			default: () => ([])
		},
		formatter: {
			type: [Boolean, Function],
			default: () => (index) => `${String.fromCharCode('A'.charCodeAt(0) + index)}.`
		},
		titlePrefix: {
			type: String,
			default: ''
		},
		optionsClassName: {
			type: String,
			default: ''
		},
		optionsStyle: [Object, Array, String]
	}
};
</script>

<style lang="scss">
@import "../../../src/style/index.scss";
$block: vm-viewer-question;

$height: 26px;
$width: 58px;
@include block($block) {
	overflow: hidden;
	@include element(tag) {
		position: absolute;
		top: 0;
		right: 0;
		width: $width;
		height: $height;
		line-height: $height;
		font-size: 13px;
		text-align: center;
		background-color: #87A3F7;
	}
	@include element(before) {
		content: "";
		position: absolute;
		top: $height;
		left: 0;
		width: 0;
		height: 0;
		border-color: #87A3F7 #87A3F7 rgba(0,0,0,0);
		border-style: solid;
		border-width: 0 $width / 2 $height / 2;
	}

	@include element(content) {
		padding: 40px 20px 34px;
	}

	@include element(text) {
		> p {
			color: #0D0D1E;
			font-size: 16px;
			font-weight: 500;
			line-height: 24px;
			word-break: break-word;
		}
		> span {
			color: #999;
			font-size: 12px;
			word-break: break-word;
		}
	}

	@include element(option) {
		color: #0D0D1E;
		font-size: 16px;
		word-break: break-word;
		margin: 35px 0;
	}
}
</style>
