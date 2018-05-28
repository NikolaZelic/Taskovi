import {
  instance as axios
} from './config.js'
import {
  store
} from '@/store/store.js';

export const api = {
  readeFeeds(tasid, fedid, direction) {
    axios.get('/tasks/' + tasid + '/feeds', {
        params: {
          fedid: fedid,
          pravac: direction,
          sid: window.localStorage.getItem('sid')
        }
      })
      .then(response => {
        // console.log('Ovo je iz APIja');
        // console.log(response.data.data);
        store.commit('addMessages', {
          'direction': direction,
          'data': response.data.data
        })
      });
  },

  postMessage(tasid, mess) {
    // console.log('Ovo se desava');
    var msg = store.state.messages;
    var fd = new FormData();
    fd.append('type', 'text');
    fd.append('text', mess);
    axios.post('/tasks/' + tasid + '/feeds?sid=' + window.localStorage.getItem('sid'), fd)
      .then(response => {
        var msg = store.state.messages;
        if (msg.length === 0) {
          this.readeFeeds(tasid, 0, 'start');
        } else {
          this.readeFeeds(tasid, msg[msg.length - 1].fed_id, 'down');
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
      .catch(error => {
        console.log(error);
      });
  },

  getUserProjects() {
    axios({
      method: 'get',
      url: '/users/projects',
      params: {
        sid: window.localStorage.getItem('sid')
      }
    }).then(r => {
      store.commit('setSidebarData', {
        index: 0,
        data: r.data.data
      });
    });
  },

  getUserTasks(index, state, type, archived) {
    axios({
      method: 'get',
      url: '/users/tasks',
      params: {
        sid: window.localStorage.getItem('sid'),
        state: state,
        type: type,
        archived: archived,
      }
    }).then(r => {
      store.commit('setSidebarData', {
        index: index,
        data: r.data.data
      });
    });
  },
}
