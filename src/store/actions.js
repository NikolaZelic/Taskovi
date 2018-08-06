import {
  api
} from '@/api/index.js';
import {
  store
} from './index';
const actions = {
  getFeedCount() {
    api.getFeedCount().then(r => {
      if (r.data !== undefined)
        store.commit('notificationCount', r.data.data);
    }).catch(() => {
      console.log('Notf Error');
    });
  },
};

export default {
  actions,
};
