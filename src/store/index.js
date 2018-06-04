import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import {api} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    mutations,
    actions,
    getters,
  },
  strict: true,
  state: {
    currentTabIndex: undefined,
    sidebarTabData: [
      [],
      [],
      [],
      [],
      []
    ],
    messages: [],
    sidebarSelection: [],
    editTask: undefined,
    // COMMUNICATION
    selectedTask: {},
    // by Zelic - korisceno u TeamAdd
    suggestedUsers: [],
    // by Zelic - korisceno u TeamAdd. Ovo bi moglo da se koristi i u drugim komponentama, mozda cak i u SideBar-u
    usersCompanies: undefined,
  },
})
