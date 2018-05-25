<template lang="html">
  <div id="wrapper">
   <left-sidebar/>
   <div class="main-content">
     <!-- <task-view></task-view> -->
     <!-- <task-add></task-add> -->
     <!-- <project-add></project-add> -->
   </div>
   <right-side/>
  </div>
</template>

<script>
import LeftSidebar from "@/components/LeftSidebar"
import RightSide from "@/components/RightSide"
import TaskView from "@/components/TaskView"
import TaskAdd from "@/components/TaskAdd"
import ProjectAdd from "@/components/ProjectAdd"

export default {
  components: {
    LeftSidebar,
    RightSide,
    TaskView,
    TaskAdd,
    ProjectAdd
  },
}
</script>

<style lang="css">
#wrapper{
  display: flex;
  align-items: stretch;
}
.main-content{
  flex: 1;
  }
  .fas{
    font-size: 125%;
  }
</style>
