import Portal from '@wya/vc/lib/portal';

import EditorWrapperComponent from './editor.vue';
import MoveFileWrapperComponent from './move-file.vue';
import UploaderWrapper from './uploader.vue';

export { VideoPreviewer } from './video-previewer.vue';
export { AudioPreviewer } from './audio-previewer.vue';

export const Editor = new Portal(EditorWrapperComponent);
export const MoveFile = new Portal(MoveFileWrapperComponent);
export const Uploader = new Portal(UploaderWrapper);
