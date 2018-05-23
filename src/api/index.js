import {
  instance as axios
} from './config.js'

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
  }
}
