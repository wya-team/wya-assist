/**
 * 通过文件mime type 解析得到 人类可读的文件类型
 * 如  image/jpg,image/png,image/gif,image/bmp -> ['jpg', 'png', 'gif', 'bmp']
 * jpg和jpeg需要做些处理，只要含jpg或jpeg都返回['jpg', 'jpeg']
 * @param {*} mime 
 * @param {*} mainMime 主mime 如image、video、audio
 * @returns 
 */
export const getMimesByMimeStr = (mimeStr, mainMime) => {
	if (mainMime) {
		// 将不属于主mime的mime类型过滤掉
		mimeStr = mimeStr.split(',').filter(it => it.includes(mainMime)).join();
	}
	const mimes = mimeStr.replace(/\w+\//g, '').split(',');
	return /jpe?g/.test(mimeStr) ? Array.from(new Set([...mimes, 'jpg', 'jpeg'])) : mimes;
};

/**
 * 通过文件的src判断某个文件是否为合法（与允许上传的mime保持一致）的mime type
 * 注意 * 的情况
 * @param {*} src 
 * @param {*} mimeTypes 
 */
export const isValidMime = (src, mimeTypes) => {
	if (mimeTypes.includes('*')) return true;
	const mime = src.replace(/.+\.([\w\d]+)/, '$1').toLowerCase();
	return mimeTypes.includes(mime);
};
