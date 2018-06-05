import {
  store
} from './index';
const mutations = {

  itemAddClick: (state, params) => {
    store.state.addItem = true;
  },

  itemEditClick: (state, params) => {
    store.state.editItem = params.id;
  },

  // by Zelic - Poziva se iz actions/refreshSuggestions. Sluzi u TeamAdd.vue
  setSuggestions: (state, params) => {
    // console.log(params.data.data);
    store.state.suggestedUsers = params.data.data;
  },

  // by Zelic - korisceno u TeamAdd.
  setUsersCompanies: (state, params) => {
    store.state.usersCompanies = params.r.data;
  },

  setSidebarData: (state, params) => {
    if (params.data !== undefined)
      store.state.sidebarTabData[params.index] = params.data;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    store.state.editItem = undefined;
    store.state.addItem = false;
  },

  addMessages: (state, params) => {
    if (params.direction === 'start') {
      store.state.messages = params.data;
    } else if (params.direction === 'up') {
      params.data.forEach(e => store.state.messages.unshift(e));
    } else if (params.direction === 'down') {
      if (params.data != undefined)
        params.data.forEach(e => store.state.messages.push(e));
    }
  },

  changeSidebarSelection: (state, params) => {
    store.state.sidebarSelection[params.index] = params.id;
    store.state.editItem = undefined;
    store.state.addItem = false;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    // IMPROVE API - ZELIC
    if (params.index === 1) {
      store.dispatch('selectTask', {
        id: params.id
      })
    }
  },

  // by nzelic
  changeSelectedTask: (state, params) => {
    console.log('Change selected task');
    console.log(params.selectedTask);
    store.state.selectedTask = params.selectedTask;
    // console.log(state.selectedTask);
  },
}

export default {
  mutations,
}
