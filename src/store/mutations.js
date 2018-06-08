import {store} from './index';
const mutations = {
  modalError(state, params) {
    store.state.modalError = params;
  }
}

export default {
  mutations,
}
