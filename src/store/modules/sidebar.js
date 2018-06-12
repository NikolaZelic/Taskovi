import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const actions = {
  getUserWork(commit, params) {
    api.getUserWork(params.index, params.state, params.type, params.archived).then(r => {
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

  getUserCompanies(commit, params) {
    api.getUserCompanies(params.admin).then(r => {
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

  getUserTeams(commit, params) {
    api.getUserTeams(params.index, params.admin).then(r => {
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

  itemAddClick(commit, params) {
    store.commit('itemAddClick');
  },

  itemEditClick(commit, params) {
    store.commit('itemEditClick', {
      id: params.id,
    });
  },

};
const mutations = {
  setSidebarData: (state, params) => {
    if (params.data !== undefined)
      store.state.sidebarTabData[params.index] = params.data;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
  },

  setSidebarItemSelection: (state, params) => {
    store.state.sidebarItemSelection[params.index] = params.id;
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = undefined;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    // ZELIC - REMOVE IF NOT NEEDED
    // if (params.index === 1) {
    //   store.dispatch('selectTask', {
    //     id: params.id
    //   })
    // }
  },

  itemAddClick: (state, params) => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = 1;
  },

  itemEditClick: (state, params) => {
    store.state.itemAction.add = undefined;
    store.state.itemAction.edit = params.id;
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
