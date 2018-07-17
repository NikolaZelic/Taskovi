import axios from 'axios';

var baseURL = 'http://695u121.mars-t.mars-hosting.com/mngapi/';

let instance = axios.create({
  baseURL: baseURL
  // baseURL: 'http://682b121.mars1.mars-hosting.com/mngapi/'
});
export {
  instance, baseURL
};
