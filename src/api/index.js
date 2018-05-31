import {
  instance as axios
} from './config.js'
import {
  store
} from '@/store/index.js';

export const api = {
  readeFeeds(tasid, fedid, direction) {
    return axios.get('/tasks/' + tasid + '/feeds', {
        params: {
          fedid: fedid,
          pravac: direction,
          sid: window.localStorage.sid,
        }
      })
  },

  postMessage(tasid, mess) {
    // console.log('Ovo se desava');
    var msg = store.state.messages;
    var fd = new FormData();
    fd.append('type', 'text');
    fd.append('text', mess);
    return axios.post('/tasks/' + tasid + '/feeds?sid=' + window.localStorage.sid, fd);
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
    return axios.get('/users/projects', {
      params: {
        sid: window.localStorage.sid,
      }
    });
  },

  getUserTasks(index, state, type, archived) {
    return axios.get('/users/tasks', {
      params: {
        sid: window.localStorage.sid,
        state: state,
        type: type,
        archived: archived,
      }
    });
  },

  getUserCompanies(index) {
    return axios.get('/users/companies', {
      params: {
        sid: window.localStorage.sid,
      }
    });
  },

  getUserTeams(index) {
    return axios.get('/users/teams', {
      params: {
        sid: window.localStorage.sid,
      }
    });
  },
}
