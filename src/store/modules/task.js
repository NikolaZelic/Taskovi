import {api} from '@/api/index.js';
import {store} from '../index';
const actions = {
  // by Zelic - koristi se u ParenttaskAdd.vue
  suggestTags(commit, params){
    api.suggestTags(params.tagFor, params.searchStr).
    then( result => {
      // console.log(result.data.data);
      store.commit('setSuggestedTags', {suggestions: result.data.data} );
    } );
  }
}
const mutations = {
  // by Zelic
  setSuggestedTags: (state, params) => {
    store.state.suggestedTags = params.suggestions;
  },
}
const getters = {
  getSuggestedTags: state => {
    return store.state.suggestedTags;
  }
}
export default {
  actions,
  mutations,
  getters
}
