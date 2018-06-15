<template lang="html">
  <div id="wrapper">
    <side-bar/>
    <div class="rightside" :class="{focus: isFocus}">
      <div class="maincontent">
        <!-- <user-options/> -->

        <!-- Editing existing -->
        <company-edit v-if="selectedTab === 0 && itemEditButton!==undefined && itemAddButton===undefined"></company-edit>
        <project-edit v-if="selectedTab === 1 && itemEditButton!==undefined && itemAddButton===undefined"></project-edit>
        <task-edit v-if="selectedTab === 2 && itemEditButton!==undefined && itemAddButton===undefined"></task-edit>
        <team-edit v-if="selectedTab === 4 && itemEditButton!==undefined && itemAddButton===undefined"></team-edit>

        <!-- Adding new -->
        <company-add v-if="selectedTab === 0 && itemAddButton===1 && itemEditButton===undefined"></company-add>
        <project-add v-if="selectedTab === 1 && itemAddButton===1 && itemEditButton===undefined"></project-add>
        <task-add v-if="(selectedTab === 2 || selectedTab === 3) && itemAddButton===1 && itemEditButton===undefined"></task-add>
        <parenttask-add v-if="(selectedTab === 2 || selectedTab === 3) && itemAddButton===1 && itemEditButton===undefined"/>
        <team-add v-if="selectedTab === 4 && itemAddButton===1 && itemEditButton===undefined"></team-add>

        <!-- Viewing existing -->
        <company-view v-else-if='selectedTab === 0 && itemAddButton===undefined && itemEditButton===undefined'></company-view>
        <project-view v-if='selectedTab === 1 && itemAddButton===undefined && itemEditButton===undefined'></project-view>
        <task-view v-else-if='selectedTab === 2 && itemAddButton===undefined && itemEditButton===undefined'></task-view>
        <team-view v-else-if='selectedTab === 4 && itemAddButton===undefined && itemEditButton===undefined'></team-view>

        <!-- <task-add/> -->
      </div>
      <chat-element v-if="taskid != -1"/>
    </div>
    <modal-complete v-if="modalStatus"/>
    <modal-error v-if="modalError"/>
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
import ModalComplete from "@/components/Misc/ModalComplete";

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
    TeamAdd,
    ParenttaskAdd,
    UserOptions,
    ModalError,
    ModalComplete
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
  watch: {
    modalStatus(val) {
      if (val === true) {
        setTimeout(function() {
          store.commit('modalStatus', {
            active: false,
          })
        }, 20000);
      }
    }
  },
  computed: {
    ...mapState({
      selectedTab: "currentTabIndex",
      modalError: state => state.modalError.active,
      modalStatus: state => state.modalStatus.active,
      itemAddButton: state => state.itemAction.add,
      itemEditButton: state => state.itemAction.edit,
      itemAddTaskButton: state => state.itemAction.addTask,
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
    background-color: #24262d;
      }

  .rightside {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #24262d;
  }

  .item-filter {
    justify-content: unset;
    flex-wrap: wrap;
  }

  .maincontent {
    padding: 50px 30px 0;
    flex: 1;
    background-color: #24262d;
  }

  .maincontent h1 {
    text-align: center;
    color: #fff
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
      margin-left: 37%;
      min-height: 100vh;
      transition: all 0.4s ease;
    }

    #wrapper>.rightside.focus{
      margin-left: 70px;
      transition: all 0.8s ease;
    }
  }

</style>
