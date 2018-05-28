<template lang="html">
  <div id="wrapper">
    <side-bar/>
    <div class="main-content">
      <div class="dynamic-center">
        <keep-alive>
          <!-- <task-view></task-view> -->
          <!-- <task-add></task-add> -->
          <!-- <project-add></project-add> -->
          <!-- <project-view></project-view> -->
          <team-add></team-add>
        </keep-alive>
      </div>
      <chat-element/>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
import ChatElement from "@/components/ChatElement";
import TaskView from "@/components/TaskView";
import TaskAdd from "@/components/TaskAdd";
import ProjectAdd from "@/components/ProjectAdd";
import ProjectView from "@/components/ProjectView";
import TeamAdd from "@/components/TeamAdd";
import { api } from "@/api/index.js";

export default {
  components: {
    SideBar,
    ChatElement,
    TaskView,
    TaskAdd,
    ProjectAdd,
    ProjectView,
    TeamAdd
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

@media only screen and (min-width: 900px) {
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
