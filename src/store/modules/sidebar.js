import {api} from '@/api/index.js';
import {store} from '../index';
const actions = {
  getUserWork(commit, params) {
    api.getUserWork(params.index, params.state, params.type, params.archived).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    }).catch(error => {
      console.log('Greska pri ucitavanju podataka: ' + error);
    });
  },

  getUserCompanies(commit, params) {
    api.getUserCompanies(params.admin).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    });
  },

  getUserTeams(commit, params) {
    api.getUserTeams(params.index, params.comid).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
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

}
const mutations = {
  setSidebarData: (state, params) => {
    if (params.data !== undefined)
      store.state.sidebarTabData[params.index] = params.data;
    store.state.currentTabIndex = -1;
    store.state.currentTabIndex = params.index;
    store.state.editItem = undefined;
    store.state.addItem = false;
  },

  setSidebarItemSelection: (state, params) => {
    store.state.sidebarItemSelection[params.index] = params.id;
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

  itemAddClick: (state, params) => {
    store.state.itemAction.edit = undefined;
    store.state.itemAction.add = 1;
  },

  itemEditClick: (state, params) => {
    store.state.itemAction.edit = params.id;
  },
}
// const getters = {
//
// }
export default {
  actions,
  mutations,
  // getters,
}
