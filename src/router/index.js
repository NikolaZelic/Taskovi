import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';
import MergedComp from '@/components/MergedComp';
import StartPage from '@/components/StartPage';
import GlobalFeed from "@/components/Feed/GlobalFeed.vue";
// REMOVE BELOW IN FINAL
import UserOptions from '@/components/Misc/UserOptions.vue';
import TaskAdd from '@/components/Content/Task/TaskAdd';
import StepAdd from '@/components/Content/Task/StepAdd';
// import TaskView2 from '@/components/Content/Task/TaskView2';

import TestForm from '@/components/TEST_COMPS/TestForm';


Vue.use(Router);
Vue.use(Meta);
export default new Router({
  routes: [{
      path: '/',
      name: 'MergedComp',
      component: MergedComp,
      // components: {
      //   a: UserOptions,
      //   b: GlobalFeed,
      // },

      children: [{
        path: 'user',
        name: 'UserOptions',
        component: UserOptions,
      }, {
        path: 'feeds',
        name: 'GlobalFeed',
        component: GlobalFeed
      }]
    }, {
      path: '/auth',
      name: 'StartPage',
      component: StartPage
    }, {
      path: '*',
      component: StartPage
    }, {
      path: '/taskadd',
      component: TaskAdd
    }, {
      path: '/stepadd',
      component: StepAdd
    }, {
      path: '/testform',
      component: TestForm
    },
    // {
    //   path: '/tasks/:id',
    //   component: TaskView2
    // }
  ],
  mode: 'history',
});
