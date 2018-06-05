<template lang="html">
  <div id="wrapper">
      <side-bar/>

    <div class="main-content">
      <div class="dynamic-center">
        <keep-alive>
          <!-- <task-add></task-add> -->

          <project-edit v-if="selectedTab === 0 && selectedItemEdit!==undefined"></project-edit>
          <company-edit v-if="selectedTab === 3 && selectedItemEdit!==undefined"></company-edit>

          <project-add v-if="selectedTab === 0 && newItem"></project-add>


          <!-- <team-edit></team-edit> -->


          <project-view v-if='selectedTab === 0'></project-view>
          <task-view v-else-if='selectedTab === 1'></task-view>
          <company-view v-else-if='selectedTab === 3'></company-view>

          <!-- <team-add></team-add> -->

          <!-- <company-add></company-add> -->

          <!-- <registration></registration> -->

        </keep-alive>
      </div>
      <!-- <chat-element/> -->
    </div>
  </div>
</template>

<script>
import {
  store
} from "@/store/index.js";

import SideBar from "@/components/SideBar";

import ChatElement from "@/components/Chat/ChatElement";

import TaskView from "@/components/Content/Task/TaskView";
import TaskAdd from "@/components/Content/Task/TaskAdd";

import TeamAdd from "@/components/Content/Team/TeamAdd";
import TeamEdit from "@/components/Content/Team/TeamEdit";

import ProjectAdd from "@/components/Content/Project/ProjectAdd";
import ProjectView from "@/components/Content/Project/ProjectView";
import ProjectEdit from "@/components/Content/Project/ProjectEdit";

import CompanyAdd from "@/components/Content/Company/CompanyAdd";
import CompanyEdit from "@/components/Content/Company/CompanyEdit";
import CompanyView from "@/components/Content/Company/CompanyView";

import Registration from "@/components/Auth/Registration";
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
    // api.login("email001@qqq.com", "qqq");
    // api.login("email004@qqq.com", "qqq");
    // api.login("email2@yahoo.com", "pass111");
  },

  computed: {
    selectedTab() {
      return store.state.currentTabIndex;
    },

    selectedItemEdit() {
      return store.state.editItem;
    },

    newItem() {
      return store.state.addItem;
    }
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

.item-filter {
  justify-content: unset;
  flex-wrap: wrap;
}

.fas {
  font-size: 125%;
}

.dynamic-center {
  padding: 50px 30px 0;
  flex: 1;
}

.dynamic-center h1 {
  text-align: center;
}

@media only screen and (min-width: 1500px) {
  .main-content {
    flex-direction: row;
  }
}

@media only screen and (min-width: 900px) {
  body{
    font-size: 0.8rem;
  }
  #wrapper {
    flex-direction: row;
  }
  /* SIDEBAR */
  #wrapper > aside {
    position: fixed;
    height: 100vh;
    width: 45%;
  }

  .item-filter {
    justify-content: space-around;
  }
  /* MAIN CONTENT */
  #wrapper > div {
    width: 55%;
    margin-left: 45%;
    min-height: 100vh;
  }
}
</style>
