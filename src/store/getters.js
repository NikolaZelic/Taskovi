import {store} from './index';
const getters = {
  currentTabData: state => {
    return store.state.sidebarTabData[store.state.currentTabIndex];
  },

  selectedItemID: state => {
    return store.state.sidebarItemSelection[store.state.currentTabIndex];
  },
}

export default {
  getters,
}
