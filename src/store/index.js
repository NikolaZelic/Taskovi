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
import moduleuser from './modules/user';

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
    moduleuser,
  },
  strict: true,
  state: {
    currentTabIndex: undefined,
    mainFocused: undefined,
    sidebarTabData: [],
    sidebarItemSelection: [],
    modalError: {
      active: false,
      message: '',
    },
    itemAction: {
      edit: undefined,
      add: undefined,
    },
    // companyID: undefined,
    // messages: [],
  },
});
