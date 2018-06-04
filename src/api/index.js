import {
  instance as axios
} from './config.js'
import {
  store
} from '@/store/index.js';
// KAD PRAVIS API OBAVEZN KORISTI 'RETURN' A U AKCIJI 'THEN' I 'CATCH'

export const api = {

  // by Zelic - pozvano iz actions/refreshSuggestions. Sluzi za TeamAdd.
  refreshSuggestions(searchText, comId) {
    return axios.get('users', {
      params: {
        sid: window.localStorage.sid,
        searchstring: searchText,
        comid: comId,
      }
    });
  },

  // by Zelic
  selectTask(id) {
    console.log('API Selected Task');
    axios({
      // Promeniti hardcoded ID taska sa onim koji se dobije na klik - ovo je za testiranje
      url: "/tasks/" + id
    }).
    then(response => {
      // console.log(response);
      cosole.log('API response');
      store.commit('changeSelectedTask', {
        selectedTask: response.data.Data[0]
      });
    });
  },

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

  getUserWork(index, state, type, archived) {
    let link = '/users/tasks'
    if (index === 0) link = '/users/projects';
    return axios.get(link, {
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

  getUserTeams(index, comid) {
    console.log(comid);
    return axios.get('/companies/' + comid + '/teams', {
      params: {
        sid: window.localStorage.sid,
      }
    });
  },

  selectTask(id) {
    // console.log('API Selected Task');
    axios({
      // Promeniti hardcoded ID taska sa onim koji se dobije na klik - ovo je za testiranje
      url: "/tasks/" + id
    }).
    then(response => {
      // console.log(response);
      store.commit('changeSelectedTask', {
        selectedTask: response.data.Data[0]
      });
    });
  }

}
