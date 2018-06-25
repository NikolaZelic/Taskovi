import Vue from 'vue';
import Router from 'vue-router';
import MergedComp from '@/components/MergedComp';
import StartPage from '@/components/StartPage';
// REMOVE BELOW IN FINAL
import UserOptions from '@/components/UserOptions.vue';
import TaskAdd from '@/components/Content/Task/TaskAdd';
import StepAdd from '@/components/Content/Task/StepAdd';

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
  }, {
    path: '/taskadd',
    component: TaskAdd
  }, {
    path: '/stepadd',
    component: StepAdd
  }],
  mode: 'history',
});
