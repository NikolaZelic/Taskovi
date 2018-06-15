<template lang="html">
  <table>
    <template v-for="(ptask,index) in parentTasks">
      <tr>
        <td @click='expandParent(parentExpanded[index],index)'><span class='fas fa-angle-right expandarrow'
          :class='{"expanded":parentExpanded[index]}'></span> </td>
        <td @click='expandParent(parentExpanded[index],index)' class='parent-task'>{{ptask.title}} </td>
         <!-- <td @click='expandParent(ptask.taskExpanded,index)'><span class='fas fa-angle-right'
            :class='{"expanded":ptask.taskExpanded}'></span> </td>
          <td @click='expandParent(ptask.taskExpanded,index)' class='parent-task'>{{ptask.title}} </td> -->
        <td @click='createTask(ptask)'><span  class='fas fa-plus'></span> </td>
      </tr>
       <transition-group name="list" tag="div">
      <tr v-if='parentExpanded[index]' v-for="t in taskList" :key='t' >
        <td class='tasks'>
          <span class="td-icons fas fa-edit" title="Edit Item" @click="editItemButton(item, activeItem = item.id)"></span>
        </td>
        <td @click='selectItem(t.id, activeItem = t.id)' class='td-flex'>{{ t }}</td>
      </tr>
     </transition-group>
    </template>
  </table>
</template>

<script>
import {
  store
} from "@/store/index.js";
import {
  mapGetters
} from "vuex";
import {
  mapState
} from "vuex";
import Vue from 'vue';
export default {
  data() {
    return {
      parentExpanded: [],
      activeItem: undefined,
      taskList: ['taskic', 'taskicccc2', 'taskiiii'],
    }
  },
  watch: {
    parentTasks(val) {
      // if (this.parentTasks.length !== this.parentExpanded.length)
      this.parentExpanded = Array(this.parentTasks.length).fill(false);
    }
  },
  computed: {
    ...mapGetters({
      parentTasks: 'currentTabData',
    })
  },
  methods: {
    expandParent(val, i) {
      Vue.set(this.parentExpanded, i, !val);
      // this.actionTasksFromParentTask(i);
    },
    // actionTasksFromParentTask(i) {
    //   store.dispatch('getUserTasks', {
    //     index: this.currentTabIndex,
    //     state: 'both',
    //     type: 'task',
    //     archived: 'false',
    //     parentIndex: i,
    //   });
    // },
    selectItem(itemID) {
      this.tabs[this.currentTabIndex].itemIndex = itemID;
      store.commit("setSidebarItemSelection", {
        index: this.currentTabIndex,
        id: itemID
      });
    },
    createTask(item) {
      // console.log(item);
      // invoke TaskAdd component
      store.dispatch("itemAddTaskClick", item);
    }
  },
  mounted() {
    // console.log('sd');
  }
}
</script>

<style lang="css">
.parent-task{
  flex: 1;
}
.tasks{
  text-indent: 12px;
}
tr span{
  cursor: pointer;
}
.list-enter-active, .list-leave-active {
  transition: all .3s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.expandarrow{
  transform: rotate(0);
  transition: all .3s;
}
.expandarrow.expanded{
  transform: rotate(90deg);
  transition: all .3s;
}
</style>
