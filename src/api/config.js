import axios from 'axios';

let instance = axios.create({
  baseURL: 'http://671n121.mars-t.mars-hosting.com/mngapi/tasks'
});
export {instance}
