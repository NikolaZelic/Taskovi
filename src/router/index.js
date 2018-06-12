import Vue from 'vue';
import Router from 'vue-router';
import MergedComp from '@/components/MergedComp';
import StartPage from '@/components/StartPage';

Vue.use(Router);
export default new Router({
  routes: [{
    path: '/',
    name: 'MergedComp',
    component: MergedComp
  }, {
    path: '/auth',
    name: 'StartPage',
    component: StartPage
  }, {
    path: '*',
    component: StartPage
  }],
  mode: 'history',
});
