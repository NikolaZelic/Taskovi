import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
import {library} from "@/assets/js/library.js";

const actions = {
  readeFeeds(commit, params) {
    return api.readeFeeds(params.taskid, params.fedid, params.direction, params.type, params.searchingstring, params.fed_important, params.fedtime, params.impbyoth ).then(response => {
      store.commit('addMessages', {
        'direction': params.direction,
        'data': response.data.data
      });
      return response;
    });
  },
  readeGloablFeeds(commit, params) {
    return api.readeGloablFeeds(params.offset, params.type, params.searchingstring, params.fed_important, params.impbyoth);
  },

  // postMessage(commit, params) {
  //   api.postMessage(params.taskid, params.text).then(r => {
  //     // KORISTI GETTER UMESTO DIREKTNO STORE
  //     var msg = state.messages;
  //     if (msg.length === 0) {
  //       store.dispatch("readeFeeds", {
  //         taskid: params.taskid,
  //         fedid: 0,
  //         direction: "start"
  //       });
  //     } else {
  //       store.dispatch("readeFeeds", {
  //         taskid: params.taskid,
  //         fedid: msg[msg.length - 1].fed_id,
  //         direction: "down"
  //       });
  //     }
  //   });
  // },
  sendAttach(commit, params) {
    api.sendAttach(params.taskid, params.file).then(r => {
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
      .catch(e => {
        // store.commit("modalError", {
        //   message: "Error while sending file: " + e
        // });
      });
  }
};

const mutations = {
  // setSearchFeedParams: (state, params) => {
  //   state.searchFeedsParams = params;
  // },

  addMessages: (state, params) => {
    // console.log(params);
    if (params.data) {
      if (params.direction === 'start') {
        state.scrollDownMess = true;
        state.messages = params.data;
      } else if (params.direction === 'up') {
        state.scrollDownMess = false;
        // params.data.forEach(e => state.messages.unshift(e) ); 
        for(var i = params.data.length-1; i>=0; i--){
          if( !library.messagesHaveFeed(state.messages, params.data[i]) )
            state.messages.unshift(params.data[i]);
        }
      } else if (params.direction === 'down') {
        state.scrollDownMess = true;
        if (params.data != undefined)
          for(let i=0; i<params.data,length; i++){
            if( !library.messagesHaveFeed(state.messages, params.data[i]) )
              state.messages.push(params.data[i]);
          }
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
  setSelectedStep: (state, params) => {
    state.selectedStep = params;
  },
}
const getters = {
}

const state = {
  messages: [],
  scrollDownMess: true,
  // searchFeedsParams: null,
  selectedStep: null,
}

export default {
  actions,
  mutations,
  getters,
  state
}
