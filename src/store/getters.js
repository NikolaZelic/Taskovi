import {
  store
} from './index';
const getters = {
  // ZELIC IMPROVE
  getSelectedTask: state => {
    return store.state.selectedTask;
  },

  getTabIndex: state => {
    return store.state.currentTabIndex;
  },

  currentTabArray: state => {
    return store.state.sidebarTabData[store.state.currentTabIndex];
  },

  getUsersCompanies: state => {
    console.log( store.state.sidebarTabData[3].length );
    return store.state.sidebarTabData;
  },

  selectedItemID: state => {
    return store.state.sidebarItemSelection[store.state.currentTabIndex];
  },

  itemAdded: state => {
    return store.state.itemAction.add;
  },

  getEditItemID: state => {
    return store.state.itemAction.edit;
  },

  // by Zelic - korisceno u TeamAdd
  getSuggestedUsers: state => {
    return store.state.suggestedUsers;
  },

  // by Zelic - korisceno u TeamAdd.
  // getUsersCompanies: state => {
  //   return store.state.usersCompanies;
  // },

  getMessages: state => {
    return store.state.messages;
  },
}

export default {
  getters,
}
