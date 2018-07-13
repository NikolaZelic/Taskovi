import axios from 'axios';

let instance = axios.create({
  baseURL: 'http://695u121.mars-t.mars-hosting.com/mngapi/'
});
export {instance}
