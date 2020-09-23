import Portal from '@wya/vc/lib/portal';

import EditorWrapperComponent from './editor.vue';
import MoveImgWrapperComponent from './move-img.vue';

export const Editor = new Portal(EditorWrapperComponent, {});
export const MoveImg = new Portal(MoveImgWrapperComponent, {});