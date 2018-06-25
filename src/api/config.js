import axios from 'axios';

let instance = axios.create({
  baseURL: 'http://682b121.mars1.mars-hosting.com/mngapi/'
});
export {instance}
