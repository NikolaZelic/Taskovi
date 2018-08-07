<template lang="html">
  <div id="wrapper" :class='{darkMain: darkTheme}'>
    <div class='flex-head-data'>
      <div class='head-data'>
        <div class='app-header' v-if='tableShow'>

          <div v-if='currentTabIndex===1'>
            <strong>
              <span title='Back to project list' class='fa fa-chevron-left' @click='backToProjectList'></span>
              <span>{{ projectInfo.title }}</span>
              <span title='Edit current project' class='fa fa-edit' @click='editProject'></span>
            </strong>
          </div>

          <div v-if='currentTabIndex===0'>
            <strong> Project List</strong>
          </div>

        </div>
        <div class='task-tabs'>
        </div>
      </div>
      <div class='flex-data-row'>
        <side-bar :class="{max: maxBool}" />

        <div class="rightside" v-if='!(globalFeed || maxBool)' :class="{focus: isFocus}">
          <div class="maincontent" :class='[{darkTheme: darkTheme}]'>

            <!-- Project -->
            <project-manage v-if="checkShow(0,true) || checkShow(0,false,true)" />

            <!-- Step -->
            <task-view v-if='checkShow(1,false,false,false) && taskID !== undefined' />

            <task-add v-if="checkShow(1,false,true)" />
            <task-edit v-if="checkShow(1,true)" />
            <step-add v-if="itemAddStepButton" />

          </div>
        </div>
      </div>

      <div class="feed-global-wrap" v-if='!tableShow'>
        <div class='feed-global'>
          <router-view name="gf"></router-view>
          <!-- <global-feed v-if='globalFeed' /> -->
        </div>
      </div>
    </div>
    <modal-error v-if="modalErrorActive" />
  </div>
</template>

<script>
import { store } from "@/store/index.js";
import { routejs } from "@/router/routemanage.js";
import { api } from "@/api/index.js";
import { mapGetters, mapState } from "vuex";
import SideBar from "@/components/Sidebar/SideBar";
import TaskView from "@/components/Content/Task/TaskView";
import TaskEdit from "@/components/Content/Task/TaskEdit";
import TaskAdd from "@/components/Content/Task/TaskAdd";
import ProjectManage from "@/components/Content/Project/ProjectManage";
import ModalError from "@/components/Misc/ModalError";

