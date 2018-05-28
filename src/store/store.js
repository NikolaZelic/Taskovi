import Vue from 'vue';
import Vuex from 'vuex';
import {
  api
} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
    // user: {
    //   name: "Peraaa",
    //   surname: "Perrric"
    // },
    sidebarTabData: [
      [],
      [],
      [],
      [],
      []
    ],
    messages: [],
    // COMMUNICATION
    sidebarSelection: {
      selectedTaskID: 1,
    },

  },
  getters: {
    getMessages: state => {
      return state.messages;
    },

    currentTabArray: state => index => {
      // console.log(state.sidebarTabData.filter(tab => true));
      return state.sidebarTabData[index];
      // return state.sidebarTabData.filter(tab => state.sidebarTabData.indexOf(tab) === 0);
    },

    selectedTaskID: state => {
      return state.sidebarSelection.selectedTaskID;
    }
  },

  mutations: {
    setSidebarData: (state, params) => {
      state.sidebarTabData[params.index] = params.data;
      // console.log( state.sideBarContent );
    },

    addMessages: (state, params) => {
      if (params.direction === 'start') {
        state.messages = params.data;
      } else if (params.direction === 'up') {
        params.data.forEach(e => state.messages.unshift(e));
      } else if (params.direction === 'down') {
        if (params.data != undefined)
          params.data.forEach(e => state.messages.push(e));
      }
    },

    changeSidebarSelection: (state, params) => {
      // console.log(params.selectedTaskID);
      if (params.selectedTaskID !== undefined) {
        state.sidebarSelection.selectedTaskID = params.selectedTaskID;
        // console.log('id u storu '+state.sidebarSelection.selectedTaskID);
      }
    }
  },

  actions: {
    getUserProjects() {
      api.getUserProjects();
    },

    getUserTasks(commit, params) {
      api.getUserTasks(params.index, params.state, params.type, params.archived);
    },

    getUserCompanies(commit, params) {
      api.getUserCompanies(params.index);
    },

    getUserTeams(commit, params) {
      api.getUserTeams(params.index);
    },

    readeFeeds(commit, params) {
      api.readeFeeds(params.taskid, params.fedid, params.direction);
    },

    postMessage(commit, params) {
      api.postMessage(params.taskid, params.text);
    }
  }
})
