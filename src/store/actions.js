
import {api} from '@/api/index.js';
import {store} from './index';
const actions = {

  selectTask(commit, params){
    console.log('Select task = ' + params.id);
    api.selectTask(params.id);
  },

  getUserWork(commit, params) {
    api.getUserWork(params.index, params.state, params.type, params.archived).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    })
  },

  getUserCompanies(commit, params) {
    api.getUserCompanies(params.index).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    });
  },

  getUserTeams(commit, params) {
    api.getUserTeams(params.index).then(r => {
      store.commit('setSidebarData', {
        index: params.index,
        data: r.data.data
      });
    });
  },

  readeFeeds(commit, params) {
    api.readeFeeds(params.taskid, params.fedid, params.direction).then(response => {
      store.commit('addMessages', {
        'direction': direction,
        'data': response.data.data
      })
    });
  },

  postMessage(commit, params) {
    api.postMessage(params.taskid, params.text).then(response => {
      var msg = store.state.messages;
      if (msg.length === 0) {
        this.readeFeeds(tasid, 0, 'start');
      } else {
        this.readeFeeds(tasid, msg[msg.length - 1].fed_id, 'down');
      }
    });
  },
}

export default {
  actions,
}
