import Vue from 'vue';
import Vuex from 'vuex';
import {
  api
} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
    // Left side bar
    leftSideBarContent: [ [],[],[],[],[] ]
  },
  getters: {

  },
  mutations: {
    setLeftSideBarContent: (state, params) => {
      state.leftSideBarContent[params.index] = params.data;
      console.log(state.leftSideBarContent);
    }
  },
  actions: {
    getUserProjects() {
      api.getUserProjects();
    },
    getUserTasks(commit, params) {
      api.getUserTasks(params.index, params.state, params.type, params.archived);
    }
  }
})
