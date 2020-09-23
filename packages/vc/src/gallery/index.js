import Portal from '@wya/vc/lib/portal';
import wrapperComponent from './gallery.vue';

const Gallery = new Portal(wrapperComponent, {
	onBefore(opts) {
		const http = opts.ajax || ajax;
		return http({
			url: opts.apis['URL_GALLERY_CATEGORY_LIST'],
			type: 'GET'
		});
	}
});

export default Gallery;