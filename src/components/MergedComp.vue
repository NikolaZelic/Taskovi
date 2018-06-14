<template lang="html">
  <div id="wrapper">
    <side-bar/>
    <div class="rightside" :class="{focus: isFocus}">
      <div class="maincontent">
        <!-- <user-options/> -->

        <!-- Editing existing -->
        <project-edit v-if="selectedTab === 1 && selectedItemEdit!==undefined && newItem===undefined"></project-edit>
        <task-edit v-if="selectedTab === 2 && selectedItemEdit!==undefined && newItem===undefined"></task-edit>
        <company-edit v-if="selectedTab === 0 && selectedItemEdit!==undefined && newItem===undefined"></company-edit>
        <team-edit v-if="selectedTab === 4 && selectedItemEdit!==undefined && newItem===undefined"></team-edit>

        <!-- Adding new -->
        <project-add v-if="selectedTab === 1 && newItem===1 && selectedItemEdit===undefined"></project-add>
        <task-add v-if="selectedTab === 2 && newItem===1 && selectedItemEdit===undefined"></task-add>
        <company-add v-if="selectedTab === 0 && newItem===1 && selectedItemEdit===undefined"></company-add>
        <team-add v-if="selectedTab === 4 && newItem===1 && selectedItemEdit===undefined"></team-add>

        <!-- Viewing existing -->
        <project-view v-if='selectedTab === 1 && newItem===undefined && selectedItemEdit===undefined'></project-view>
        <task-view v-else-if='selectedTab === 2 && newItem===undefined && selectedItemEdit===undefined'></task-view>
        <company-view v-else-if='selectedTab === 0 && newItem===undefined && selectedItemEdit===undefined'></company-view>
        <team-view v-else-if='selectedTab === 4 && newItem===undefined && selectedItemEdit===undefined'></team-view>

        <!-- <parenttask-add/> -->
        <task-add/>

      </div>
      <chat-element v-if="taskid != -1"/>
    </div>
    <modal-error v-if="modalError"></modal-error>
  </div>
</template>

<script>
import {
  store
} from "@/store/index.js";

import SideBar from "@/components/SideBar/Sidebar";

import ChatElement from "@/components/Chat/ChatElement";

import TaskView from "@/components/Content/Task/TaskView";
import TaskAdd from "@/components/Content/Task/TaskAdd";
import TaskEdit from "@/components/Content/Task/TaskEdit";

import ParenttaskAdd from "@/components/Content/Task/ParenttaskAdd";

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
import ModalError from "@/components/Misc/ModalError";

import UserOptions from "@/components/UserOptions";
import {
  api
} from "@/api/index.js";
import {
  mapGetters
} from "vuex";
import {
  mapState
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
    TeamView,
    ParenttaskAdd,
    UserOptions,
    ModalError
  },
  data() {
    return {
      // isFocus: undefined,
    };
  },
  created() {
    let sid = localStorage.sid;
    if (sid === undefined || sid === null) {
      this.$router.push('/auth');
      return;
    } else {
      api.sessionActive();
    }
  },

  computed: {
    ...mapState({
      selectedTab: "currentTabIndex",
      modalError: state => state.modalError.active,
      newItem: state => state.itemAction.add,
      selectedItemEdit: state => state.itemAction.edit,
      isFocus: state => state.mainFocused,
    }),
    ...mapGetters({
      isFocus: 'isFocus',
      taskid: 'getTaskID'
    })
  }
};
</script>

<style lang="css">
  #wrapper {
    display: flex;
    align-items: stretch;
    flex-direction: column;
  }

  .rightside {
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

  .maincontent {
    padding: 50px 30px 0;
    flex: 1;
  }

  .maincontent h1 {
    text-align: center;
  }

  @media only screen and (min-width: 1500px) {
    .rightside {
      flex-direction: row;
    }
  }

  @media only screen and (min-width: 900px) {
    body {
      font-size: 0.9rem;
    }
    #wrapper {
      flex-direction: row;
    }
    /* SIDEBAR */
    #wrapper>aside {
      position: fixed;
      height: 100vh;
      width: 37%;
    }

    .item-filter {
      justify-content: space-around;
    }
    /* MAIN CONTENT */
    #wrapper>.rightside {
      width: 63%;
      margin-left: 45%;
      min-height: 100vh;
      transition: all 0.4s ease;
    }

    #wrapper>.rightside.focus{
      margin-left: 70px;
      transition: all 0.8s ease;
    }
  }

</style>
