<template lang="html">
  <div id="wrapper">
   <left-sidebar/>
   <div class="main-content">
     <div class="dynamic-center">
      <!-- <task-view></task-view> -->
      <!-- <task-add></task-add> -->
      <!-- <project-add></project-add> -->
      <!-- <project-view></project-view> -->
      <!-- <team-add></team-add> -->
      <!-- <company-add></company-add> -->
      <company-edit></company-edit>
     </div>
     <!-- <chat/> -->
   </div>
  </div>
</template>

<script>
import LeftSidebar from "@/components/LeftSidebar"
import Chat from "@/components/Chat"
import TaskView from "@/components/TaskView"
import TaskAdd from "@/components/TaskAdd"
import ProjectAdd from "@/components/ProjectAdd"
import ProjectView from "@/components/ProjectView"
import TeamAdd from "@/components/TeamAdd"
import CompanyAdd from "@/components/CompanyAdd"
import CompanyEdit from "@/components/CompanyEdit"


export default {
  components: {
    LeftSidebar,
    Chat,
    TaskView,
    TaskAdd,
    ProjectAdd,
    ProjectView,
    TeamAdd,
    CompanyAdd,
    CompanyEdit
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
  display: flex;
  flex-direction: column;
  }
  .fas{
    font-size: 125%;
  }
  .dynamic-center {
      padding: 0 30px 0;
  }
</style>
