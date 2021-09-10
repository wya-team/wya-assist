<template>
	<div>
		<vca-verify-slider 
			v-model="showVerifySlider"
			:src="verifySrc" 
			:url="verifyUrl" 
			@success="handleSuccess"
		>
			<vc-button 
				type="primary"
				long 
				class="v-login-sign__btn"
				@click.prevent.stop="handleValidate"
			>
				登录
			</vc-button> 
		</vca-verify-slider>
	</div>
</template>

<script>
import Silder from '..';

export default {
	name: 'vca-basic',
	components: {
		'vca-verify-slider': Silder
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
		}		
	}
};
</script>

<style lang="scss" scoped>
</style>
