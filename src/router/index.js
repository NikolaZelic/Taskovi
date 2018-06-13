import Vue from 'vue';
import Router from 'vue-router';
import MergedComp from '@/components/MergedComp';
import StartPage from '@/components/StartPage';
import UserOptions from '@/components/UserOptions.vue';

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
    path: '/user',
    name: 'UserOptions',
    component: UserOptions
  }, {
    path: '*',
    component: StartPage
  }],
  mode: 'history',
});
