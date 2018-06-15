import {store} from './index';
const mutations = {
  modalError(state, params) {
    store.state.modalError.active = params.active;
    if (params.message !== undefined)
      store.state.modalError.message = params.message;
  },

  modalStatus(state, params) {
    store.state.modalStatus.active = params.active;
    if (params.ok !== undefined)
      store.state.modalStatus.ok = params.ok;
    if (params.message !== undefined)
      store.state.modalStatus.message = params.message;
  }
}

export default {
  mutations,
}