export default {
  components: {
    SideBar,
    TaskView,
    TaskEdit,
    ProjectManage,
    TaskAdd,
    ModalError
  },
  data() {
    return {
      editBtn: false,
      addBtn: false,
      intervalSession: null,
      lastLink: undefined
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
    globalFeed(val) {
      let l = this.lastLink;
      if (val) this.$router.push("/feeds");
      else this.$router.push(l === undefined ? "/" : l);
    },
    $route(to, from) {
      this.lastLink = from.path;
      store.commit("lastLink", from.path);
      // console.log(this.lastLink);
    }
  },
  computed: {
    ...mapState({
      currentTabIndex: "currentTabIndex",
      isFocus: "mainFocused",
      darkTheme: "darkTheme",
      notifCount: "notificationCount",
      modalStatus: "modalStatus",
      globalFeed: "globalFeed",
      modalErrorActive: state => state.modalError.active,
      modalStatusActive: state => state.modalStatus.active,
      itemEditButton: state => state.itemAction.edit,
      itemAddButton: state => state.itemAction.add,
      itemAddStepButton: state => state.itemAction.addStep,
      proID: state => state.sidebarItemSelection
    }),
    ...mapGetters({
      isFocus: "isFocus",
      taskID: "selectedItemID"
    }),
    tableShow() {
      return !(this.globalFeed || this.checkShow(2));
    },

    projectInfo() {
      let onePro = [];
      if (this.currentTabIndex !== 1) return onePro;
      let storeProject = store.state.sidebarTabData[0];
      if (storeProject === undefined || this.proID === undefined) return onePro;
      for (let index = 0; index < storeProject.length; index++) {
        const el = storeProject[index];
        if (el.id === this.proID[0]) {
          onePro = el;
          break;
        }
      }
      return onePro;
    },
    maxBool() {
      return (
        !(
          this.checkShow(1, false, false, false) && this.taskID !== undefined
        ) &&
        !this.checkShow(0, true) &&
        !this.checkShow(0, false, true) &&
        !this.checkShow(1, false, true) &&
        !this.checkShow(1, true)
      );
    },
    notifTitle() {
      return this.notifCount !== undefined && this.notifCount !== 0 ? "🔔" : "";
    }
  },
  methods: {
    checkShow(currentTabIndex, itemEdit = false, itemAdd = false) {
      return (
        currentTabIndex === this.currentTabIndex &&
        itemEdit === this.editBtn &&
        itemAdd === this.addBtn
      );
    },
    backToProjectList() {
      store.commit("setTabIndex", 0);
    },
    editProject() {
      let proID = this.projectInfo.id;
      store.commit("setTabIndex", 0);
      store.commit("itemEditClick", {
        id: proID
      });
    },
    refreshSession() {
      // EVERY 15 MINUTES
      api.sessionActive();
    }
  },
  metaInfo() {
    return {
      title: "Omni Tasker",
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
  created() {    
    routejs.check(); // ROUTER REDIRECT},
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

#wrapper.darkMain {
  background: var(--sec-bg-color);
}

.flex-head-data {
  display: flex;
  flex-direction: column;
  flex: 1;
  /* position: fixed; */
}

.flex-data-row {
  display: flex;
  height: 100%;
  background: var(--main-bg-color);
}

.darkMain .flex-data-row {
  background: var(--sec-bg-color);
}

.toasted.primary .action {
  color: black;
}

.alert-success {
  color: #11441d !important;
  background: linear-gradient(to right, #79e292 0%, #a1de7e 100%) !important;
  /* background-color: #79e292e8 !important; */
  border-color: #32e65c !important;
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

.item-filter {
  justify-content: unset;
}

.maincontent {
  display: flex;
  flex: 1;
  background-color: var(--main-bg-color);
  color: var(--main-color);
  height: 100%;
  /* overflow-y: scroll; */
  /* z-index: 0; */
}

.maincontent.darkTheme {
  background-color: var(--sec-bg-color);
  color: var(--sec-color);
}

.maincontent > * {
  margin: 0 30px;
}

.maincontent h1 {
  text-align: center;
}

.feed-global-wrap {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-left: 70px;
  position: fixed;
}

.feed-global {
  max-width: 700px;
  margin: auto;
  height: 100%;
}

.darkMain .feed-global pre {
  color: whitesmoke;
}

.darkMain .app-header {
  background: #191b1e;
}

.app-header {
  border-bottom: 1px solid #827e7e59;
  z-index: 1;
  background: #fff;
  font-size: 120%;
  padding: 20px 0 5px;
  color: var(--ac-color);
  /* position: fixed; */
}

.app-header > * {
  margin-left: 115px;
}

.app-header .fa-chevron-left {
  font-size: 105%;
  margin-right: 5px;
  cursor: pointer;
}

.app-header .fa-edit {
  color: var(--ac-color);
  margin-left: 30px;
  cursor: pointer;
}

.static-side {
  position: fixed;
  bottom: 0;
  left: 0;
  top: 0;
}

#wrapper aside.max {
  width: 100%;
}

@media only screen and (min-width: 1350px) {
  .rightside {
    flex-direction: row;
  }
  .search {
    min-width: 0;
  }
}

@media only screen and (min-width: 960px) {
  /* .feed-global {
    align-self: center;
  } */
  #wrapper {
    flex-direction: row;
    min-height: 100vh;
  }

  #wrapper aside {
    position: fixed;
    height: 100vh;
    width: 37%;
  }
  #wrapper aside.max {
    width: 100%;
  }

  .item-filter {
    justify-content: space-around;
  }
  /* MAIN CONTENT */
  #wrapper .rightside {
    width: 63%;
    margin-left: 37%;
    min-height: 100%;
    /* min-height: 100vh; */
    transition: all 0.4s ease;
  }

  #wrapper .rightside.focus {
    margin-left: 70px;
    transition: all 0.8s ease;
  }
}

@media only screen and (min-width: 600px) {
  /* .feed-global {
    margin-left: 35px;
    align-self: center;
  } */
}
</style>
