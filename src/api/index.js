import {
  instance as axios
} from './config.js'
import {store} from '@/store/store.js';

export const api = {
  newFeed(tId, fId) {
    return axios.get('/task/:tasid/feeds', {
      params: {
        tasid: tId,
        fedid: fId,
        pravac: 'down'
      }
    })
  },

  postMessage(tId, mess) {
    return axios({
      method: 'post',
      url: '/task/:tasid/feeds',

      params: {
        tasid: tId,
        type: 'text',
        text: mess
      }
    });
  },

  login(email, password) {
    axios.post('auth/login', {
        email: email,
        pass: password
      })
      .then(response => {
        var sid = response.data.sid;
        if (sid != undefined || sid != null) {
          // Zapisujem sid u store
          window.localStorage.setItem('sid', sid);
          window.localStorage.setItem('name', response.data.name);
          window.localStorage.setItem('surname', response.data.surname);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },


  getUserProjects(){
    axios({
      method: 'get',
      url: '/users/projects',
      params: {
        sid: window.localStorage.getItem('sid')
      }
    }).then(r =>{
        // console.log(r.data.data);
        store.commit('setLeftSideBarContent', {index: 0, data: r.data.data} );
    });
  },
  getUserTasks(index, state, type, archived){
    axios({
      method: 'get',
      url: '/users/tasks',
      params: {
        sid: window.localStorage.getItem('sid'),
        state: state,
        type: type,
        archived: archived,
      }
    }).then(r =>{
        // console.log(r);
        store.commit('setLeftSideBarContent', {index: index, data: r.data.data} );
    });
  },
}
