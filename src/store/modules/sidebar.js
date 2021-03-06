import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const actions = {
  // API
  getProjectFromTaskID(commit, params) {
    return api.getProjectFromTaskID(params).then(r => {
      if (r === undefined || r.data.data.length !== 1) return;
      store.commit('setSidebarData', {
        tabIndex: 0,
        data: r.data.data
      });
      store.commit("setSidebarItemSelection", {
        tabIndex: 0,
        id: r.data.data[0].id
      });
    });
  },

  getProjectList(commit, params) {
    api.getProjects(params).then(r => {
      store.commit('setSidebarData', {
        tabIndex: params.index,
        data: r.data.data
      });
    });
  },

  getTaskList(commit, params) {
    if (params.pro_id === undefined) {
      let sideData = store.state.sidebarTabData[0];
      if (sideData !== undefined && sideData[0].id !== undefined)
        params.pro_id = store.state.sidebarTabData[0][0].id;
    }
    api.getTasks(params).then(r => {
      if (r !== undefined)
        store.commit('setSidebarData', {
          tabIndex: params.index,
          data: r.data.data
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
  resetGlobalView() {
    store.commit('resetGlobalView');
  }
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
    store.state.currentTabIndex = params;
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
    store.state.mainFocused = false;
  },
  resetActionAdd: () => {
    store.state.itemAction.add = undefined;
  },

  resetActionEdit: () => {
    store.state.itemAction.edit = undefined;
  },

  resetTaskView: () => {
    store.state.sidebarItemSelection[1] = undefined;
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.mainFocused = false;
  },
  incDirtyCounter: () => {
    store.state.dirtyCounterForSidebar++;
  },
  resetGlobalView: () => {
    store.state.sidebarItemSelection = [];
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.mainFocused = false;
  },
  showGlobalFeed: (state, params) => {
    store.state.globalFeed = params;
  },
  setRefreshGlobalFeed: (state, params) => {
    store.state.refreshGlobalFeed = params;
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
