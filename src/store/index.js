import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import modulesidebar from './modules/sidebar';
import modulechat from './modules/chat';
import modulecompany from './modules/company';
import moduleteam from './modules/team';
import moduleproject from './modules/project';
import moduletask from './modules/task';
import modulework from './modules/work';
import {api} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    mutations,
    actions,
    getters,
    modulesidebar,
    modulechat,
    modulecompany,
    moduleteam,
    moduleproject,
    moduletask,
    modulework,
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
    sidebarItemSelection: [],
    itemAction : {
      edit: undefined,
      add: undefined,
    },
    // COMMUNICATION
    selectedTask: {},
    // by Zelic - korisceno u TeamAdd
    suggestedUsers: [],
    // by Zelic - korisceno u TeamAdd. Ovo bi moglo da se koristi i u drugim komponentama, mozda cak i u SideBar-u
    usersCompanies: undefined,
  },
  getters: {

    // by Zelic - korisceno u TeamAdd.
    getUsersCompanies: state => {
      return state.usersCompanies;
    },

    // by Zelic - korisceno u TeamAdd
    getSuggestedUsers: state => {
      return state.suggestedUsers;
    },

    getSelectedTask: state => {
      return state.selectedTask;
    },
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
      // console.log(state.sidebarTabData[i]);
      // console.log(state.sidebarTabData.filter(tab => true));
      return state.sidebarTabData[i];
      // return state.sidebarTabData.filter(tab => state.sidebarTabData.indexOf(tab) === 0);
    },

    getSuggestedUsers: state => {
      return state.suggestedUsers;
    },

    selectedItemID: state => {
      return state.sidebarSelection[state.currentTabIndex];
    },
  },

})
