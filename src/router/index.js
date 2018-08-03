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

import TestForm from '@/components/TEST_COMPS/TestForm';
import SideBar from "@/components/Sidebar/SideBar";

Vue.use(Router);
Vue.use(Meta);
const router = new Router({
  routes: [{
      path: '/',
      name: 'MergedComp',
      component: MergedComp,
      children: [{
        path: 'feeds',
        name: 'GlobalFeed',
        components: {
          gf: GlobalFeed
        }
      }, {
        path: 'tasks',
        name: 'Tasks',
        component: SideBar
      }]
    }, {
      path: '/auth',
      name: 'StartPage',
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
    {
      path: '*',
      component: MergedComp
    }
  ],
  mode: 'history',
});

export default router;
// router.afterEach((to, from) => {
//   console.log(to)
//   console.log(from)
// })
