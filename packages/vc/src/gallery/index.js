import Portal from '@wya/vc/lib/portal';
import { ajax } from '@wya/http';
import wrapperComponent from './gallery';

const Gallery = new Portal(wrapperComponent, {
	onBefore({ accept, valueKey, apis, ...rest }) {
		const http = rest.ajax || ajax;
		return http({
			url: apis['URL_GALLERY_CATEGORY_LIST'],
			type: 'GET',
			param: {
				// 分类类型：1 图片，2 视频
				[valueKey ? valueKey.catType : 'cat_type']: accept === 'video' ? 2 : 1
			}
		});
	}
});

export default Gallery;