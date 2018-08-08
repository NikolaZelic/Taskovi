// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Toasted from "vue-toasted";
import moment from 'moment';

import 'v-slim-dialog/dist/v-slim-dialog.css';
import dialogs from 'v-slim-dialog';
Vue.use(dialogs);

import {
  store
} from './store/index';
Vue.use(BootstrapVue);
Vue.use(Toasted, {
  iconPack: 'fontawesome'
});
Vue.prototype.$moment = moment;

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    parseTime(date) {
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    localToUTC(date) {
      let offset = new Date().getTimezoneOffset();
      if (date === null || date === undefined || date === "")
        return undefined;
      return this.$moment(date).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    },
    utcToLocal(date) {
      let offset = "" + new Date().getTimezoneOffset();
      if (offset.startsWith('-'))
        offset = offset.replace("-", "+");
      else if (offset.startsWith('+'))
        offset = offset.replace("+", "-");

      if (date === null || date === undefined || date === "")
        return undefined;
      return this.$moment(date).add(offset, 'minutes').format('YYYY-MM-DD HH:mm');
    },

    utcToLocalSeconds(date) {
      let offset = "" + new Date().getTimezoneOffset();
      if (offset.startsWith('-'))
        offset = offset.replace("-", "+");
      else if (offset.startsWith('+'))
        offset = offset.replace("+", "-");

      if (date === null || date === undefined || date === "")
        return undefined;
      return this.$moment(date).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    },

  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  components: {
    App
  },
  template: '<App/>'
});
