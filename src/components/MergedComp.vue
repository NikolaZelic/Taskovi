<template lang="html">
  <div id="wrapper">
      <side-bar/>

    <div class="main-content">
      <div class="dynamic-center">
        <!-- <keep-alive> -->

          <!-- Editing existing -->
          <project-edit v-if="selectedTab === 0 && selectedItemEdit!==undefined && newItem===undefined"></project-edit>
          <task-edit v-if="selectedTab === 1 && selectedItemEdit!==undefined && newItem===undefined"></task-edit>
          <company-edit v-if="selectedTab === 3 && selectedItemEdit!==undefined && newItem===undefined"></company-edit>
          <team-edit v-if="selectedTab === 4 && selectedItemEdit!==undefined && newItem===undefined"></team-edit>

          <!-- Adding new -->
          <project-add v-if="selectedTab === 0 && newItem===1 && selectedItemEdit===undefined"></project-add>
          <task-add v-if="selectedTab === 1 && newItem===1 && selectedItemEdit===undefined"></task-add>
          <company-add v-if="selectedTab === 3 && newItem===1 && selectedItemEdit===undefined"></company-add>
          <team-add v-if="selectedTab === 4 && newItem===1 && selectedItemEdit===undefined"></team-add>

          <!-- Viewing existing -->
          <project-view v-if='selectedTab === 0 && newItem===undefined && selectedItemEdit===undefined'></project-view>
          <task-view v-else-if='selectedTab === 1 && newItem===undefined && selectedItemEdit===undefined'></task-view>
          <company-view v-else-if='selectedTab === 3 && newItem===undefined && selectedItemEdit===undefined'></company-view>
          <team-view v-else-if='selectedTab === 4 && newItem===undefined && selectedItemEdit===undefined'></team-view>

        <!-- </keep-alive> -->
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
import TaskEdit from "@/components/Content/Task/TaskEdit";

import TeamView from "@/components/Content/Team/TeamView";
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
import {
  mapGetters
} from "vuex";


export default {
  components: {
    SideBar,
    ChatElement,
    TaskView,
    TaskAdd,
    TaskEdit,
    ProjectAdd,
    ProjectView,
    ProjectEdit,
    TeamAdd,
    CompanyAdd,
    CompanyEdit,
    Registration,
    CompanyView,
    TeamEdit,
    TeamView
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
    ...mapGetters({
      selectedTab: 'getTabIndex',
      newItem: 'itemAdded',
      selectedItemEdit: 'getEditItemID'
    })
  },

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
    font-size: 0.9rem;
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
