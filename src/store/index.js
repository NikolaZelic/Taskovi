import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import modulesidebar from './modules/sidebar';
import modulefeed from './modules/feed';
import modulework from "./modules/work";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    mutations,
    actions,
    getters,
    modulesidebar,
    modulefeed,
    modulework
  },
  strict: true,
  state: {
    userStorage: {
      name: undefined,
      surname: undefined,
      email: undefined,
      // sid: undefined
    },
    globalFeed: false,
    currentTabIndex: 0,
    mainFocused: false,
    sidebarTabData: [],
    sidebarItemSelection: [],
    darkTheme: false,
    dirtyCounterForSidebar: 0,
    notificationCount: undefined,
    taskLinked: false,
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
      addStep: false
    },
    refreshGlobalFeed: false,
    lastLink: undefined,
  },
});
