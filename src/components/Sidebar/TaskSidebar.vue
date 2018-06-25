<template lang="html">
  <table>
    <template v-for="(task,index) in tasks">
      <tr>
        <!-- <td @click='expandParent(taskExpanded[index],index)'>
          <span class='fas fa-angle-right expandarrow' :class='{"expanded":taskExpanded[index]}'></span>
        </td> -->
        <td @click='expandParent(taskExpanded[index],index)' class='parent-task'>{{task.title}} </td>
        <!-- <td @click='expandParent(task.taskExpanded,index)'><span class='fas fa-angle-right'
            :class='{"expanded":task.taskExpanded}'></span> </td>
          <td @click='expandParent(task.taskExpanded,index)' class='parent-task'>{{task.title}} </td> -->
        <td @click='createTask(task)'>
          <span class='fas fa-plus'></span>
        </td>
      </tr>
      <transition-group name="list" tag="div" class="task-list">
        <tr v-if='taskExpanded[index]' v-for="step in task.children" :key='step.id'>
          <td class='steps'>
            <span class="td-icons fas fa-edit" title="Edit Item" @click="editItemButton(step, activeItem = step.id)"></span>
          </td>
          <td @click='selectItem(step.id, activeItem = step.id)' class='td-flex'>{{ step.title }}</td>
        </tr>
      </transition-group>
    </template>
  </table>
</template>

<script>
import { store } from "@/store/index.js";
import { mapGetters } from "vuex";
import { mapState } from "vuex";
import Vue from "vue";
export default {
  data() {
    return {
      taskExpanded: [],
      activeItem: undefined
      // taskList: ['taskic', 'taskicccc2', 'taskiiii'],
    };
  },
  watch: {
    tasks(val) {
      if (val === undefined) {
        console.log(val + " tasks(val) watcher");
        return;
      }
      if (this.tasks.length !== this.taskExpanded.length) {
        this.taskExpanded = Array(this.tasks.length).fill(true);
        this.taskList = this;
      }
    }
  },
  computed: {
    ...mapState({
      tabIndex: "currentTabIndex"
    }),
    ...mapGetters({
      tasks: "currentTabData"
    })
  },
  methods: {
    expandParent(val, i) {
      Vue.set(this.taskExpanded, i, !val);
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
      // console.log(itemID);
      // this.tabs[this.currentTabIndex].itemIndex = itemID;

      store.commit("setSidebarItemSelection", {
        index: this.tabIndex,
        id: itemID
      });
    },
    editItemButton(item) {
      store.dispatch("itemEditClick", item);
    },
    createTask(item) {
      store.dispatch("itemAddTaskClick", item);
    }
  },
  mounted() {
    // console.log('sd');
  }
};
</script>

<style lang="css">
.parent-task {
  flex: 1;
}

.steps {
  text-indent: 2px;
}

.task-list {
  border-left: 1px solid gray;
  left: 20px;
  position: relative;
}

tr span {
  cursor: pointer;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.expandarrow {
  transform: rotate(0);
  transition: all 0.3s;
}

.expandarrow.expanded {
  transform: rotate(90deg);
  transition: all 0.3s;
}
</style>
