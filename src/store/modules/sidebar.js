import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const actions = {
  // API
  getProjects(commit, params) {
    api.getProjects(params).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    }).catch(e => {
      store.commit("modalError", {
        message: '' + e,
      });
    });
  },

  getTasks(commit, params) {
    api.getTasks(params).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    }).catch(e => {
      store.commit("modalError", {
        message: '' + e,
      });
    });
  },

  // STORE
  itemEditClick(commit, params) {
    store.commit('itemEditClick', {
      id: params,
    });
  },
  itemAddClick() {
    store.commit('itemAddClick');
  },
  itemAddTaskClick(commit, params) {
    store.commit('itemAddTaskClick', {
      id: params.id,
    });
  },

  itemActionReset() {
    store.commit('itemActionReset');
  },

  resetTaskView() {
    store.commit('resetTaskView');
  },
};
const mutations = {
  setSidebarData: (state, params) => {
    if (params.data !== undefined) {
      if (params.parentIndex !== undefined && params.parentIndex !== null) {
        store.state.sidebarTabData[params.index][params.parentindex].tasks = params.data;
      } else {
        store.state.sidebarTabData[params.index] = params.data;
      }
    }
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addTask = undefined;
  },
  setSidebarItemSelection: (state, params) => {
    store.state.sidebarItemSelection[params.index] = params.id;
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addTask = undefined;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    store.state.sidebarItemSelection = store.state.sidebarItemSelection; // Ovo stvarno radi !!!
  },
  itemEditClick: (state, params) => {
    store.state.itemAction.edit = params.id;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addTask = undefined;
  },


  itemAddClick: () => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = 1;
    store.state.itemAction.addTask = undefined;
  },
  itemAddTaskClick: (state, params) => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addTask = params.id;
  },
  itemActionReset: () => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addTask = undefined;
    store.state.itemAction.addStep = false;
    store.state.mainFocused = false;
  },

  resetTaskView: () => {
    store.state.sidebarItemSelection[1] = undefined;
    let ci = store.state.currentTabIndex;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = ci;
  },
  // resetSidebarData: () => {
  //   store.state.sidebarTabData = [];
  // },
  showGlobalFeed: (state, params) => {
    store.state.globalFeed = params;
  },
  darkTheme: (state, params) => {
    store.state.darkTheme = params;
  },
  mainFocused: (state, params) => {
    store.state.mainFocused = params;
  },
};
// const getters = {
//
// }
export default {
  actions,
  mutations,
  // getters,
};
