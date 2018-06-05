import {store} from './index';
const mutations = {

  // by Zelic - koristi se u TeamAdd-u
  cleanSuggestions: (state, params) => {
    store.state.suggestedUsers = [];
  },

  // by Zelic - Poziva se iz actions/refreshSuggestions. Sluzi u TeamAdd.vue
  setSuggestions: (state, params) => {
    // console.log(params.data.data);
    store.state.suggestedUsers = params.data.data;
  },

  // by Zelic - korisceno u TeamAdd.
<<<<<<< HEAD
  setUsersCompanies: (state, params) => {
    store.state.usersCompanies = params.r.data;
=======
  setUSersCompanies: (state, params) => {
     store.state.usersCompanies = params.r.data;
>>>>>>> 522e38c3f835fd5bfdc41d3cc635a1967327b0ad
  },

  // by nzelic
  changeSelectedTask: (state, params) => {
    console.log('Change selected task');
    console.log(params.selectedTask);
    store.state.selectedTask = params.selectedTask;
    // console.log(state.selectedTask);
  },
}

export default {
  mutations,
}
