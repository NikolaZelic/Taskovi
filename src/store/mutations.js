import {
  store
} from './index';

const mutations = {
  setSidebarData: (state, params) => {
    store.state.sidebarTabData[params.index] = params.data;
  },

  setCurrentTabIndex: (state, params) => {
    store.state.currentTabIndex = params;
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
    if (params.selectedProjectID !== undefined) {
      store.state.sidebarSelection.selectedProjectID = params.selectedProjectID;
    }
    if (params.selectedTaskID !== undefined) {
      store.state.sidebarSelection.selectedTaskID = params.selectedTaskID;
    }
    if (params.selectedBugFixID !== undefined) {
      store.state.sidebarSelection.selectedBugFixID = params.selectedBugFixID;
    }
    if (params.selectedCompanyID !== undefined) {
      store.state.sidebarSelection.selectedCompanyID = params.selectedCompanyID;
    }
    if (params.selectedTeamsID !== undefined) {
      store.state.sidebarSelection.selectedTeamsID = params.selectedTeamsID;
    }
  },
}

export default {
  mutations,
}
