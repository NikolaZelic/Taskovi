import {api} from '@/api/index.js';
import {store} from './index';
const actions = {

  // by Zelic - koristi se u TeamAdd
  cleanSuggestions(commit, params){
    store.commit('cleanSuggestions');
  },

  // by Zelic - poziva se u TeamAdd
<<<<<<< HEAD
  selectUsersCompanies(commit, params) {
=======
  selectUsersCompanies(comit, params){
>>>>>>> 522e38c3f835fd5bfdc41d3cc635a1967327b0ad
    api.getUserCompanies().
    then( result => {
      store.commit( 'setUSersCompanies', {r:result.data} );
    } );
  },

  // by Zelic - poziva se u TeamAdd
  refreshSuggestions(commit, params){
     var searchText = params.searchText;
     var comId = params.comId;
     api.refreshSuggestions(searchText,comId).
     then( result => {
       store.commit('setSuggestions', result);
     } );
  },

  selectTask(commit, params){
    console.log('Select task = ' + params.id);
    api.selectTask(params.id);
  },
}

export default {
  actions,
}
