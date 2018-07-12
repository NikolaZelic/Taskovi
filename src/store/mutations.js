import {
  store
} from './index';
const mutations = {
  resetState() {
    store.state.sidebarTabData = [];
    store.state.sidebarItemSelection = [];
    store.state.darkTheme = undefined;
  },
  modalError(state, params) {
    store.state.modalError.active = true;
    if (params.message !== undefined)
      store.state.modalError.message = params.message;
  },

  modalStatus(state, params) {
    store.state.modalStatus.active = true;
    store.state.modalStatus.ok = params.ok !== undefined ? params.ok : true;
    store.state.modalStatus.message = params.message !== undefined ? params.message : '';
  },

  itemAddStep: () => {
    store.state.itemAction.addStep = !store.state.itemAction.addStep;
  },
};
export default {
  mutations,
};
