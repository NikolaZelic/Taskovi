<template lang="html">
  <div id="wrapper">
    <side-bar :class="{max: !(checkShow(1,false,false,false) && this.taskID !== undefined) 
    && !checkShow(0,true) && !checkShow(0,false,true)}" />
    <div class="rightside" :class="{focus: isFocus}">
      
      <global-feed v-if='globalFeed' />
      <div v-else class="maincontent" :class='[{darkTheme: darkTheme}]'>

        <!-- checkShow(selectedTab,itemEdit = false,itemAdd = false,itemAddTask = false) -->
        <!-- Project -->
        <project-manage v-if="checkShow(0,true) || checkShow(0,false,true)" />

        <!-- Step -->
        <task-view v-if='checkShow(1,false,false,false) && this.taskID !== undefined' />

      </div>
      <!-- Task -->
    </div>
    <div>
      
      <step-add v-if="itemAddStepButton" />
      <task-edit v-if="checkShow(1,true)" />
      <task-add v-if="checkShow(1,false,true)" />
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

// import FeedElement from "@/components/Feed/FeedElement";
import GlobalFeed from "@/components/Feed/GlobalFeed.vue";

import ModalError from "@/components/Misc/ModalError";
import UserOptions from "@/components/Misc/UserOptions";

import { api } from "@/api/index.js";
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  components: {
    SideBar,
    TaskView,
    StepAdd,
    TaskEdit,
    ProjectManage,
    TaskAdd,
    UserOptions,
    ModalError,
    GlobalFeed
  },
  data() {
    return {
      editBtn: false,
      addBtn: false,
      addTaskBtn: false,
      intervalSession: null
    };
  },
  watch: {
    modalStatusActive(val) {
      if (!val) return;
      let bgColor = this.modalStatus.ok ? "alert-success" : "alert-danger";
      let icon = this.modalStatus.ok ? "check" : "exclamation-triangle";
      let dur =
        this.modalStatus.duration !== undefined
          ? this.modalStatus.duration
          : 8000;

      let message = this.modalStatus.message;
      this.$toasted.show(message, {
        position: "bottom-right",
        duration: dur,
        className: bgColor + "",
        icon: {
          name: icon
        },
        action: {
          class: "fas fa-times",
          onClick: (e, toastObject) => {
            toastObject.goAway(0);
          }
        }
      });

      store.commit("modalStatus", {
        active: false
      });
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
      isFocus: "mainFocused",
      darkTheme: "darkTheme",
      notifCount: "notificationCount",
      modalStatus: "modalStatus",
      globalFeed: "globalFeed",
      modalErrorActive: state => state.modalError.active,
      modalStatusActive: state => state.modalStatus.active,
      itemEditButton: state => state.itemAction.edit,
      itemAddButton: state => state.itemAction.add,
      itemAddTaskButton: state => state.itemAction.addTask,
      itemAddStepButton: state => state.itemAction.addStep
    }),
    ...mapGetters({
      isFocus: "isFocus",
      taskID: "selectedItemID"
    }),
    notifTitle() {
      return this.notifCount !== undefined && this.notifCount !== 0 ? "🔔" : "";
    }
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
    },
    refreshSession() {
      // EVERY 15 MINUTES
      api.sessionActive();
    }
  },
  metaInfo() {
    return {
      title: "Task Master",
      titleTemplate: this.notifTitle + " %s"
    };
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
  mounted() {
    this.intervalSession = setInterval(
      function() {
        this.refreshSession();
      }.bind(this),
      900000
    );
  },
  beforeDestroy() {
    clearInterval(this.intervalSession);
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
  background-color: var(--main-bg-color);
  min-height: 100vh;
}

.toasted.primary .action {
  color: black;
}

.alert-success {
  color: #11441d !important;
  background-color: #79e292e8 !important;
  border-color: #37e05e !important;
}

.alert-danger {
  color: #441111 !important;
  background-color: #e28079eb !important;
  border-color: #e05937 !important;
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
  flex: 1;
  background-color: var(--main-bg-color);
  color: var(--main-color);
  height: 100%;
  /* z-index: 0; */
}

.maincontent.darkTheme {
  background-color: var(--sec-bg-color);
  color: var(--sec-color);
}

.maincontent > * {
  margin: 50px 30px 20px;
}

.maincontent h1 {
  text-align: center;
}

.static-side {
  position: static;
}

@media only screen and (min-width: 1350px) {
  .rightside {
    flex-direction: row;
  }
  .search {
    min-width: 0;
  }
}

@media only screen and (min-width: 992px) {
  .static-side {
    position: fixed;
    bottom: 0;
    left: 0;
    top: 40px;
  }
  .sidebar-body {
    margin-left: 70px;
  }

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
