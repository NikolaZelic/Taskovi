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

  register(email, password, name, surname, description) {
    axios.post('auth/singup', {
        email: email,
        pass: password,
        name: name,
        surname: surname,
        description: description
      }).catch(error => {
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

  getUserCompanies(index) {
    axios({
      method: 'get',
      url: '/users/companies',
      params: {
        sid: window.localStorage.getItem('sid'),
      }
    }).then(r => {
      store.commit('setSidebarData', {
        index: index,
        data: r.data.data
      });
    });
  },

  getUserTeams(index) {
    axios({
      method: 'get',
      url: '/users/teams',
      params: {
        sid: window.localStorage.getItem('sid'),
      }
    }).then(r => {
      store.commit('setSidebarData', {
        index: index,
        data: r.data.data
      });
    });
  },

  selectTask(id){
    console.log('API Selected Task');
    axios({
      // Promeniti hardcoded ID taska sa onim koji se dobije na klik - ovo je za testiranje
      url: "/tasks/"+id
    }).
    then( response => {
      // console.log(response);
       store.commit('changeSelectedTask', {selectedTask: response.data.Data[0]} );
    });
  }

}
