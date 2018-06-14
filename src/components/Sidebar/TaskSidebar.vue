<template lang="html">
  <table>
    <template v-for="(data,index) in currentTabData">
      <tr>
        <td @click='expandParent(parentExpanded[index],index)'><span class='fas fa-angle-right expandarrow'
          :class='{"expanded":parentExpanded[index]}'></span> </td>
        <td @click='expandParent(parentExpanded[index],index)' class='parent-task'>{{data.title}} </td>
         <!-- <td @click='expandParent(data.taskExpanded,index)'><span class='fas fa-angle-right'
            :class='{"expanded":data.taskExpanded}'></span> </td>
          <td @click='expandParent(data.taskExpanded,index)' class='parent-task'>{{data.title}} </td> -->
        <td @click='createTask'><span  class='fas fa-plus'></span> </td>
      </tr>
       <transition-group name="list" tag="div">
      <tr v-if='parentExpanded[index]' v-for="t in taskList" :key='t' >
        <td class='tasks'>
          <span class="td-icons fas fa-edit" title="Edit Item" @click="editItemButton(item, activeItem = item.id)"></span>
        </td>
        <td colspan="10">
          {{t}}
        </td>
      </tr>
     </transition-group>
    </template>
  </table>
</template>

<script>
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
      taskList: ['taskic', 'taskicccc2', 'taskiiii'],
    }
  },
  watch: {
    currentTabData(val) {
      // if (this.currentTabData.length !== this.parentExpanded.length)
        this.parentExpanded = Array(this.currentTabData.length).fill(false);
    }
  },
  computed: {
    ...mapGetters({
      currentTabData: 'currentTabData',
    })
  },
  methods: {
    expandParent(val, i) {
      Vue.set(this.parentExpanded, i, !val);
    },
    createTask() {
      console.log('create task CLICKED');
    }
  },
  mounted(){
    console.log('sd');
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
