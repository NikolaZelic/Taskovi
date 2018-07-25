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
        tabIndex: params.index,
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
        tabIndex: params.index,
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
      store.state.sidebarTabData[params.tabIndex] = params.data;
    }
    let i = store.state.currentTabIndex;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = i;
  },
  setSidebarItemSelection: (state, params) => {
    store.state.sidebarItemSelection[params.tabIndex] = params.id;
    // DA LI MI TREBA BRISANJE STATUS DUGMICA - RESETUJE PREGLED?
    let i = store.state.currentTabIndex;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = i;
    store.state.sidebarItemSelection = store.state.sidebarItemSelection; // Ovo stvarno radi !!! // RETEST
  },

  setTabIndex: (state, params) => {
    store.state.currentTabIndex = -1; // MAYBE NOT NEEDED IF ALWAYS INVOKED FROM OTHER TAB ?
    store.state.currentTabIndex = params.tabIndex;
  },

  itemEditClick: (state, params) => {
    store.state.itemAction.edit = params.id;
    store.state.itemAction.add = undefined;
  },
  itemAddClick: () => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = true;
  },
  itemActionReset: () => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addStep = false;
    store.state.mainFocused = false;
  },

  resetTaskView: () => {
    store.state.sidebarItemSelection[1] = undefined;
    let ci = store.state.currentTabIndex;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = ci;
  },
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
export default {
  actions,
  mutations,
};
