<template lang="html">
  <div id="wrapper">
    <side-bar :class="{max: checkShow(0,false,false) || checkShow(1,false,false) && this.taskID === undefined}" />
    <div class="rightside" :class="{focus: isFocus}">
      <div class="maincontent" :class='{darkTheme: darkTheme}'>

        <!-- checkShow(selectedTab,itemEdit = false,itemAdd = false,itemAddTask = false) -->
        <!-- Project -->
        <project-manage v-if="checkShow(0,true) || checkShow(0,false,true)" />

        <!-- Task -->
        <task-edit v-if="checkShow(1,true)" />
        <task-add v-if="checkShow(1,false,true)" />
        <task-view v-if='checkShow(1,false,false,false) && this.taskID !== undefined' />

        <!-- Step -->
        <step-add v-if="itemAddStepButton" />

      </div>
      <feed-element v-if="this.taskID && checkShow(1,false,false)" :class='{darkTheme: darkTheme}' />
    </div>
    <!-- <router-link to="/user"></router-link> -->
    <router-view></router-view>
    <!-- <user-options></user-options> -->
    <!-- <modal-complete v-if="modalStatusActive" /> -->
    <modal-error v-if="modalErrorActive" />
  </div>
</template>

<script>
import { store } from "@/store/index.js";
import SideBar from "@/components/Sidebar/SideBar";

import TaskView from "@/components/Content/Task/TaskView";
import StepAdd from "@/components/Content/Task/StepAdd";
import TaskEdit from "@/components/Content/Task/TaskEdit";

import TaskAdd from "@/components/Content/Task/TaskAdd";

import ProjectManage from "@/components/Content/Project/ProjectManage";

import FeedElement from "@/components/Feed/FeedElement";

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
    ProjectManage,
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
  watch: {
    modalStatusActive(val) {
      console.log(val);
      let bgColor = this.modalStatus.ok ? "alert-success" : "alert-danger"; // FIX THIS
      let icon = this.modalStatus.ok ? "exclamation-triangle" : "check"; // FIX THIS

      let message = this.modalStatus.message;
      this.$toasted.show(message, {
        position: "bottom-right",
        duration: null,
        className: bgColor + "",
        icon: {
          name: icon
        },
        action: {
          text: "X",
          onClick: (e, toastObject) => {
            toastObject.goAway(0);
          }
        }
      });

      // console.log(val);
      // // if (val === true) {
      // setTimeout(function() {
      //   store.commit("modalStatus", {
      //     active: false
      //   });
      // }, 4000);
      // // }
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
      modalErrorActive: state => state.modalError.active,
      modalStatusActive: state => state.modalStatus,
      itemEditButton: state => state.itemAction.edit,
      itemAddButton: state => state.itemAction.add,
      itemAddTaskButton: state => state.itemAction.addTask,
      itemAddStepButton: state => state.itemAction.addStep,
      isFocus: state => state.mainFocused,
      darkTheme: state => state.darkTheme
    }),
    ...mapGetters({
      isFocus: "isFocus",
      taskID: "selectedItemID"
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
  },
  beforeCreate() {
    let sid = localStorage.sid;
    if (sid === undefined || sid === null) {
      this.$router.push("/auth");
      return;
    } else {
      api.sessionActive();
    }
    let dark = localStorage.dark;
    if (dark === "true") {
      store.commit("darkTheme", true);
    }
  },
  destroyed() {
    console.log("User " + localStorage.name + " signed out. Destroying data.");
    store.commit("resetState");
  }
};
</script>

<style lang="css">
#wrapper {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  background-color: #24262d;
  min-height: 100vh;
}

.alert-success {
  color: #11441d;
  background-color: #79e292;
  border-color: #37e05e;
}

.alert-danger {
  color: #441111;
  background-color: #e28079;
  border-color: #e05937;
}

.rightside {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.feed {
  background-color: var(--main-bg-color);
  color: var(--main-color);
}

.feed.darkTheme {
  background-color: var(--sec-bg-color);
  color: var(--sec-color);
}

.item-filter {
  justify-content: unset;
}

.maincontent {
  padding: 50px 30px 20px;
  flex: 1;
  background-color: var(--main-bg-color);
  color: var(--main-color);
}

.maincontent.darkTheme {
  background-color: var(--sec-bg-color);
  color: var(--sec-color);
}

.maincontent h1 {
  text-align: center;
}

@media only screen and (min-width: 1350px) {
  .rightside {
    flex-direction: row;
  }
}

@media only screen and (min-width: 900px) {
  #wrapper {
    flex-direction: row;
    min-height: 100vh;
  }
  #wrapper > aside {
    position: fixed;
    height: 100vh;
    width: 37%;
  }
  #wrapper > aside.max {
    position: fixed;
    height: 100vh;
    width: 100%;
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
