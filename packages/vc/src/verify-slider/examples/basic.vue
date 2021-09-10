<template>
	<div>
		<vca-verify-slider-core
			:src="verifySrc" 
			:url="verifyUrl" 
			@success="handleSuccess"
		/>
		<vca-verify-slider 
			v-model="showVerifySlider"
			:src="verifySrc" 
			:url="verifyUrl" 
			@success="handleSuccess"
		>
			<vc-button 
				type="primary"
				style="margin-top: 30px"
				@click.prevent.stop="handleValidate"
			>
				登录
			</vc-button> 
		</vca-verify-slider>
	</div>
</template>

<script>
import { Utils } from '@wya/utils';
import Popover from '@wya/vc/lib/popover';
import Slider from '..';

export default {
	name: 'vca-basic',
	components: {
		'vca-verify-slider': Slider,
		'vca-verify-slider-core': Slider.Core,
	},
	data() {
		return {
			showVerifySlider: false,
			verifySrc: 'https://gateway.wyawds.com/account/login/captcha.json',
			verifyUrl: 'https://gateway.wyawds.com/account/login/validate-captcha.json', // 滑块校验地址
		};
	},
	methods: {
		handleSuccess() {
		},
		handleValidate() {
			this.showVerifySlider = true;
		},
	}
};
</script>

<style lang="scss">
.v-verify-portal-container {
	.vc-popover-core__container {
		padding: 0 !important;
	}
}
</style>
