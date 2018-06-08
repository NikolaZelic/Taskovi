import {
  api
} from '@/api/index.js';
import {
  store
} from '../index';
const state = {
  companyInfo: [],
  admins: [],
  employees: [],
}
const actions = {
  getCompanyInfo({
    commit
  }, params) {
    api.getCompanyInfo(params.compID).then(r => {
      if (r.data.data !== undefined) {
        commit('companyInfo', r.data.data[0]);
      }
    }).catch(error => {
      console.log('API CompanyInfo error: ' + error);
    });
  },

  loadAdmins({
    commit
  }, params) {
    api.getAdmins(params.compID).then(r => {
      if (r.data.data !== undefined)
        commit('admins', r.data.data);
    }).catch(error => {
      console.log('API Admins error: ' + error);
    });
  },

  loadEmployees({
    commit
  }, params) {
    api.getEmployees(params.compID).then(r => {
      if (r.data.data !== undefined)
        commit('employees', r.data.data);
    }).catch(error => {
      console.log('API Employees error: ' + error);
    });
  },
}
const mutations = {
  companyInfo(state, params) {
    state.companyInfo = params;
  },
  admins(state, params) {
    state.admins = params;
  },
  employees(state, params) {
    state.employees = params;
  },
}
const getters = {

}
export default {
  // namespaced: true,
  state,
  actions,
  mutations,
  getters
}
