import Portal from '@wya/vc/lib/portal';
import { ajax } from '@wya/http';
import wrapperComponent from './gallery.vue';
import { SOURCE_MAP } from './constants.js';

const Gallery = new Portal(wrapperComponent, {
	onBefore({ accept, valueKey, apis, ...rest }) {
		const http = rest.ajax || ajax;
		return http({
			url: apis['URL_GALLERY_CATEGORY_LIST'],
			type: 'GET',
			param: {
				// 分类类型：1 图片，2 视频
				[valueKey ? valueKey.catType : 'cat_type']: SOURCE_MAP[accept].fileType
			}
		});
	}
});

export default Gallery;