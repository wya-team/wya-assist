export default {
	props: {
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
