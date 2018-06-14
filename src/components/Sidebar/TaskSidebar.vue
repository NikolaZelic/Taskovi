<template lang="html">
  <table>
    <template v-for="a in arr">
      <tr>
        <td @click='a.taskExpanded = !a.taskExpanded'><span :class="iconExpanded(a)"></span> </td>
        <td @click='a.taskExpanded = !a.taskExpanded' class='parent-task'>{{a.name}} </td>
        <td @click='createTask'><span  class='fas fa-plus'></span> </td>
      </tr>
       <transition-group name="list" tag="div">
      <tr v-if='a.taskExpanded' v-for="t in taskList" :key='t' >
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
export default {
  data() {
    return {
      arr: [{
        name: 'Prvi parent',
        taskExpanded: false
      }, {
        name: '2 parent',
        taskExpanded: false
      }, {
        name: '3 parent',
        taskExpanded: false
      }, {
        name: '4 parent',
        taskExpanded: false
      }, ],
      taskList: ['taskic', 'taskicccc2', 'taskiiii'],
    }
  },
  methods: {
    iconExpanded(val) {
      let te = val.taskExpanded;
      let down = 'fas fa-angle-down';
      let right = 'fas fa-angle-right';
      return te ? down : right;
    },
    createTask() {
      console.log('create task CLICKED');
    }
  }
}
</script>

<style lang="css">
.parent-task{
  flex: 1;
}
.tasks{
  text-indent: 15px;
}
.list-enter-active, .list-leave-active {
  transition: all .3s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
