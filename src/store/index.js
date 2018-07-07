import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import modulesidebar from './modules/sidebar';
import modulefeed from './modules/feed';
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
    modulefeed,
    moduleproject,
    moduletask,
    modulework,
    moduleuser,
  },
  strict: true,
  state: {
    currentTabIndex: undefined,
    mainFocused: false,
    sidebarTabData: [],
    sidebarItemSelection: [],
    darkTheme: false,
    modalStatus: {
      active: false,
      ok: true,
      message: '',
    },
    modalError: {
      active: false,
      message: '',
    },
    itemAction: {
      edit: undefined,
      add: undefined,
      addTask: undefined
    },
  },
});
