<template lang="html">
  <div id="wrapper">
    <side-bar/>
    <div class="main-content">
      <div class="dynamic-center">
        <keep-alive>
          <task-view></task-view>
          <!-- <task-add></task-add> -->
          <!-- <project-add></project-add> -->
          <!-- <project-view></project-view> -->
          <!-- <team-add></team-add> -->
          <!-- <company-add></company-add> -->
          <!-- <company-edit></company-edit> -->
        </keep-alive>
      </div>
      <!-- <chat-element/> -->
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import ChatElement from "@/components/Chat/ChatElement";
import TaskView from "@/components/Content/TaskView";
import TaskAdd from "@/components/Content/TaskAdd";
import ProjectAdd from "@/components/Content/ProjectAdd";
import ProjectView from "@/components/Content/ProjectView";
import TeamAdd from "@/components/Content/TeamAdd";
import CompanyAdd from "@/components/Content/CompanyAdd";
import CompanyEdit from "@/components/Content/CompanyEdit";
import Registration from "@/components/Auth/Registration";
import { api } from "@/api/index.js";

export default {
  components: {
    SideBar,
    ChatElement,
    TaskView,
    TaskAdd,
    ProjectAdd,
    ProjectView,
    TeamAdd,
    CompanyAdd,
    CompanyEdit,
    Registration
  },
  mounted() {
    // TEST LOGIN -- REMOVE FINAL
    api.login("email1@gmail.com", "pass123");
  }
};
</script>

<style lang="css">
#wrapper {
  display: flex;
  align-items: stretch;
  flex-direction: column;
}

/* #wrapper > *{
  width: 100%;
} */

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fas {
  font-size: 125%;
}

.dynamic-center {
  padding: 0 30px 0;
  flex: 1;
}

@media only screen and (min-width: 1500px) {
  .main-content {
    flex-direction: row;
  }
}

@media only screen and (min-width: 768px) {
  #wrapper {
    flex-direction: row;
  }
    /* width: 50%; */
   #wrapper > * {
    min-height: 100vh;
  }
  #wrapper > aside{
    width: 40%;
  }
  #wrapper > div{
    width: 60%;
  }
}
</style>
