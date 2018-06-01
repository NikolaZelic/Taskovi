import {store} from './index';
const mutations = {
  setSidebarData: (state, params) => {
    if (params.data !== undefined)
      store.state.sidebarTabData[params.index] = params.data;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
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
    // console.log(params);
    store.state.sidebarSelection[params.index] = params.id;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    if (params.index === 1) {
      console.log('Side bar selection');
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
