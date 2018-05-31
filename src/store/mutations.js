import {
  store
} from './index';
const mutations = {
  setSidebarData: (state, params) => {
    store.state.sidebarTabData[params.index] = params.data;
    // console.log( state.sideBarContent );
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
    if (params.selectedTaskID !== undefined) {
      store.state.sidebarSelection.selectedTaskID = params.selectedTaskID;
    }
  },
}

export default {
  mutations,
}
