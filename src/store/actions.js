import {api} from '@/api/index.js';
import {store} from './index';
const actions = {

  // by Zelic - koristi se u TeamAdd
  cleanSuggestions(commit, params){
    store.commit('cleanSuggestions');
  },

  // by Zelic - poziva se u TeamAdd
  // selectUsersCompanies(commit, params) {
  //   api.getUserCompanies().
  //   then( result => {
  //     console.log(result);
  //     store.commit( 'setUsersCompanies', {r:result.data} );
  //   } );
  // },

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
