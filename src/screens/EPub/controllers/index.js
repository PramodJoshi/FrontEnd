import EPubConstants from './constants/EPubConstants';
import EPubIDs from './constants/EPubIDs';
import EPubNavigator from './EPubNavigator';
import EPubDownloadController from './EPubDownloadController';
import { epubState } from './EPubStateManager';
import { epubCtrl } from './EPubController';
import { epubData } from './EPubDataController';
import { shortcut } from './ShortcutController';
import { epubPref } from './PreferenceController';

export const epub = {
  const: EPubConstants,
  id: EPubIDs,
  download: EPubDownloadController,
  state: epubState,
  ctrl: epubCtrl,
  data: epubData,
  history: epubData.history,
  nav: new EPubNavigator(),
  shortcut,
  pref: epubPref
};

export * from './utils';
export * from './onboard-guide';
export { epubStore, connectWithRedux } from 'redux/epub';