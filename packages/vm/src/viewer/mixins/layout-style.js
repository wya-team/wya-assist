export default {
	props: {
		reverse: {
			type: Boolean,
			default: false
		},
		paddingVertical: Number,
		paddingHorizontal: Number,
		borderRadius: Number,
		backgroundType: Number,
		backgroundColor: String,
		backgroundImage: Array,
		backgroundSize: {
			type: String,
			default: 'cover'
		}
	},
	computed: {
		layoutStyle() {
			return {
				wrapper: {
					padding: `${this.paddingVertical}px ${this.paddingHorizontal}px`,
					background: this.reverse ? `${this.backgroundColor}` : 'transparent',
				},
				content: {
					background: `${this.backgroundColor}`,
					backgroundImage: this.backgroundImage && this.backgroundImage[0] 
						? `url(${this.backgroundImage[0]})`
						: undefined,
					backgroundSize: this.backgroundSize,
					borderRadius: `${this.borderRadius}px`,
					overflow: 'hidden'
				}
			};
		}
	}
};
