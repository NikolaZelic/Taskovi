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

  itemAdded: state => {
    return store.state.addItem;
  },

  getEditItemID: state => {
    return store.state.editItem;
  },

  // by Zelic - korisceno u TeamAdd
  getSuggestedUsers: state => {
    return store.state.suggestedUsers;
  },

  // by Zelic - korisceno u TeamAdd.
  getUsersCompanies: state => {
    return store.state.usersCompanies;
  },

  getMessages: state => {
    return store.state.messages;
  },
}

export default {
  getters,
}
