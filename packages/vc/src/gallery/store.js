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
			categories: [],
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
		GALLERY_CATEGORIES_SET(state, { data = [] }) {
			const { catId } = this.gallery.valueKey;
			state.categories = data;
			data.forEach(item => {
				initialListInfo[item[catId]] = { ...initPage };
			});
			state.listInfo = { ...initialListInfo };
		},
		GALLERY_FILE_LIST_GET_SUCCESS(state, { data, param: { catId, page } }) {
			state.listInfo = {
				...state.listInfo,
				[catId]: {
					...state.listInfo[catId],
					...data.page,
					data: {
						...state.listInfo[catId].data,
						[page]: data.list
					}
				}
			};
			const index = state.categories.findIndex(item => item[this.gallery.valueKey.catId] === catId);
			index >= 0 && (state.categories[index][this.gallery.valueKey.count] = data.page.count);
		},
		GALLERY_CURRENT_CATEGORY_SET(state, { id }) {
			const { catId } = this.gallery.valueKey;
			const target = state.categories.find(it => it[catId] === id);
			state.curCategory = target;
			state.listInfo = {
				...initialListInfo,
				[id]: { ...initPage }
			};
		},
		GALLERY_FILE_LIST_INIT(state) {
			state.listInfo = {
				...initialListInfo
			};
		},
		GALLERY_FILE_LIST_RESET(state, { catId }) {
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