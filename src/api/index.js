import {
  instance as axios
} from './config.js';
import {
  store
} from '@/store/index.js';
import router from '../router/index.js';

// KAD PRAVIS API OBAVEZNO KORISTI 'RETURN' A U AKCIJI 'THEN' I 'CATCH'

export const api = {

  //#region Zelic
  createStep(pro_id, tas_id, title, description, deadline, priorety, users, tags) {
    return axios.post('tasks', {
      sid: window.localStorage.sid,
      type: 'step',
      proid: pro_id,
      tasid: tas_id,
      title: title,
      description: description,
      deadline: deadline,
      priorety: priorety,
      usersarray: JSON.stringify(users),
      tagarray: JSON.stringify(tags)
    });
  },
  getUserInfo() {
    return axios.get('auth/users?sid=' + window.localStorage.sid);
  },
  createTask(title, description, deadline, tagarray, priorety, pro_id) {
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
  suggestTags(pro_id, tagFor, searchStr) {
    return axios.get("projects/" + pro_id + "/tags", {
      params: {
        sid: window.localStorage.sid,
        searchstring: searchStr,
        type: tagFor,
      }
    });
  },
  refreshSuggestions(searchText, pro_id) {
    return axios.get('users', {
      params: {
        sid: window.localStorage.sid,
        searchstring: searchText,
        proid: pro_id,
      }
    });
  },
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
        localStorage.name = r.data.name;
        localStorage.surname = r.data.surname;
        localStorage.email = r.data.email;
        store.commit("localStorage", {
          name: localStorage.name,
          surname: localStorage.surname,
          email: localStorage.email
        });
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
        sid: localStorage.sid,
      }
    });
  },
  // ZX - GET user tasks based on a project - filter used
  getTasks(params) {
    return axios.get('/users/tasks', {
      params: {
        sid: localStorage.sid,
        pro_id: params.pro_id,
        created: params.created,
        assigned: params.assigned,
        archived: params.archived,
        searchstr: params.searchstr,
        tagarray: JSON.stringify(params.tagarray),
      }
    });
  },
  getFeedCount() {
    return axios.get('/users/feed', {
      params: {
        sid: localStorage.sid,
        count: true
      }
    });
  },
  //#endregion


  getTaskInfo(taskID) {
    return axios.get("tasks/:tasid/steps", {
      params: {
        tasid: taskID,
        sid: window.localStorage.sid
      }
    });
  }

};
