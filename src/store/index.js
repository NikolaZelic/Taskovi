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
    // COMMUNICATION
    selectedTask: {},
    suggestedUsers: [{
        name: 'Zikola',
        surname: "Nelic",
        email: "nzelic@gmail.com"
      },
      {
        name: 'Pera',
        surname: "Peric",
        email: "nzelic@ymail.com"
      },
      {
        name: 'Nikola',
        surname: "Zelic",
        email: "nzelic@ymail.com"
      }
    ],
  },
})
