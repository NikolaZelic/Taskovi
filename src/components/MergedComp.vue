<template lang="html">
  <div id="wrapper">
    <side-bar/>
    <div class="rightside" :class="{focus: isFocus}">
      <div class="maincontent">
        <!-- <user-options/> -->

        <!-- Editing existing -->
        <!-- <company-edit v-if="checkShow(0,true)"/> -->
        <project-edit v-if="checkShow(0,true)"/>
        <task-edit v-if="checkShow(1,true) || checkShow(2,true)"/>
        <team-edit v-if="checkShow(3,true)"/>

        <!-- Adding new -->
        <!-- <company-add v-if="checkShow(0,false,true)"/> -->
        <project-add v-if="checkShow(0,false,true)"/>
        <step-add v-if="checkShow(1,false,false,true) || checkShow(2,false,false,true)"/>
        <task-add v-if="checkShow(1,false,true) || checkShow(2,false,true)"/>
        <team-add v-if="checkShow(3,false,true)"/>

        <!-- Viewing existing -->
        <!-- <company-view v-if='checkShow(0,false,false)'/> -->
        <project-view v-else-if='checkShow(0,false,false)'/>
        <task-view v-else-if='checkShow(1,false,false) || checkShow(2,false,false)'/>
        <team-view v-else-if='checkShow(3,false,false)'/>

      </div>
      <feed-element v-if="taskid != -1"/>
    </div>
    <modal-complete v-if="modalStatus"/>
    <modal-error v-if="modalError"/>
  </div>
</template>

<script>
import { store } from "@/store/index.js";
import SideBar from "@/components/SideBar/Sidebar";

import FeedElement from "@/components/Feed/FeedElement";

import TaskView from "@/components/Content/Task/TaskView";
import StepAdd from "@/components/Content/Task/StepAdd";
import TaskEdit from "@/components/Content/Task/TaskEdit";

import TaskAdd from "@/components/Content/Task/TaskAdd";

// import TeamView from "@/components/Content/Team/TeamView";
// import TeamAdd from "@/components/Content/Team/TeamAdd";
// import TeamEdit from "@/components/Content/Team/TeamEdit";

import ProjectAdd from "@/components/Content/Project/ProjectAdd";
import ProjectView from "@/components/Content/Project/ProjectView";
import ProjectEdit from "@/components/Content/Project/ProjectEdit";

// import CompanyAdd from "@/components/Content/Company/CompanyAdd";
// import CompanyEdit from "@/components/Content/Company/CompanyEdit";
// import CompanyView from "@/components/Content/Company/CompanyView";

import ModalError from "@/components/Misc/ModalError";
import ModalComplete from "@/components/Misc/ModalComplete";

import UserOptions from "@/components/UserOptions";
import { api } from "@/api/index.js";
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  components: {
    SideBar,
    FeedElement,
    TaskView,
    StepAdd,
    TaskEdit,
    ProjectAdd,
    ProjectView,
    ProjectEdit,
    TaskAdd,
    UserOptions,
    ModalError,
    ModalComplete
  },
  data() {
    return {
      editBtn: false,
      addBtn: false,
      addTaskBtn: false
    };
  },
  created() {
    let sid = localStorage.sid;
    if (sid === undefined || sid === null) {
      this.$router.push("/auth");
      return;
    } else {
      api.sessionActive();
    }
  },
  watch: {
    modalStatus(val) {
      if (val === true) {
        setTimeout(function() {
          store.commit("modalStatus", {
            active: false
          });
        }, 20000);
      }
    },
    itemEditButton(val) {
      this.editBtn = val !== undefined;
    },
    itemAddButton(val) {
      this.addBtn = val !== undefined;
    },
    itemAddTaskButton(val) {
      this.addTaskBtn = val !== undefined;
    }
  },
  computed: {
    ...mapState({
      selectedTab: "currentTabIndex",
      modalError: state => state.modalError.active,
      modalStatus: state => state.modalStatus.active,
      itemEditButton: state => state.itemAction.edit,
      itemAddButton: state => state.itemAction.add,
      itemAddTaskButton: state => state.itemAction.addTask,
      isFocus: state => state.mainFocused
    }),
    ...mapGetters({
      isFocus: "isFocus",
      taskid: "getTaskID"
    })
  },
  methods: {
    checkShow(
      selectedTab,
      itemEdit = false,
      itemAdd = false,
      itemAddTask = false
    ) {
      return (
        selectedTab === this.selectedTab &&
        itemEdit === this.editBtn &&
        itemAdd === this.addBtn &&
        itemAddTask === this.addTaskBtn
      );
    }
  }
};
</script>

<style>
/* :root {
  --main-bg-color: #262729;
  --main-color: #eeeeee;
  --sec-bg-color: #f3f4f7;
  --sec-color: #222222;
} */
</style>


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
  background-color: var(--main-bg-color);
  color: var(--main-color);
}

.maincontent label {
  color: var(--main-color);
}

.maincontent h1 {
  text-align: center;
  /* color: #fff */
}

@media only screen and (min-width: 1350px) {
  .rightside {
    flex-direction: row;
  }
}

@media only screen and (min-width: 900px) {
  /* body {
    font-size: 0.9rem;
  }
  td {
    font-size: 1rem;
  } */
  #wrapper {
    flex-direction: row;
    min-height: 100vh;
  }
  /* SIDEBAR */
  #wrapper > aside {
    position: fixed;
    height: 100vh;
    width: 37%;
  }

  .item-filter {
    justify-content: space-around;
  }
  /* MAIN CONTENT */
  #wrapper > .rightside {
    width: 63%;
    margin-left: 37%;
    min-height: 100vh;
    transition: all 0.4s ease;
  }

  #wrapper > .rightside.focus {
    margin-left: 70px;
    transition: all 0.8s ease;
  }
}
</style>
