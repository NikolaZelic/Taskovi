import {store} from './index';
const getters = {
  getSelectedTask: state => {
    return store.state.selectedTask;
  },

  getTabIndex: state => {
    return store.state.currentTabIndex;
  },

  currentTabArray: state => {
    return store.state.sidebarTabData[store.state.currentTabIndex];
  },

  selectedItemID: state => {
    return store.state.sidebarSelection[store.state.currentTabIndex];
  },

  getSuggestedUsers: state => {
    return store.state.suggestedUsers;
  },

  getMessages: state => {
    return store.state.messages;
  },
}

export default {
  getters,
}
