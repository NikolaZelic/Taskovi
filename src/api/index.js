import {
  instance as axios
} from './config.js';
import {
  store
} from '@/store/index.js';
import router from '../router/index.js'

// KAD PRAVIS API OBAVEZNO KORISTI 'RETURN' A U AKCIJI 'THEN' I 'CATCH'

export const api = {

    // by Zelic - poziva se u TaskAdd
    getUserInfo() {
      return axios.get('auth/users?sid=' + window.localStorage.sid);
    },
    // by Zelic - Poziva se u TaskAdd.vue
    createParenttask(proid, title, description, deadline, userid, teamid, tagarray, priorety) {
      return axios.post('project/' + proid + "/parenttasks?sid=" + window.localStorage.sid, {
        title: title,
        description: description,
        deadline: deadline,
        userid: userid,
        teamid: teamid,
        tagarray: JSON.stringify(tagarray),
        priority: priorety
      });
    },
    // by Zelic - Poziva se u TaskAdd.vue
    createTask(title, description, deadline, userid, teamid, tagarray, priorety, origin) {
      return axios.post('tasks?sid=' + window.localStorage.sid, {
        title: title,
        description: description,
        deadline: deadline,
        userid: userid,
        teamid: teamid,
        tagarray: JSON.stringify(tagarray),
        priority: priorety,
        origintskid: origin,
      });
    },
    // by Zelic - koristi se u TaskAdd.vue, TaskAdd.vue
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
    // by Zelic - Koristi se u TaskAdd.vue
    suggestTags(tagFor, searchStr) {
      return axios.get("tags", {
        params: {
          sid: window.localStorage.sid,
          searchstring: searchStr,
          type: tagFor
        }
      });
    },
    // by Zelic - Poziva se u TeamAdd.vue. Ne zapisuje nista u store.
    // createTeam(comid, users, teamname) {
    //   return axios.post('companies/' + comid + "/teams?sid=" + window.localStorage.sid, {
    //     teamname: teamname,
    //     users: JSON.stringify(users)
    //   });
    // },

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
      return axios.get('tasks/' + id);
    },
    // SVETA
    readeFeeds(tasid, fedid, direction) {
      return axios.get('/tasks/' + tasid + '/feeds', {
        params: {
          fedid: fedid,
          pravac: direction,
          sid: window.localStorage.sid,
        }
      });
    },
    // SVETA
    postMessage(tasid, mess) {
      var msg = store.state.messages;
      var fd = new FormData();
      fd.append('type', 'text');
      fd.append('text', mess);
      return axios.post('/tasks/' + tasid + '/feeds?sid=' + window.localStorage.sid, fd);
    },
    // SVETA
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
    // ZX ============= AUTH
    sessionActive() {
      let sid = window.localStorage.sid;
      axios.get('auth/users?sid=' + sid).then(r => {
        let statusOK = r.data.status === 'OK';
        if (statusOK) {
          console.log(r.data.name + ' ' + r.data.surname + ' ulogovan');
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
      axios.post('auth/singup', {
        email: user.email,
        pass: user.password,
        name: user.name,
        surname: user.surname
      }).catch(error => {
        console.log(error);
      });
    },
    // ZX - Get projects based on filter
    getUserProjects() {
      return axios.get('/users/projects', {
        params: {
          sid: window.localStorage.sid,
          // state: state,
          // type: type,
          // archived: archived,
        }
      });
    },
    // ZX - GET user tasks based on a project - filter used
    getUserTaskList(params) {
      return axios.get('/users/tasks', {
        params: {
          sid: window.localStorage.sid,
          pro_id: params.pro_id,
          created: params.created,
          assigned: params.assigned,
          archived: params.archived,
        }
      })
    },
        //Sveta
        // getTeam(teamId) {
        //   return axios.get("/teams/" + teamId, {
        //     params: {
        //       sid: window.localStorage.sid,
        //     }
        //   })
        // },
        // getTeamMembers(teamId) {
        //   return axios.get("/teams/" + teamId + "/users", {
        //     params: {
        //       sid: window.localStorage.sid,
        //     }
        //   })
        // },
        // getTeamAdmins(teamId) {
        //   return axios.get("/teams/" + teamId + "/admins", {
        //     params: {
        //       sid: window.localStorage.sid,
        //     }
        //   })
        // },
    }
