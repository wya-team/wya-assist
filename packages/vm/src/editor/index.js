/**
 * editor
 */
import Radio from './radio';
import Checkbox from './checkbox';
import Cell from './cell';
import SortList from './sort-list';
import Slider from './slider';
import Header from './header';
import Color from './color';
import LabelTitle from './label-title';
import UploadPicker from './upload-picker';
import Input from './input';
import InputNumber from './input-number';
import Tip from './tip';
import Add from './add';
import Layout from './layout';

export default {
	Layout,
	Radio,
	Checkbox,
	Cell,
	SortList,
	Slider,
	Header,
	LabelTitle,
	Color,
	ImgsPicker: UploadPicker, // 兼容老版本
	UploadPicker,
	Input,
	InputNumber,
	Tip,
	Add
};
