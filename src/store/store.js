import Vue from 'vue';
import Vuex from 'vuex';
import {
  api
} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
    // Left sidebar
    activeTabData : [["sdsdsd"],["bbbbbbbbbb"]],
    leftSidebarTabData: [ [],[],[],[],[] ]
  },
  getters: {
    currentTabArray: state => index => {
      // console.log(state.leftSidebarTabData.filter(tab => true));
      return state.leftSidebarTabData[index];
      // return state.leftSidebarTabData.filter(tab => state.leftSidebarTabData.indexOf(tab) === 0);
    }
  },
  mutations: {
    setLeftSideBarContent: (state, params) => {
      state.leftSidebarTabData[params.index] = params.data;
      console.log(state.leftSidebarTabData[0].length+","+state.leftSidebarTabData[1].length+','+state.leftSidebarTabData[2].length);
      // console.log(store.getters.currentTabArray[0].length);
    }
  },
  actions: {
    getUserProjects() {
      api.getUserProjects();
    },
    getUserTasks(commit, params) {
      api.getUserTasks(params.index, params.state, params.type, params.archived);
    }
  },
})
