import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import {
  api
} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules:{
    mutations,
    actions,
  },
  strict: true,
  state: {
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
      selectedCompanyID: -1,
      selectedTeamsID: undefined,
    },

    suggestedUsers: [{
        name: 'Nikola',
        surname: "Zelic",
        email: "nzelic@ymail.com"
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

    getSuggestedUsers: state => {
      return state.suggestedUsers;
    }

  },
})
