import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import {
  api
} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    mutations,
    actions,
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
    getTabIndex: state => {
      return state.currentTabIndex;
    },

    getMessages: state => {
      return state.messages;
    },

    currentTabArray: state => {
      let i = state.currentTabIndex;
      // if (state.sidebarTabData[i].length === 0) {
      //   console.log("NULLL");
      //   return null;
      // }
      console.log(state.sidebarTabData[i]);
      // console.log(state.sidebarTabData.filter(tab => true));
      return state.sidebarTabData[i];
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
})
