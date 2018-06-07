import {api} from '@/api/index.js';
import {store} from '../index';
const actions = {
  readeFeeds(commit, params) {
    api.readeFeeds(params.taskid, params.fedid, params.direction).then(response => {
      store.commit('addMessages', {
        'direction': params.direction,
        'data': response.data.data
      })
    });
  },

  postMessage(commit, params) {
    api.postMessage(params.taskid, params.text).then(response => {
      // KORISTI GETTER UMESTO DIREKTNO STORE
      console.log("Dolazi ovde");
      var msg = store.state.messages;
      if (msg.length === 0) {
        this.readeFeeds(params.tasid, 0, 'start');
      } else {
        this.readeFeeds(params.tasid, msg[msg.length - 1].fed_id, 'down');
      }
    });
  },
}

const mutations = {
  addMessages: (state, params) => {
    if(params.data){
      if (params.direction === 'start') {
        store.state.messages = params.data;
      } else if (params.direction === 'up') {
        params.data.forEach(e => store.state.messages.unshift(e));
      } else if (params.direction === 'down') {
        if (params.data != undefined)
          params.data.forEach(e => store.state.messages.push(e));
      }
    }
  }
}

export default {
  actions,
  mutations,
}
