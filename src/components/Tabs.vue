<template lang="html">
  <div class="tabs">
    <button v-for="(tab,index) in tabs"
      :title="tab.name" class="tablinks"
      :class="[{active:activeTab == index}, tab.icon]"
      @click="getTabData($event,activeTab = index)">
    </button>
  </div>
</template>

<script>
import axios from 'axios';
import {
  bus
} from '../main';
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeTab: undefined,
    }
  },
  methods: {
    getMyProjects() {
      var array = [];
      var lastIndex = array.length;
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/projects').then(data => {
        var sviPodaci = data.data.data;
        for (var i in sviPodaci) {
          var po = sviPodaci[i];
          array.push({
            id: lastIndex++,
            title: po.grp_name,
          });
          // array.push({
          //   id: lastIndex++,
          //   title: po.grp_name,
          // });
          // array.push({
          //   id: lastIndex++,
          //   title: po.grp_name,
          // });
        }
      })
      bus.$emit('myProjects', array);
    },
    getMyTasks() {
      var array = [];
      var lastIndex = array.length;
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users/tasks').then(data => {
        var sviPodaci = data.data.data;
        for (var i in sviPodaci) {
          var po = sviPodaci[i];
          array.push({
            id: lastIndex++,
            title: po.tsk_title,
            seen: po.tsk_seen,
            urgent: po.isUrgent,
          });
        }
      })
      bus.$emit('myTasks', array);
    },
    getMyCreatedTasks() {
      var array = [];
      var lastIndex = array.length;
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users/parenttasks').then(data => {
        var sviPodaci = data.data.data;
        for (var i in sviPodaci) {
          var po = sviPodaci[i];
          array.push({
            id: lastIndex++,
            par_id: po.par_id,
            timecreated: po.par_timecreated,
            title: po.par_title,
            seen: po.haveUnseenFeed,
          });
        }
      })
      bus.$emit('myCreatedTasks', array);
    },
    getMyCreatedTasks() {
      var array = [];
      var lastIndex = array.length;
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users/parenttasks').then(data => {
        var sviPodaci = data.data.data;
        for (var i in sviPodaci) {
          var po = sviPodaci[i];
          array.push({
            id: lastIndex++,
            par_id: po.par_id,
            timecreated: po.par_timecreated,
            title: po.par_title,
            seen: po.haveUnseenFeed,
          });
        }
      })
      bus.$emit('myCreatedTasks', array);
    },
    getDebugTasks() {    },
    getArchivedTasks() {    },
    getTabData(e) {
      if (e != null) {
        this.tabTitle = e.target.title;
      }
      this.isCollapsedSidebar = false;
      bus.$emit('activeTab', this.activeTab);
      switch (this.activeTab) {
        case 0:
          this.getMyProjects();
          break;
        case 1:
          this.getMyCreatedTasks();
          break;
        case 2:
          this.getMyTasks();
          break;
        case 3:
          this.getDebugTasks();
          break;
        case 4:
          this.getArchivedTasks();
          break;
        default:
          break;
      }
      // bus.$emit('')
    },
  },
  mounted() {
    this.getTabData(null, this.activeTab = 0);
  },
}
</script>

<style lang="css">

  /* TABS START */

  .tablinks {
    width: 100%;
    text-align: center;
    padding: 12px 0;
    line-height: 30px;
    background: unset;
    border: unset;
    color: #fff;
  }

  .tablinks.active {
    background: #2d3436;
  }

  .tablinks:hover {
    color: #fff300;
  }

  /* TABS END */
</style>
