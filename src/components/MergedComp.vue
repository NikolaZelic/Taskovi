<template lang="html">
  <div id="wrapper">
      <side-bar/>

    <div class="main-content">
      <div class="dynamic-center">
        <keep-alive>
          <!-- <task-view></task-view> -->
          <!-- <task-add></task-add> -->
          <!-- <project-add></project-add> -->
          <project-edit></project-edit>
          <!-- <project-view></project-view> -->
          <!-- <team-add></team-add> -->
          <!-- <team-edit></team-edit> -->
          <!-- <company-add></company-add> -->
          <!-- <company-edit></company-edit> -->
          <!-- <company-view></company-view> -->
          <!-- <registration></registration> -->
        </keep-alive>
      </div>
      <!-- <chat-element/> -->
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import ChatElement from "@/components/ChatElement";
import TaskView from "@/components/TaskView";
import TaskAdd from "@/components/TaskAdd";
import ProjectAdd from "@/components/ProjectAdd";
import ProjectEdit from "@/components/ProjectEdit";
import ProjectView from "@/components/ProjectView";
import TeamAdd from "@/components/TeamAdd";
import TeamEdit from "@/components/TeamEdit";
import CompanyAdd from "@/components/CompanyAdd";
import CompanyEdit from "@/components/CompanyEdit";
import CompanyView from "@/components/CompanyView";
import Registration from "@/components/Registration";
import {
  api
} from "@/api/index.js";

export default {
  components: {
    SideBar,
    ChatElement,
    TaskView,
    TaskAdd,
    ProjectAdd,
    ProjectView,
    ProjectEdit,
    TeamAdd,
    CompanyAdd,
    CompanyEdit,
    Registration,
    CompanyView,
    TeamEdit
  },
  mounted() {
    // TEST LOGIN -- REMOVE FINAL
    // api.login("email1@gmail.com", "pass123");
    api.login("admin2@gmail.com", "admin222");
    // api.login("email2@yahoo.com", "pass111");
  }
};
</script>

<style lang="css">
#wrapper {
  display: flex;
  align-items: stretch;
  flex-direction: column;
}
/*
.levi{
  flex: 0.4;
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
  padding: 50px 30px 0;
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
  #wrapper > * {
    width: 50%;
    min-height: 100vh;
  }
}
</style>
