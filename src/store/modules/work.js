import {api} from '@/api/index.js';
import {store} from '../index';
// PISI OVDE AKO JE VUEX ZAJEDNICKI ZA MAIN CONTENT
const state = {
  selectedTask: {},
  // by Zelic - korisceno u TeamAdd
  suggestedUsers: [],
  // by Zelic - korisceno u: TaskAdd.vue
  suggestedTeams: [],
  // by Zelic - korisceno u ParanttaskAdd.vue
  suggestedTags: [],
  // by Zelic - korisceno u TaskAdd.vue
  suggestedProjects: [],
}
const actions = {
  // by Zelic - koristi se u TaskAdd.vue
  suggestTags(commit, params){
    api.suggestTags(params.pro_id, params.tagFor, params.searchStr).
    then( result => {
      // console.log(result.data.data);
      store.commit('setSuggestedTags', {suggestions: result.data.data} );
    } );
  },

  // by Zelic - koristi se u TeamAdd
  cleanSuggestions(commit, params){
    store.commit('cleanSuggestions');
  },
  // by Zelic
  cleanSuggestedTeams(commit, params){
    store.commit('cleaneSuggestedTeams');
  },
  cleanSuggestedTags(commit, params){
    store.commit('cleaneSuggestedTags');
  },
  // by Zelic - poziva se u TeamAdd
  // selectUsersCompanies(commit, params) {
  //   api.getUserCompanies().
  //   then( result => {
  //     console.log(result);
  //     store.commit( 'setUsersCompanies', {r:result.data} );
  //   } );
  // },
  clleaneSuggestedProjects(commit, params){
    store.commit('cleaneSuggestedProjects');
  },
  // by Zelic - poziva se u TeamAdd
  refreshSuggestions(commit, params){
    // console.log('Action');
     var searchText = params.searchText;
     var pro_id = params.pro_id;
     api.refreshSuggestions(searchText, pro_id).
     then( result => {
       store.commit('setSuggestions', result);
     } );
  },

  // by Zelic - kotsiti se u TaskAdd.vue
  suggestTeams(commit, params){
    api.suggestGroup('team', params.searchStr, params.comId).
    then( result => {
      store.commit('setSuggestedTeams', result) ;
    } );
  },

  // by Zelic - korisceno u TaskAdd.vue
  suggestProjects(commit, params){
    api.suggestGroup('project', params.searchStr, params.comId).
    then( result => {
      store.commit('setSuggestedProjects', result) ;
    } );
  },

  selectTask(commit, params){
    console.log('Select task = ' + params.id);
    api.selectTask(params.id);
  },
}

const mutations = {

  // by Zelic
  setSuggestedTeams: (state, params) => {
    state.suggestedTeams = params.data.data;
  },

  cleaneSuggestedTeams: (state, params) => {
    state.suggestedTeams = [];
  },

  cleaneSuggestedProjects: (state, params) => {
    state.suggestedProjects = [];
  },
  // by Zelic
  setSuggestedTags: (state, params) => {
    state.suggestedTags = params.suggestions;
  },
  cleaneSuggestedTags: (state, params) => {
    state.suggestedTags = [];
  },
  // by Zelic - koristi se u TeamAdd-u
  cleanSuggestions: (state, params) => {
    state.suggestedUsers = [];
  },

  // by Zelic - Poziva se iz actions/refreshSuggestions. Sluzi u TeamAdd.vue
  setSuggestions: (state, params) => {
    // console.log(params.data.data);
    state.suggestedUsers = params.data.data;
  },

  // by Zelic - Korisyi se u TaskAdd.vue
  setSuggestedProjects: (state, params) => {
    state.suggestedProjects = params.data.data;
  },

  // by Zelic - korisceno u TeamAdd.
  // setUsersCompanies: (state, params) => {
  //   store.state.usersCompanies = params.r.data;
  // },

  // by Zelic
  changeSelectedTask: (state, params) => {
    // console.log('Change selected task');
    // console.log(params.selectedTask);
    store.state.selectedTask = params.selectedTask;
    // console.log(state.selectedTask);
  },
}

const getters = {
  getSelectedTask: state => {
    return store.state.selectedTask;
  },

  // by Zelic - korisceno u TeamAdd
  getSuggestedUsers: state => {
    return state.suggestedUsers;
  },

  // by Zelic
  getSuggestedTeams: state => {
    return state.suggestedTeams;
  },

}
export default {
  actions,
  mutations,
  getters,
  state
}
