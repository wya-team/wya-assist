/**
 * 通过文件mime type 解析得到 人类可读的文件类型
 * 如  image/jpg,image/png,image/gif,image/bmp -> ['jpg', 'png', 'gif', 'bmp']
 * jpg和jpeg需要做些处理，只要含jpg或jpeg都返回['jpg', 'jpeg']
 * @param {*} mime 
 * @returns 
 */
export const getMimesByMimeStr = mimeStr => {
	const mimes = mimeStr.replace(/\w+\//g, '').split(',');
	return /jpe?g/.test(mimeStr) ? Array.from(new Set([...mimes, 'jpg', 'jpeg'])) : mimes;
};

/**
 * 通过文件的src判断某个文件是否为合法（与允许上传的mime保持一致）的mime type
 * @param {*} src 
 * @param {*} mimeTypes 
 */
export const isValidMime = (src, mimeTypes) => {
	const mime = src.replace(/.+\.([\w\d]+)/, '$1').toLowerCase();
	return mimeTypes.includes(mime);
};
