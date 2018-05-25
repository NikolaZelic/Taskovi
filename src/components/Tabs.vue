<template lang="html">
  <div class="tabs">
    <button v-for="( tab, index ) in tabs"
      :title="tab.name" class="tablinks"
      :class="[{active:activeTabIndex == index}, tab.icon]"
      @click="getTabData($event,activeTabIndex = index)">
    </button>
  </div>
</template>

<script>
import {
  store
} from "@/store/store.js"
import {
  bus
} from '../main';
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      activeTabIndex: undefined,
    }
  },
  methods: {
    getMyProjects() {
      store.dispatch('getUserProjects');
    },
    getTaskData(s, t, a) {
      store.dispatch('getUserTasks', {
        index: this.activeTabIndex,
        state: s,
        type: t,
        archived: a,
      });
    },
    getTabData(e) {
      if (e != null) {
        this.tabTitle = e.target.title;
      }
      this.isCollapsedSidebar = false;
      if (this.activeTabIndex === undefined)
        return;
      switch (this.activeTabIndex) {
        case 0:
          this.getMyProjects();
          break;
        case 1:
          this.getTaskData('assigned', 'task', 'false');
          break;
        case 2:
          this.getTaskData('created', 'task', 'false');
          break;
        case 3:
          this.getTaskData('assigned', 'bugfix', 'false');
          break;
        case 4:
          this.getTaskData('created', 'task', 'true');
          break;
        default:
          break;
      }
      bus.$emit('activeTabIndex', this.activeTabIndex);
      // bus.$emit('netTabFilled',null);
      // console.log("s");
    },
  },
  mounted() {
    bus.$on('sid', data => {
      this.sid = data;
    })
    this.getTabData(null, this.activeTabIndex = 1);
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

  .tablinks[disabled]{
    color: black;
    background: white;
  }
  .tablinks.active {
    background: #212529;
  }

  .tablinks:hover {
    background: #ccc;
    color: #333;
  }

  /* TABS END */
</style>
