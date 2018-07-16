import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const actions = {
  readeFeeds(commit, params) {
    api.readeFeeds(params.taskid, params.fedid, params.direction).then(response => {
      store.commit('addMessages', {
        'direction': params.direction,
        'data': response.data.data
      });
    });
  },

  postMessage(commit, params) {
    api.postMessage(params.taskid, params.text).then(response => {
      // KORISTI GETTER UMESTO DIREKTNO STORE
      console.log("Dolazi ovde");
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
  addMessages: (state, params) => {
    // console.log( document.querySelectorAll(".selektor") );
    if (params.data) {
      if (params.direction === 'start') {
        state.scrollDownMess = true;
        state.messages = params.data;
      } else if (params.direction === 'up') {
        state.scrollDownMess = false;
        params.data.forEach(e => state.messages.unshift(e));
        if (params.data.length) {
          var a = document.querySelectorAll(".selektor")[9];
          if(a!==undefined)
            a.scrollIntoView(true);
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
  }
}
const getters = {

}

const state = {
  messages: [],
  scrollDownMess: true,
}

export default {
  actions,
  mutations,
  getters,
  state
}
