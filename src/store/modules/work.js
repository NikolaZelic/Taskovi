import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const state = {
  selectedTask: {},
  suggestedUsers: [],
  suggestedTeams: [],
  suggestedTags: [],
  suggestedProjects: [],
};
const actions = {
  suggestTags(commit, params) {
    api.suggestTags(params.pro_id, params.tagFor, params.searchStr).
    then(result => {
      store.commit('setSuggestedTags', {
        suggestions: result.data.data
      });
    });
  },

  cleanSuggestions() {
    store.commit('cleanSuggestions');
  },
  cleanSuggestedTeams() {
    store.commit('cleaneSuggestedTeams');
  },
  cleanSuggestedTags() {
    store.commit('cleaneSuggestedTags');
  },
  cleanSuggestedProjects() {
    store.commit('cleaneSuggestedProjects');
  },
  refreshSuggestions(commit, params) {
    var searchText = params.searchText;
    var pro_id = params.pro_id;
    api.refreshSuggestions(searchText, pro_id).
    then(result => {
      store.commit('setSuggestions', result);
    });
  },
  suggestTeams(commit, params) {
    api.suggestGroup('team', params.searchStr, params.comId).
    then(result => {
      store.commit('setSuggestedTeams', result);
    });
  },
  suggestProjects(commit, params) {
    api.suggestGroup('project', params.searchStr, params.comId).
    then(result => {
      store.commit('setSuggestedProjects', result);
    });
  },

  selectTask(commit, params) {
    api.selectTask(params.id);
  },
};

const mutations = {

  setSuggestedTeams: (state, params) => {
    state.suggestedTeams = params.data.data;
  },
  cleaneSuggestedTeams: () => {
    state.suggestedTeams = [];
  },
  cleaneSuggestedProjects: () => {
    state.suggestedProjects = [];
  },
  setSuggestedTags: (state, params) => {
    state.suggestedTags = params.suggestions;
  },
  cleaneSuggestedTags: () => {
    state.suggestedTags = [];
  },
  cleanSuggestions: () => {
    state.suggestedUsers = [];
  },
  setSuggestions: (state, params) => {
    state.suggestedUsers = params.data.data;
  },

  setSuggestedProjects: (state, params) => {
    state.suggestedProjects = params.data.data;
  },
  changeSelectedTask: (state, params) => {
    store.state.selectedTask = params.selectedTask;
  },
};

const getters = {
  getSelectedTask: () => {
    return store.state.selectedTask;
  },
  getSuggestedUsers: state => {
    return state.suggestedUsers;
  },
  getSuggestedTeams: state => {
    return state.suggestedTeams;
  },

};
export default {
  actions,
  mutations,
  getters,
  state
};
