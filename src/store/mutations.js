import {store} from './index';
const mutations = {
  modalError(state, params) {
    store.state.modalError.active = params.active;
    if (params.message !== undefined)
      store.state.modalError.message = params.message;
  }
}

export default {
  mutations,
}
