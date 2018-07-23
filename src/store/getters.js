/* eslint-disable */
import {
  store
} from './index';
const getters = {
  currentTabData: state => {
    return store.state.sidebarTabData[store.state.currentTabIndex];
  },

  projData: state => (proId) => {
    let storeProjData = store.state.sidebarTabData[0];
    let onePro = [];
    if (storeProjData === undefined || proId === undefined) return onePro;
    for (let index = 0; index < storeProjData.length; index++) {
      const el = storeProjData[index];
      if (el.id === proId) {
        onePro = el;
      }
    }
    return onePro;
  },

  selectedItemID: state => {
    return store.state.sidebarItemSelection[store.state.currentTabIndex];
  },

  isFocus: state => {
    return store.state.mainFocused;
  },

  // getProjectFromTasks: state => {
  //   return store.state.sidebarItemSelection[store.state.currentTabIndex - 1];
  // }
};

export default {
  getters,
};
