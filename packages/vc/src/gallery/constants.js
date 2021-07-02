export const SOURCE_MAP = {
	'image': {
		name: '图片',
		fileType: 1,
		elementTag: 'img'
	},
	'video': {
		name: '视频',
		fileType: 2,
		elementTag: 'video'
	},
	'audio': {
		name: '音频',
		fileType: 3,
		elementTag: 'audio'
	}
};

// 默认的数据字段名映射
export const DEFAULT_FIELD_MAP = {
	catId: 'cat_id',
	catType: 'cat_type',
	catName: 'cat_name',
	// 与 filename, field 做区分
	fileName: 'file_name',
	fileId: 'file_id',
	fileUrl: 'file_url',
	fileSize: 'file_size',
	fileType: 'cat_type',
	isDefault: 'is_default',
	count: 'cat_num'
};