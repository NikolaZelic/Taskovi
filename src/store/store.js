import Vue from 'vue';
import Vuex from 'vuex';
import {api} from '@/api/index.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
    // Left side bar
    leftSideBarContent: [ [],[],[],[],[] ],
    messages: [{usr_name:'Nikola',usr_surname:'Zelic',fed_time:'00:00:00',fed_text:'Ovo je kao neka poruka'}]
  },
  getters:{
    getMessages: state => {
      return state.messages;
    }
  },
  mutations:{
      setLeftSideBarContent: (state, params) => {
          state.leftSideBarContent[params.index] = params.data;
          // console.log( state.leftSideBarContent );
      },
      addMessages: (state, params) => {
        if(params.direction==='start'){
          state.messages = params.data;
        }
        else if(params.direction==='up'){
          params.data.forEach( e => state.messages.unshift(e) );
        }
        else if(params.direction==='down'){
          if(params.data!=undefined)
            params.data.forEach( e => state.messages.push(e) );
        }
      },
  },
  actions:{
    getUserProjects(){
        api.getUserProjects();
    },
    getUserTasks(commit, params){
      api.getUserTasks(params.index, params.state, params.type, params.archived);
    },
    readeFeeds(commit, params){
      api.readeFeeds(params.taskid, params.fedid, params.direction);
    },
    postMessage(commit, params){
      api.postMessage(params.taskid, params.text);
    }
  }
})
