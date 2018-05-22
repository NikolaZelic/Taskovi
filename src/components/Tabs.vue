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
      sid: undefined,
    }
  },
  methods: {
    getMyProjects() {
      // console.log(this.tabs);
      // return;
      var array = [];
      var lastIndex = array.length;
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/projects').then(data => {
        console.log(data);
        var sviPodaci = data.data.data;
        for (var i in sviPodaci) {
          var po = sviPodaci[i];
          array.push({
            id: lastIndex++,
            title: po.grp_name,
          });
        }
      })
      this.tabs[this.activeTab].data = array;
      bus.$emit('fillActiveArray', array);
    },
    getMyTasks() {
      var array = [];
      var lastIndex = array.length;
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users/tasks', {
        params: {
          'sid': this.sid
        }
      }).then(data => {
        console.log(data);
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
      this.tabs[this.activeTab].data = array;
      bus.$emit('fillActiveArray', array);
    },
    getMyCreatedTasks() {
      var array = [];
      var lastIndex = array.length;
      var sid = undefined;
      axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/users/parenttasks', {
        params: {
          'sid': this.sid
        }
      }).then(data => {
        console.log(data);
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
      this.tabs[this.activeTab].data = array;
      bus.$emit('fillActiveArray', array);
    },
    getDebugTasks() {},
    getArchivedTasks() {},
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
    bus.$on('sid', data => {
      this.sid = data;
    })
    this.getTabData(null, this.activeTab = 0);
  },
}
</script>

<style lang="css">

  /* TABS START */
.tabs{
  flex: 1;
}
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
