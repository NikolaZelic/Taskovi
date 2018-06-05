<template lang="html">
  <div id="wrapper">
      <!-- <side-bar/> -->

    <div class="main-content">
      <div class="dynamic-center">
        <keep-alive>
          <!-- <task-view></task-view> -->
          <!-- <task-add></task-add> -->
          <!-- <project-add></project-add> -->

          <!-- <project-edit v-if="selectedTab === 0 && selectedItemEdit!==undefined"></project-edit>
          <company-edit v-if="selectedTab === 3 && selectedItemEdit!==undefined"></company-edit> -->

          <!-- <team-edit></team-edit> -->


          <!-- <project-view v-if='selectedTab === 0'></project-view>
          <task-view v-else-if='selectedTab === 1'></task-view>
          <company-view v-else-if='selectedTab === 3'></company-view> -->

          <team-add></team-add>

          <!-- <company-add></company-add> -->

          <!-- <registration></registration> -->

        </keep-alive>
      </div>
      <!-- <chat-element/> -->
    </div>
  </div>
</template>

<script>
import { store } from "@/store/index.js";

import SideBar from "@/components/SideBar";

import ChatElement from "@/components/Chat/ChatElement";

import TaskView from "@/components/Content/TaskView";
import TaskAdd from "@/components/Content/TaskAdd";
import TeamAdd from "@/components/Content/TeamAdd";
import TeamEdit from "@/components/Content/TeamEdit";

import ProjectAdd from "@/components/Content/ProjectAdd";
import ProjectView from "@/components/Content/ProjectView";
import ProjectEdit from "@/components/Content/ProjectEdit";

import CompanyAdd from "@/components/Content/CompanyAdd";
import CompanyEdit from "@/components/Content/CompanyEdit";
import CompanyView from "@/components/Content/CompanyView";

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

  },

  computed: {
    ...mapGetters({
      selectedTab: 'getTabIndex',
      newItem: 'itemAdded',
      selectedItemEdit : 'getEditItemID'
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
