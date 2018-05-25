<template lang="html">
  <div id="wrapper">
   <left-sidebar/>
   <div class="main-content">
     <!-- <task-view></task-view> -->
     <!-- <task-add></task-add> -->
     <!-- <project-add></project-add> -->
     <!-- <project-view></project-view> -->
     <team-add></team-add>
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
import ProjectView from "@/components/ProjectView"
import TeamAdd from "@/components/TeamAdd"


export default {
  components: {
    LeftSidebar,
    RightSide,
    TaskView,
    TaskAdd,
    ProjectAdd,
    ProjectView,
    TeamAdd
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
