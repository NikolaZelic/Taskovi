import {
  instance as axios
} from './config.js';
import {
  store
} from '@/store/index.js';
import router from '../router/index.js';
import {
  routejs
} from "@/router/routemanage.js";


// KAD PRAVIS API OBAVEZNO KORISTI 'RETURN' A U AKCIJI 'THEN' I 'CATCH'

export const api = {

  //#region Zelic
  checkNewwMessages(tsk_id) {
    return axios.get('tasks/' + tsk_id + '/unseenfeeds', {
      params: {
        sid: window.localStorage.sid,
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  searchStepFeeds(tsk_id, stp_time_created, type) {
    return axios.get('tasks/' + tsk_id + '/feeds', {
      params: {
        sid: window.localStorage.sid,
        time: stp_time_created,
        pravac: "start",
        type: type,
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  setFeedImportant(fed_id, important) {
    return axios.post('feeds/' + fed_id, {
      important: important,
      sid: window.localStorage.sid,
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
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
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  getUserInfo() {
    return axios.get('auth/users?sid=' + window.localStorage.sid).then(response => {
      return routejs.checkSession(response);
    });
  },
  createTask(title, description, deadline, tagarray, userarray, priorety, pro_id) {
    return axios.post('tasks?sid=' + window.localStorage.sid, {
      type: 'task',
      proid: pro_id,
      title: title,
      description: description,
      deadline: deadline,
      tagarray: JSON.stringify(tagarray),
      usersarray: JSON.stringify(userarray),
      priority: priorety,
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  createTimestamps(tsk_id, time_created, title) {
    return axios.post('tasks/' + tsk_id + '/feeds', {
      sid: window.localStorage.sid,
      timecreated: time_created,
      text: title,
      type: "text",
      islabel: 1,
    }).then(response => {
      return routejs.checkSession(response);
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
    }).then(response => {
      return routejs.checkSession(response);
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
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  refreshSuggestions(searchText, pro_id) {
    return axios.get('users', {
      params: {
        sid: window.localStorage.sid,
        searchstring: searchText,
        proid: pro_id,
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  selectTask(id) {
    return axios.get('tasks/' + id).then(response => {
      return routejs.checkSession(response);
    });
  },
  //#endregion
  //#region Feeds
  deleteTImestamp(tsk_id, stm_id) {
    return axios.delete("tasks/" + tsk_id + "/labels/" + stm_id, {
      params: {
        sid: window.localStorage.sid,
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  readeTimestemps(tsk_id) {
    return axios.get('tasks/' + tsk_id + "/labels", {
      params: {
        sid: window.localStorage.sid,
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  readeFeeds(tasid, fedid, direction, type, searchingstring, fed_important, fed_time, impbyoth) {
    return axios.get('/tasks/' + tasid + '/feeds', {
      params: {
        fedid: fedid,
        pravac: direction,
        type: type,
        searchstring: searchingstring,
        fed_important: fed_important,
        fedtime: fed_time,
        sid: window.localStorage.sid,
        impbyoth: impbyoth
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  readeGloablFeeds(offset, type, searchingstring, fed_important, impbyoth) {
    return axios.get('users/feeds', {
      params: {
        sid: window.localStorage.sid,
        type: type,
        searchstring: searchingstring,
        fed_important: fed_important,
        offset: offset,
        count: false,
        impbyoth: impbyoth,
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  postMessage(tasid, mess) {
    // var msg = store.state.messages;
    var fd = new FormData();
    fd.append('type', 'text');
    fd.append('text', mess);
    return axios.post('/tasks/' + tasid + '/feeds?sid=' + window.localStorage.sid, fd).then(response => {
      return routejs.checkSession(response);
    });
  },
  sendAttach(tasid, file) {
    let fd = new FormData();
    fd.append("type", "file");
    fd.append("file", file);
    return axios.post('/tasks/' + tasid + '/feeds?sid=' + window.localStorage.sid, fd, {
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(response => {
      return routejs.checkSession(response);
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
        if (window.location.pathname === '/auth')
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

  getProjectFromTaskID(id) {
    return axios.get('tasks/:tasid/project', {
      params: {
        sid: localStorage.sid,
        tasid: id
      }
    })
    .then(response => {
      return routejs.checkSession(response);
    });
  },

  // ZX - Get projects
  getProjects() {
    return axios.get('projects', {
      params: {
        sid: localStorage.sid,
      }
    }).then(response => {
      return routejs.checkSession(response);
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
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  getFeedCount() {
    return axios.get('/users/feeds', {
      params: {
        sid: localStorage.sid,
        count: true
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },
  //#endregion


  getTaskInfo(taskID) {
    return axios.get("tasks/:tasid/steps", {
      params: {
        tasid: taskID,
        sid: window.localStorage.sid
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },


  //Pocetak Milosevih API-ja
  editTask(sid, tasid, title, description, deadline, tagarray, userarray, priority) {
    return axios.put("tasks/:tasid", {
      sid: sid,
      tasid: tasid,
      title: title,
      description: description,
      deadline: deadline,
      tagarray: tagarray,
      usersarray: userarray,
      priority: priority
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  loadTaskInfo(sid, tasid) {
    return axios.get("tasks/:tasid", {
      params: {
        sid: sid,
        tasid: tasid
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  loadAllProjectUsers(sid, projectID) {
    return axios.get("projects/:proid", {
      params: {
        proid: projectID,
        sid: sid
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  loadTags(proid, searchstring, sid) {
    return axios.get("projects/:proid/tags", {
      params: {
        proid: proid,
        type: "task",
        searchstring: searchstring,
        sid: sid
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  changeTaskStatus(parameter, sid, tasid) {
    return axios.put("tasks/:tasid/status", {
      sid: sid,
      status: parameter,
      tasid: tasid
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  dragAndDropUpload(task, formData) {
    let url = 'tasks/' + task + '/feeds';
    return axios.post(url, formData, {
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  },

  getSingleProjectInfo(proid, sid) {
    return axios.get("projects/:proid", {
      params: {
        proid: proid,
        sid: sid
      }
    }).then(response => {
      return routejs.checkSession(response);
    });
  }

  //Kraj Milosevih API-ja

};
