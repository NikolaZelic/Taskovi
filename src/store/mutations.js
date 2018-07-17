import {
  store
} from './index';
const mutations = {
  resetState() {
    store.state.sidebarTabData = [];
    store.state.sidebarItemSelection = [];
    store.state.userStorage = {};
    // store.state.darkTheme = undefined;
  },
  modalError(state, params) {
    store.state.modalError.active = params.active !== false;
    if (params.message !== undefined)
      store.state.modalError.message = params.message;
  },

  modalStatus(state, params) {
    store.state.modalStatus.active = params.active !== false;
    let dur = params.duration;
    store.state.modalStatus.duration = dur !== undefined && Number.isInteger(dur) ? dur : undefined;
    store.state.modalStatus.ok = params.ok !== undefined ? params.ok : true;
    store.state.modalStatus.message = params.message !== undefined ? params.message : '';
  },

  localStorage(state, params) {
    let name = params.name;
    let surname = params.surname;
    let email = params.email;
    let sid = params.sid;
    if (name !== undefined) localStorage.name = name;
    if (surname !== undefined) localStorage.surname = surname;
    if (email !== undefined) localStorage.email = email;
    if (sid !== undefined) localStorage.sid = sid;
    store.state.userStorage = {
      name: name,
      surname: surname,
      email: email,
    };
  },

  itemAddStep: () => {
    store.state.itemAction.addStep = !store.state.itemAction.addStep;
  },

  notificationCount(state, params) {
    store.state.notificationCount = params;
  }
};
export default {
  mutations,
};
