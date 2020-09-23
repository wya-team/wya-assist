import { initPage } from '@wya/utils';

const initialListInfo = {};

/**
 * Gallery Store
 * @param {*} initialState 
 */
class GalleryStore {
	constructor(gallery, initialState = {}) {
		if (!gallery) {
			throw new Error('Gallery is required.');
		}
		this.gallery = gallery;

		this.state = {
			listInfo: {},
			categoryList: [],
			curCategory: {},
			selectedFiles: [],
			...initialState
		};
	}

	/**
	 * GalleryStore Commit
	 */
	commit(name, ...args) {
		const mutations = this.mutations;
		if (mutations[name]) {
			mutations[name].apply(this, [this.state].concat(args));
		} else {
			throw new Error(`Mutation not found: ${name}`);
		}
	}

	/**
	 * GalleryStore Mutations
	 */
	mutations = {
		GALLERY_CATEGORY_LIST_GET_SUCCESS(state, { data = [] }) {
			const { catId } = this.gallery.valueKey;
			state.categoryList = data;
			data.forEach(item => {
				initialListInfo[item[catId]] = { ...initPage };
			});
			state.listInfo = { ...initialListInfo };
		},
		GALLERY_IMG_LIST_GET_SUCCESS(state, { data, param: { catId, page } }) {
			state.listInfo = {
				...state.listInfo,
				[catId]: {
					...state.listInfo[catId],
					current: data.currentPage,
					count: data.totalCount,
					total: data.totalPage,
					data: {
						...state.listInfo[catId].data,
						[page]: data.list
					}
				}
			};
			const target = state.categoryList.find(item => item[this.gallery.valueKey.catId] === catId);
			target && (target[this.gallery.valueKey.count] = data.totalCount);
		},
		GALLERY_CURRENT_CATEGORY_SET(state, { target }) {
			const { catId } = this.gallery.valueKey;
			state.curCategory = target;
			state.listInfo = {
				...initialListInfo,
				[target[catId]]: { ...initPage }
			};
		},
		GALLERY_IMG_LIST_INIT(state) {
			state.listInfo = {
				...initialListInfo
			};
		},
		GALLERY_IMG_LIST_RESET(state, { catId }) {

			state.listInfo = {
				...state.listInfo,
				[catId]: {
					...initPage,
					reset: true
				}
			};
		},
		GALLERY_SELECTED_FILES_SET(state, { target }) {
			state.selectedFiles = target || [];
		}
	}

}

export default GalleryStore;