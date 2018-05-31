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
      selectedProjectID: undefined,
      selectedTaskID: undefined,
      selectedBugFixID: undefined,
      selectedCompanyID: undefined,
      selectedTeamsID: undefined,
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

    selectedProjectID: state => {
      return state.sidebarSelection.selectedProjectID;
    },

    selectedTaskID: state => {
      return state.sidebarSelection.selectedTaskID;
    },
    selectedBugFixID: state => {
      return state.sidebarSelection.selectedBugFixID;
    },
    selectedCompanyID: state => {
      return state.sidebarSelection.selectedCompanyID;
    },
    selectedTeamsID: state => {
      return state.sidebarSelection.selectedTeamsID;
    },
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
      if (params.selectedTaskID !== undefined) {
        state.sidebarSelection.selectedTaskID = params.selectedTaskID;
      }
    },
  },

  actions: {
    getUserProjects() {
      api.getUserProjects().then(r => {
        store.commit('setSidebarData', {
          index: 0,
          data: r.data.data
        });
      });
    },

    getUserTasks(commit, params) {
      api.getUserTasks(params.index, params.state, params.type, params.archived).then(r => {
        store.commit('setSidebarData', {
          index: params.index,
          data: r.data.data
        });
      })
    },

    getUserCompanies(commit, params) {
      api.getUserCompanies(params.index).then(r => {
        store.commit('setSidebarData', {
          index: index,
          data: r.data.data
        });
      });
    },

    getUserTeams(commit, params) {
      api.getUserTeams(params.index).then(r => {
        store.commit('setSidebarData', {
          index: index,
          data: r.data.data
        });
      });
    },

    readeFeeds(commit, params) {
      api.readeFeeds(params.taskid, params.fedid, params.direction).then(response => {
        store.commit('addMessages', {
          'direction': direction,
          'data': response.data.data
        })
      });
    },

    postMessage(commit, params) {
      api.postMessage(params.taskid, params.text).then(response => {
        var msg = store.state.messages;
        if (msg.length === 0) {
          this.readeFeeds(tasid, 0, 'start');
        } else {
          this.readeFeeds(tasid, msg[msg.length - 1].fed_id, 'down');
        }
      });
    },

  }
})
