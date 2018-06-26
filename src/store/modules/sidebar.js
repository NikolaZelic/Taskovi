import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const actions = {
  getUserTasks(commit, params) {
    api.getUserTasks(params.index, params.state, params.type, params.archived, params.parentIndex).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        parentindex: params.parentIndex,
        data: r.data.data
      });
    }).catch(e => {
      store.commit("modalError", {
        active: true,
        message: '' + e,
      });
    });
  },

  getUserProjects(commit, params) {
    api.getUserProjects(params).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    }).catch(e => {
      store.commit("modalError", {
        active: true,
        message: '' + e,
      });
    });
  },

  getUserTaskList(commit, params) {
    api.getUserTaskList(params).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    }).catch(e => {
      store.commit("modalError", {
        active: true,
        message: '' + e,
      });
    });
  },

  // getUserTeams(commit, params) {
  //   api.getUserTeams(params.index, params.admin).then(r => {
  //     store.commit('setSidebarData', {
  //       index: params.index,
  //       data: r.data.data
  //     });
  //   }).catch(e => {
  //     store.commit("modalError", {
  //       active: true,
  //       message: '' + e,
  //     });
  //   });
  // },
  itemEditClick(commit, params) {
    store.commit('itemEditClick', {
      id: params.id,
    });
  },
  itemAddClick(commit, params) {
    store.commit('itemAddClick');
  },
  itemAddTaskClick(commit, params) {
    store.commit('itemAddTaskClick', {
      id: params.id,
    });
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
  itemAddClick: (state, params) => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = 1;
    store.state.itemAction.addTask = undefined;
  },
  itemAddTaskClick: (state, params) => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addTask = params.id;
  },
  itemActionReset: (state, params) => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.itemAction.addTask = undefined;
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
