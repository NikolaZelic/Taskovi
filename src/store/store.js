import Vue from 'vue';
import Vuex from 'vuex';
import {
  api
} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
// LEFT SIDE BAR CONTENT
    leftSidebarTabData:  [ [],[],[],[],[] ],
// RIGHT SIDE BAR CONTENT
    messages: [],
// COMMUNICATION
    leftSideSelection: {
      selectedTaskID: 1,
    },

  },
  getters: {
    getMessages: state => {
      return state.messages;
    },

    currentTabArray: state => index => {
      // console.log(state.leftSidebarTabData.filter(tab => true));
      return state.leftSidebarTabData[index];
      // return state.leftSidebarTabData.filter(tab => state.leftSidebarTabData.indexOf(tab) === 0);
    },

    selectedTaskID: state => {
      return state.leftSideSelection.selectedTaskID;
    }
  },

  mutations: {
    setLeftSidebarTabData: (state, params) => {
      state.leftSidebarTabData[params.index] = params.data;
      // console.log( state.leftSideBarContent );
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

    changeLeftSideSelection: (state, params) => {
        // console.log(params.selectedTaskID);
        if( params.selectedTaskID !== undefined ){
          state.leftSideSelection.selectedTaskID = params.selectedTaskID;
          // console.log('id u storu '+state.leftSideSelection.selectedTaskID);
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

    readeFeeds(commit, params) {
      api.readeFeeds(params.taskid, params.fedid, params.direction);
    },

    postMessage(commit, params) {
      api.postMessage(params.taskid, params.text);
    }
  }
})
