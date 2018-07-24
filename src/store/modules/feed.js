import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const actions = {
  readeFeeds(commit, params) {
    return api.readeFeeds(params.taskid, params.fedid, params.direction, params.type, params.searchingstring, params.fed_important ).then(response => {
      store.commit('addMessages', {
        'direction': params.direction,
        'data': response.data.data
      });
      return response;
    });
  },
  readeGloablFeeds(commit, params) {
    return api.readeGloablFeeds(params.offset, params.type, params.searchingstring, params.fed_important );
  },

  postMessage(commit, params) {
    api.postMessage(params.taskid, params.text).then(response => {
      // KORISTI GETTER UMESTO DIREKTNO STORE
      // console.log("Dolazi ovde");
      var msg = state.messages;
      if (msg.length === 0) {
        store.dispatch("readeFeeds", {
          taskid: params.taskid,
          fedid: 0,
          direction: "start"
        });
      } else {
        store.dispatch("readeFeeds", {
          taskid: params.taskid,
          fedid: msg[msg.length - 1].fed_id,
          direction: "down"
        });
      }
    });
  },
  sendAttach(commit, params) {
    api.sendAttach(params.taskid, params.file).then(response => {
        //For refresh new messages
        var msg = state.messages;
        if (msg.length === 0) {
          store.dispatch("readeFeeds", {
            taskid: params.taskid,
            fedid: 0,
            direction: "start"
          });
        } else {
          store.dispatch("readeFeeds", {
            taskid: params.taskid,
            fedid: msg[msg.length - 1].fed_id,
            direction: "down"
          });
        }
      })
      .catch(err => {
        console.log("Error kod slanja fajla");
      });
  }
}

const mutations = {
  setSearchFeedParams: (state, params) => {
    state.searchFeedsParams = params;
  },

  addMessages: (state, params) => {
    if (params.data) {
      if (params.direction === 'start') {
        state.scrollDownMess = true;
        state.messages = params.data;
      } else if (params.direction === 'up') {
        state.scrollDownMess = false;
        // params.data.forEach(e => state.messages.unshift(e) ); 
        for(var i = params.data.length-1; i>=0; i--){
          state.messages.unshift(params.data[i]);
        }
      } else if (params.direction === 'down') {
        state.scrollDownMess = true;
        if (params.data != undefined)
          params.data.forEach(e => state.messages.push(e));
      }
    }
  },
  clearFeed: (state) => {
    state.messages = [];
  },
  changeImportant: (state, params) => {
    var fed_id = params.mess.fed_id;
    for(var i in state.messages){
      var message = state.messages[i];
      if(message.fed_id == fed_id){
        message.fed_important = !message.fed_important;
        api.setFeedImportant(message.fed_id, message.fed_important);
      }
    }
  },
}
const getters = {

}

const state = {
  messages: [],
  scrollDownMess: true,
  searchFeedsParams: null,
}

export default {
  actions,
  mutations,
  getters,
  state
}
