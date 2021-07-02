/**
 * 通过文件mime type 解析得到 人类可读的文件类型
 * 如  image/jpg,image/png,image/gif,image/bmp -> ['jpg', 'png', 'gif', 'bmp']
 * @param {*} mime 
 * @returns 
 */
export const getMimesByMimeStr = mime => {
	return mime.replace(/\w+\//g, '').split(',');
};