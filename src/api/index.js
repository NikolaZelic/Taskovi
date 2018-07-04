import {
  instance as axios
} from './config.js';
// import {
//   store
// } from '@/store/index.js';
import router from '../router/index.js';

// KAD PRAVIS API OBAVEZNO KORISTI 'RETURN' A U AKCIJI 'THEN' I 'CATCH'

export const api = {

  //#region Zelic

  getUserInfo() {
    return axios.get('auth/users?sid=' + window.localStorage.sid);
  },
  // Poziva se u TaskAdd.vue
  // createParenttask(proid, title, description, deadline, userid, teamid, tagarray, priorety) {
  //   return axios.post('project/' + proid + "/parenttasks?sid=" + window.localStorage.sid, {
  //     title: title,
  //     description: description,
  //     deadline: deadline,
  //     userid: userid,
  //     teamid: teamid,
  //     tagarray: JSON.stringify(tagarray),
  //     priority: priorety
  //   });
  // },
  // Poziva se u TaskAdd.vue
  createTask(title, description, deadline, tagarray, priorety,  pro_id) {
    return axios.post('tasks?sid=' + window.localStorage.sid, {
      type: 'task',
      proid: pro_id,
      title: title,
      description: description,
      deadline: deadline,
      tagarray: JSON.stringify(tagarray),
      priority: priorety,
    });
  },
  // koristi se u TaskAdd.vue, TaskAdd.vue
  suggestGroup(grpType, searchStr, comId) {
    return axios.get('groups', {
      params: {
        sid: window.localStorage.sid,
        searchstring: searchStr,
        comid: comId,
        type: grpType,
        belongs: 'yes'
      }
    });
  },
  // Koristi se u TaskAdd.vue
  suggestTags(pro_id,tagFor, searchStr) {
    return axios.get("projects/"+pro_id+"/tags", {
      params: {
        sid: window.localStorage.sid,
        searchstring: searchStr,
        type: tagFor,
      }
    });
  },
  // Poziva se u TeamAdd.vue. Ne zapisuje nista u store.
  // createTeam(comid, users, teamname) {
  //   return axios.post('companies/' + comid + "/teams?sid=" + window.localStorage.sid, {
  //     teamname: teamname,
  //     users: JSON.stringify(users)
  //   });
  // },

  // pozvano iz actions/refreshSuggestions. Sluzi za TeamAdd.
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
    return axios.get('tasks/' + id);
  },
  //#endregion
  //#region Sveta

  readeFeeds(tasid, fedid, direction) {
    return axios.get('/tasks/' + tasid + '/feeds', {
      params: {
        fedid: fedid,
        pravac: direction,
        sid: window.localStorage.sid,
      }
    });
  },
  postMessage(tasid, mess) {
    // var msg = store.state.messages;
    var fd = new FormData();
    fd.append('type', 'text');
    fd.append('text', mess);
    return axios.post('/tasks/' + tasid + '/feeds?sid=' + window.localStorage.sid, fd);
  },
  sendAttach(tasid, file) {
    var fd = new FormData();
    fd.append("type", "file");
    fd.append("file", file);
    return axios.post('/tasks/' + tasid + '/feeds?sid=' + window.localStorage.sid, fd, {
      headers: {
        "content-type": "multipart/form-data"
      }
    });
  },
  //#endregion
  //#region Zex 
  // AUTH
  sessionActive() {
    let sid = window.localStorage.sid;
    axios.get('auth/users?sid=' + sid).then(r => {
      let statusOK = r.data.status === 'OK';
      if (statusOK) {
        window.localStorage.name = r.data.name;
        window.localStorage.surname = r.data.surname;
        router.push('/');
      } else {
        router.push('/auth');
      }
    });
  },
  login(email, password) {
    return axios.post('auth/login', {
      email: email,
      pass: password
    });
  },
  register(user) {
    return axios.post('auth/singup', {
      email: user.email,
      pass: user.password,
      name: user.name,
      surname: user.surname
    });
  },
  // ZX - Get projects based on filter
  getProjects() {
    return axios.get('projects', {
      params: {
        sid: window.localStorage.sid,
      }
    });
  },
  // ZX - GET user tasks based on a project - filter used
  getTasks(params) {
    return axios.get('/users/tasks', {
      params: {
        sid: window.localStorage.sid,
        pro_id: params.pro_id,
        created: params.created,
        assigned: params.assigned,
        archived: params.archived,
      }
    });
  },
  //#endregion

};
