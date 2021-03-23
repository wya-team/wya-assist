<template>
	<div class="vca-relation-chain">
		<div v-if="showButton" class="vca-relation-chain__button is-prev" @click="handlePrev">
			<vc-icon type="arrow-left" class="vca-relation-chain__icon" />
		</div>
		<div ref="relation" :class="{ 'is-word-wrap': wordWrap }" class="vca-relation-chain__relation">
			<div ref="wrapper" class="vca-relation-chain__wrapper" :style="relationWrapper">
				<slot />
			</div>
		</div>
		<div v-if="showButton" class="vca-relation-chain__button is-next" @click="handleNext">
			<vc-icon type="arrow-right" class="vca-relation-chain__icon" />
		</div>
	</div>
</template>

<script>
import Icon from '@wya/vc/lib/icon';

export default {
	name: 'vca-relation-chain',
	components: {
		'vc-icon': Icon,
	},
	props: {
		wordWrap: Boolean,
		defaultAvatar: String
	},
	data() {
		return {
			showButton: false,
			relationWrapper: {}
		};
	},
	computed: {

	},
	watch: {
		
	},
	mounted() {
		this.distence = 0;
		this.handleWindowResize();
		window.addEventListener('resize', this.handleWindowResize);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.handleWindowResize);
	},
	methods: {
		handleWindowResize() {
			let wrapperWidth = this.$refs.wrapper.offsetWidth;
			let relationWidth = this.$refs.relation.offsetWidth;
			if (wrapperWidth > relationWidth) {
				this.showButton = !this.wordWrap;
			}
		},
		handlePrev() {
			let wrapperWidth = this.$refs.wrapper.offsetWidth;
			let relationWidth = this.$refs.relation.offsetWidth;
			if (this.distence < relationWidth) {
				this.distence = 0;
			} else {
				this.distence -= relationWidth;
			}
			this.relationWrapper = { transform: `translateX(-${this.distence}px)` };
		},
		handleNext() {
			let wrapperWidth = this.$refs.wrapper.offsetWidth;
			let relationWidth = this.$refs.relation.offsetWidth;
			let num = wrapperWidth / relationWidth;
			let overlength = wrapperWidth - (relationWidth + this.distence); // 剩余的长度
			let moveDistence = overlength / relationWidth;
			if (relationWidth + this.distence < wrapperWidth) {
				if (wrapperWidth / relationWidth > 1) {
					if (parseInt(num, 0) === 1) {
						this.distence = wrapperWidth - relationWidth;
					} else if (parseInt(moveDistence, 0) < 1) {
						this.distence += overlength;
					} else {
						this.distence += relationWidth;
					}
					this.relationWrapper = { transform: `translateX(-${this.distence}px)` };
				}
			}
		},
	},
};
</script>

<style lang="scss">
.vca-relation-chain {
	width: 100%;
	display: flex;
	align-items: center;
	.vca-relation-chain__button {
		position: relative;
        cursor: pointer;
		min-width: 24px;
		width: 24px;
        height: 24px;
		border-radius: 12px;
		background-color: #bdbdbd;
		display: flex;
		align-items: center;
		justify-content: center;
		&.is-prev {
			margin-right: 12px;
		}
		&.is-next {
			margin-left: 12px;
		}
	}
	.vca-relation-chain__icon {
		color: #ffffff;
		font-size: 16px;
	}
	.vca-relation-chain__relation {
		display: flex;
        overflow: hidden;
		.vca-relation-chain__wrapper {
            display: flex;
            transition: transform .3s;
			padding: 0 20px;
        }
		&.is-word-wrap {
			overflow: auto;
			.vca-relation-chain__wrapper {
				flex-wrap: wrap;
			}
			.vca-relation-chain-item__content {
				margin-bottom: 10px;
			}
		}
	}
}
</style>
