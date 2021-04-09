import Portal from '@wya/vc/lib/portal';

import EditorWrapperComponent from './editor.vue';
import MoveFileWrapperComponent from './move-file.vue';
import VideoPreviewerWrapper from './video-previewer.vue';

export const Editor = new Portal(EditorWrapperComponent);
export const MoveFile = new Portal(MoveFileWrapperComponent);
export const VideoPreviewer = new Portal(VideoPreviewerWrapper, { promise: false });