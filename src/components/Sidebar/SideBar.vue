<template>
  <aside id="sidebar" :class="{ collapsed: !sidebarActive || globalFeed }">

    <!-- <div class="sidebar-header" :class="{ collapsed: !sidebarActive || globalFeed, hideArrow: !showArrow }"></div> -->

    <div class="static-side" @mouseover='sideHover=true' @mouseleave='sideHover=false'>

      <div class="tabs">

        <div class="tab-container" style='position: relative;'>
          <transition-group name='switch' mode="out-in">
            <img v-show='!sideHover' id='enon-img' src='@/assets/img/E-enon.png' key='1'>
            <img v-show='sideHover' id='enon-full-img' src="@/assets/img/Enon.png" key='2'>
          </transition-group>
        </div>

        <div class="tab-container" @click='showGlobalFeed(),notifSelected=true' :class="{active:notifSelected}">
          <span class="fas fa-bell"></span>
          <span class="badge badge-warning count">{{notifDisplay}}</span>
          <span class='left-al'>Notifications</span>
        </div>

        <div v-for="(tab, index) in tabs" v-if="index === 0 || projectRefItem.id !== undefined" :key="index" class="tablinks tab-container"
          :class="{active:getTabIndex === index && !notifSelected}" @click="getTabData(localTabIndex = index), setSidebarBoolean(true), notifSelected=false"
          :disabled="tab.disabled">
          <span :class='tab.icon'></span>
          <span class='left-al'>{{tab.name}}</span>
        </div>

        <!-- HIDDEN EASTER EGG FOR STRAHINJA -->
        <!-- <div>
          <img src="static/371.gif" width="70px">
        </div> -->
      </div>

      <div class="user-sidebar">

        <div class='tab-container' @click="userOptions">
          <span class='fa fa-user'>
          </span>
          <span class='left-al'>Profile</span>
        </div>

        <div class="tab-container" @click="signOut">
          <span class="fas fa-sign-out-alt"></span>
          <span class='left-al'>Sign Out</span>
        </div>

      </div>

    </div>

    <!-- <div class="sidebar-lower"> -->

    <!-- FIX THIS! -->
    <!-- <span class='leaveme'>
        <span v-if='showArrow' title="Collapse Sidebar" @click="setSidebarBoolean(!sidebarActive)" class='fas fa-angle-double-left collapse-btn'
          :class='{"collapsed":!sidebarActive}'>
        </span>
      </span> -->


    <div class="sidebar-body" ref='sidBody' :class="{ collapsed: !sidebarActive || globalFeed || getTabIndex === 2, darkTheme: darkTheme }">

      <div class="flex-form-action">

        <button id="addItem" class="btn btn-success" @click="addItemButton">
          <span class="fas fa-plus-circle"></span>
          <!-- Add -->
          <!-- <span>{{tabs[getTabIndex].single}}</span> -->
        </button>

        <!-- <div class="form-filter"> -->

        <template v-if="!showSubFilter()">
          <b-form-group>
            <b-input-group :class='{darkTheme:darkTheme}' class='search'>
              <b-input-group-text slot="prepend" @click='focusSearch'>
                <span class="fas fa-search"></span>
              </b-input-group-text>
              <b-form-input ref='search' v-model.trim="tabs[getTabIndex].search" placeholder="Filter items" />
              <b-input-group-append v-if='tabs[getTabIndex].search'>
                <b-btn @click="tabs[getTabIndex].search = ''">X</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </template>

        <template v-if="showSubFilter()">
          <div class='tag-filter'>

            <b-input-group class='search'>

              <multiselect id='tags' @search-change="getTagSuggestions" :loading="tagLoading" v-model='taskSearchTag' :options="tagsNet"
                :preserveSearch="true" :multiple="true" :taggable="false" track-by='id' :custom-label="showTagRes" :close-on-select="false"
                :clear-on-select="true" :show-no-results='false' :hide-selected="true" placeholder="Search by Tags or Text"></multiselect>

            </b-input-group>
          </div>
        </template>

        <template v-if="showSubFilter()">
          <div class="item-filter">
            <b-form-group role="group">
              <b-form-checkbox-group v-model="selectedFilter" :options="radioFilter">
              </b-form-checkbox-group>
            </b-form-group>
          </div>
        </template>

        <!-- </div> -->

      </div>

      <div class="item-list" ref='tabdata' @scroll='tableScroll'>

        <b-table responsive :items="activeArray" thead-class='head-resp' :dark='darkTheme' :small='false' :bordered='false' :outlined='false'
          :fields="fieldsToShow" :filter="tabs[getTabIndex].search" @filtered='removeActiveClass' @row-clicked="selectAndSet">

          <template slot="title" slot-scope="data">
            <span class='td-bold'>{{max50Char(data.item.title)}}</span>
            <span v-if='data.item.can_edit === "true" && getTabIndex === 0' @click.stop="editItemButton(data.item)" class="td-icons float-right py-1 fas fa-edit"
              title="Edit Item"></span>
          </template>

          <!-- CREATED DATE -->
          <template slot="timecreated" slot-scope="data">
            <span v-if='data.item.timecreated!==null'>

              {{$moment(utcToLocal(data.item.timecreated)).format('YYYY-MM-DD')}}
              <span class='table-time'>{{$moment(utcToLocal(data.item.timecreated)).format('HH:mm')}}</span>

            </span>
          </template>

          <!-- DUE DATE -->
          <template slot="deadline" slot-scope="data">
            <span v-if='data.item.deadline!==null'>

              {{$moment(utcToLocal(data.item.deadline)).format('YYYY-MM-DD')}}
              <span class='table-time'>{{$moment(utcToLocal(data.item.deadline)).format('HH:mm')}}</span>

            </span>
          </template>

          <!-- IN PROGRESS TASKS | FOR PROJECTS -->
          <template slot="HEAD_inprogress_tasks" slot-scope="data">
            <span class='fas fa-ellipsis-h' title="InProgress Tasks"></span>
          </template>

          <template slot="inprogress_tasks" slot-scope="data">
            <span class='badge badge-primary' v-if='data.item.inprogress_tasks !== 0'>{{data.item.inprogress_tasks}}</span>
          </template>

          <!-- FAILED TASKS | FOR PROJECTS -->
          <template slot="HEAD_failed_tasks" slot-scope="data">
            <span class='fas fa-times-circle' title="Failed Tasks"></span>
          </template>

          <template slot="failed_tasks" slot-scope="data">
            <span class='badge badge-danger' v-if='data.item.failed_tasks !== 0'>{{data.item.failed_tasks}}</span>
          </template>

          <!-- COMPLETED TASKS | FOR PROJECTS -->
          <template slot="HEAD_completed_tasks" slot-scope="data">
            <span class='fas fa-check' title="Completed Tasks"></span>
          </template>

          <template slot="completed_tasks" slot-scope="data">
            <span class='badge badge-success' v-if='data.item.completed_tasks !== 0'>{{data.item.completed_tasks}}</span>
          </template>

          <!-- USERS COUNT -->
          <template slot="HEAD_users_count" slot-scope="data">
            <span class='fas fa-users' title="Users on project"></span>
          </template>

          <template slot="users_count" slot-scope="data">
            <span class='badge badge-purple' v-if='data.item.users_count !== 0'>{{data.item.users_count}}</span>
          </template>

          <!-- TASK TAGS -->
          <template slot="tags" slot-scope="data">
            <span class='badge badge-orange' v-if="data.item.tags.length > 0">{{data.item.tags[0].tag_text}}</span>
            <span v-if='data.item.tags.length > 1'> + {{data.item.tags.length-1}}</span>
          </template>

          <!-- TASK STATUS -->
          <template slot="HEAD_sta_text" slot-scope="data">
            <span class='fas fa-sync-alt' title="Status"></span>
          </template>

          <template slot="sta_text" slot-scope="data">
            <span :title='data.item.sta_text' :class="convertStatus(data.item.sta_text)"></span>
          </template>

          <!-- PRIORITY -->
          <template slot="HEAD_priority" slot-scope="data">
            <span class='fas fa-signal' title="Priority"></span>
          </template>

          <template slot="priority" slot-scope="data">
            <span class='badge' :class='{"badge-danger": data.item.priority===3,
            "badge-warning": data.item.priority===2,
            "badge-success": data.item.priority===1}' v-if='data.item.priority !== null'>{{convertPriority(data.item.priority)}}</span>
          </template>

          <!-- FEEDS -->
          <template slot='HEAD_unseen_feed' slot-scope="data">
            <span class="fas fa-bell" title="Notifications"></span>
          </template>

          <template slot="unseen_feed" slot-scope="data">
            <span class='badge badge-warning' v-if='data.item.unseen_feed !== 0'>{{data.item.unseen_feed}}</span>
          </template>

          <!-- TASK AVATAR WORKING ON -->
          <template slot="HEAD_users" slot-scope="data">
            <span class='fas fa-users' title="Users working on task"></span>
          </template>

          <template slot="users" slot-scope="data">
            <!-- <div> -->
            <avatar v-for='(usr,index) in data.item.usrworking.slice(0,2)' :key='usr.id' :username="usr.name" :src="getAvatar(usr)" :rounded="false"
              :size="24" class='avatar' :class='{"float-left":index===0,"float-right":index!==0}'>
            </avatar>
            <!-- </div> -->
          </template>

        </b-table>
      </div>
    </div>
  </aside>
</template>

<script>
import { store } from "@/store/index.js";
import { api } from "@/api/index.js";
import { mapGetters, mapState } from "vuex";
import { instance as axios } from "@/api/config.js";
// import UserTasks from "./UserTasks";
import GlobalFeed from "@/components/Feed/GlobalFeed.vue";
import Multiselect from "vue-multiselect";
import { baseURL } from "@/api/config.js";
import Avatar from "vue-avatar";
export default {
  components: {
    // UserTasks,
    Multiselect,
    GlobalFeed,
    Avatar
  },
  data() {
    return {
      tagsNet: [],
      taskSearchTag: [],
      taskSearchText: undefined,
      tagLoading: false,
      localTabIndex: 0,
      showTaskPeople: true,
      activePopup: false,
      intervalNotification: null,
      notifSelected: false,
      selectedFilter: [],
      sideHover: false,
      projectRefItem: {},
      radioFilter: [
        {
          text: "Created by me",
          value: "cr"
        },
        {
          text: "Assigned to me",
          value: "as"
        },
        {
          text: "Finished",
          value: "ar"
        }
      ],
      tabs: [
        {
          name: "Projects",
          single: "Project",
          icon: "fas fa-project-diagram",
          search: ""
        },
        {
          name: "Tasks",
          single: "Task",
          icon: "fas fa-tasks",
          search: ""
        }
      ],
      projectFields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
          thClass: "td-blue"
        },
        {
          key: "title",
          label: "Projects",
          sortable: true,
          // class: "flex-td",
          thClass: "td-blue"
        },
        {
          key: "timecreated",
          label: "Created Date",
          sortable: true,
          class: "text-center",
          thClass: "td-blue"
        },
        {
          key: "deadline",
          label: "Due Date",
          sortable: true,
          class: "text-center",
          thClass: "td-blue"
        },
        {
          key: "users_count",
          label: "Users",
          sortable: true,
          class: "text-center td-icon-width",
          thClass: "td-purple"
        },
        {
          key: "inprogress_tasks",
          label: "In Progress",
          sortable: true,
          class: "text-center td-icon-width",
          thClass: "td-blue"
        },
        {
          key: "failed_tasks",
          label: "Failed",
          sortable: true,
          class: "text-center td-icon-width",
          thClass: "td-red"
        },
        {
          key: "completed_tasks",
          label: "Completed",
          sortable: true,
          class: "text-center td-icon-width",
          thClass: "td-green"
        },
        {
          key: "unseen_feed",
          sortable: true,
          class: "text-center td-icon-width ",
          thClass: "td-yellow"
        }
      ],
      taskFields: [
        {
          key: "id",
          label: "ID",
          sortable: true,
          thClass: "td-blue"
        },
        {
          key: "title",
          label: "Tasks",
          sortable: true,
          // class: "flex-td",
          thClass: "td-blue"
        },
        {
          key: "timecreated",
          label: "Created Date",
          sortable: true,
          class: "text-center",
          thClass: "td-blue"
        },
        {
          key: "deadline",
          label: "Due Date",
          sortable: true,
          class: "text-center",
          thClass: "td-blue"
        },
        {
          key: "users",
          label: "Users Working",
          // sortable: true,
          class: "text-center",
          thClass: "td-purple tc-avatar"
        },
        {
          key: "tags",
          label: "Tag",
          sortable: true,
          thClass: "td-blue"
        },
        {
          key: "sta_text",
          label: "Status",
          sortable: true,
          thClass: "td-blue"
        },
        {
          key: "priority",
          sortable: true,
          tdClass: "text-center td-icon-width",
          thClass: "td-blue text-center"
        },
        {
          key: "unseen_feed",
          sortable: true,
          class: "text-center td-icon-width",
          thClass: "td-yellow"
        }
        // {
        //   key: "users",
        //   class: "text-center td-icon-width",
        //   thClass: "td-purple"
        // }
        // {
        //   key: "edit_item",
        //   label: "Edit",
        //   class: "text-center td-icon-width"
        // }
      ]
    };
  },
  watch: {
    getTabIndex(val, oldVal) {
      if (val === 0) {
        this.taskSearchText = "";
        this.selectedFilter = [];
        store.state.sidebarItemSelection[1] = undefined;
        this.projectRefItem = {}; // SETS UNDEFINED PROJECT TO REF STORE TO REMOVE TASKS TAB
        store.commit("setSidebarItemSelection", {
          tabIndex: 1,
          id: undefined
        });
        // store.commit("resetProjectView");
      }
      if (val < 0) return;
      if (val === 1) {
        this.removeActiveClass(null);
        this.getTaskFilterData();
        store.commit("resetTaskView");
      }
    },
    selectedFilter(val) {
      // FIRES WHEN CHECKBOXES CHANGE
      if (val !== undefined && this.getTabIndex === 1) {
        this.getTaskFilterData();
      }
    },
    taskSearchTag() {
      if (this.getTabIndex === 1) this.getTaskFilterData();
    },
    taskSearchText(val) {
      if (val !== undefined && this.getTabIndex === 1) {
        // || val != ""
        this.getTaskFilterData();
      }
    }
  },
  methods: {
    max50Char(val) {
      if (val.length > 50) {
        return val.substring(0, 50) + "...";
      }
      return val;
    },
    showGlobalFeed() {
      if (this.globalFeed) {
        store.commit("setRefreshGlobalFeed", true);
      } else {
        store.commit("showGlobalFeed", true);
      }
    },
    tableScroll(event) {
      let sp = event.target.scrollTop;
      this.$refs.tabdata.getElementsByClassName(
        "head-resp"
      )[0].style.transform =
        sp !== 0 ? "translate(0," + sp + "px)" : "";
    },
    showTagRes({ text }) {
      return `${text}`;
    },
    getTagSuggestions(query) {
      this.taskSearchText = query;
      this.tagLoading = true;
      axios
        .get("projects/:proid/tags", {
          params: {
            proid: this.projectRefItem.id,
            searchstring: query,
            type: "task",
            sid: localStorage.sid
          }
        })
        .then(r => {
          // WHY IS IT UNDEFINED SOMETIMES??
          let arr = r.data.data;
          this.tagsNet = arr !== undefined ? arr : []; // alt need-test: arr || []
          this.tagLoading = false;
        });
    },
    removeActiveClass(e, elParentID) {
      if (elParentID === undefined) {
        let tableEl = document.getElementsByTagName("table")[0];
        if (tableEl !== undefined) {
          let trEl = tableEl.getElementsByTagName("tbody")[0];
          elParentID = trEl;
        }
      }
      if (elParentID === undefined) return;
      let chNodes = elParentID.childNodes;
      for (let index = 0; index < chNodes.length; index++) {
        if (chNodes[index].classList !== undefined)
          chNodes[index].classList.remove("active");
      }
    },
    selectAndSet(item, i, event) {
      let tagName = event.target.tagName;
      let tableRow =
        tagName === "TD"
          ? event.target.parentElement // TD Element
          : event.target.parentElement.parentElement; // SPAN Element
      this.removeActiveClass(null, tableRow.parentElement);

      this.selectItem(item.id);
      if (this.getTabIndex === 0) {
        this.projectRefItem = item;
        store.commit("setTabIndex", {
          tabIndex: 1
        });
        // this.getTabData(); // WHAT IS THIS?
      } else if (this.getTabIndex === 1) {
        // ADD ACTIVE CLASS IF TASKS
        tableRow.classList.add("active");
        store.commit("resetActionAdd");
      }
    },
    getTabData() {
      let index = this.localTabIndex;
      store.commit("setTabIndex", {
        tabIndex: index
      });
      store.commit("showGlobalFeed", false);
      this.removeActiveClass(null);
      switch (index) {
        case 0:
          store.commit("resetGlobalView");
          // store.commit("resetProjectView"); // RETEST
          this.actionTabDataProject();
          break;
        case 1:
          store.commit("resetTaskView");
          this.getTaskFilterData();
          break;
      }
    },
    getAvatar(netVal) {
      let netIcon = "";
      if (netVal.usrimg !== undefined && netVal.usrimg !== null) {
        netIcon = baseURL + netVal.usrimg + "?sid=" + localStorage.sid;
      }
      return netIcon;
    },
    selectItem(itemID) {
      this.tabs[this.getTabIndex].itemIndex = itemID;
      store.commit("setSidebarItemSelection", {
        tabIndex: this.getTabIndex,
        id: itemID
      });
    },
    getTaskFilterData() {
      let cr = this.selectedFilter.includes("cr");
      let as = this.selectedFilter.includes("as");
      let ar = this.selectedFilter.includes("ar");
      this.actionTabDataTask(cr, as, ar);
    },
    actionTabDataProject() {
      clearInterval(this.intervalNotification);
      store.dispatch("getProjects", {
        index: this.getTabIndex
      });
      store.dispatch("getFeedCount");
      this.intervalNotification = setInterval(
        function() {
          this.checkNotifications();
        }.bind(this),
        20000
      );
    },
    actionTabDataTask(cr, as, ar) {
      clearInterval(this.intervalNotification);
      store.dispatch("getTasks", {
        index: this.getTabIndex,
        pro_id: this.projectRefItem.id,
        created: cr,
        assigned: as,
        archived: ar,
        searchstr: this.taskSearchText,
        tagarray: this.tagIds
      });
      store.dispatch("getFeedCount");
      this.intervalNotification = setInterval(
        function() {
          this.checkNotifications();
        }.bind(this),
        20000
      );
    },
    checkNotifications() {
      // EVERY 20 SECONDS
      // REFRESH TAB DATA
      // BREAKS THE UX FLOW - RESETS VIEW
      if (!this.globalFeed) {
        if (this.getTabIndex === 0) {
          this.actionTabDataProject();
        } else if (this.getTabIndex === 1) {
          this.getTaskFilterData();
        }
      }
      store.dispatch("getFeedCount");
    },
    showSubFilter() {
      let i = this.getTabIndex;
      return i === 1 || i === 2;
    },
    addItemButton() {
      this.removeActiveClass();
      store.dispatch("itemAddClick");
    },
    editPeopleButton(item) {
      this.showTaskPeople = true;
    },
    editItemButton(item) {
      this.selectItem(item.id);
      store.dispatch("itemEditClick", item.id);
    },
    deadlineSplit(dateTime) {
      return dateTime !== undefined && dateTime !== null
        ? dateTime.split(" ")[0]
        : "";
    },
    signOut() {
      window.localStorage.removeItem("sid");
      api.sessionActive();
    },
    mouseOverPopup(val) {
      this.activePopup = val;
    },
    focusSearch() {
      this.$refs.search.$el.focus();
    },
    userOptions() {
      this.$router.push("user");
    },
    setSidebarBoolean(val) {
      store.commit("mainFocused", !val);
    },
    convertPriority(priNum) {
      switch (priNum) {
        case 1:
          return "Low";
        case 2:
          return "Med";
        case 3:
          return "High";
      }
      return "";
    },
    convertStatus(sta_text) {
      switch (sta_text) {
        case "In Progress":
          return "td-blue fa fa-hourglass";
        case "Completed":
          return "td-green fa fa-check";
        case "Failed":
          return "td-red fa fa-times";
        case "Cancelled":
          return "td-yellow fa fa-ban";
        default:
          return "NO IMPLEMENT";
      }
    }
  },
  computed: {
    ...mapState({
      getTabIndex: "currentTabIndex",
      itemAction: "itemAction",
      darkTheme: "darkTheme",
      notifCount: "notificationCount",
      globalFeed: "globalFeed",
      sidebarActive: state => !state.mainFocused
    }),
    ...mapGetters({
      selectedItemID: "selectedItemID"
    }),
    notifDisplay() {
      return this.notifCount === 0
        ? ""
        : this.notifCount > 99 ? "99+" : this.notifCount;
    },
    showArrow() {
      return (
        this.itemAction.edit !== undefined ||
        this.itemAction.add !== undefined ||
        (this.getTabIndex === 1 && this.selectedItemID !== undefined)
      );
    },
    activeArray() {
      return store.getters.currentTabData;
    },
    fieldsToShow() {
      if (this.getTabIndex === 0) {
        if (
          this.itemAction.edit !== undefined ||
          this.itemAction.add !== undefined
        ) {
          let shortProj = ["Projects", "Edit"];
          return this.projectFields.filter(item => {
            return shortProj.includes(item.label);
          });
        }
        return this.projectFields;
      } else if (
        this.itemAction.edit !== undefined ||
        this.itemAction.add !== undefined ||
        this.selectedItemID !== undefined
      ) {
        let shortTask = ["ID", "Tasks"];
        return this.taskFields.filter(item => {
          return shortTask.includes(item.label);
        });
      } else if (!this.selectedFilter.includes("ar")) {
        return this.taskFields.filter(item => {
          return item.label !== "Status";
        });
      }
      return this.taskFields;
    },
    tagIds() {
      let local = [];
      this.taskSearchTag.forEach(element => {
        local.push(element.id);
      });
      return local;
    }
  },
  created() {
    // GET FEED TIMER - HAS TO BE IN CREATED
    store.dispatch("getFeedCount");
    this.intervalNotification = setInterval(
      function() {
        this.checkNotifications();
      }.bind(this),
      20000
    );
    document.addEventListener("scroll", this.handleScroll);
    // WRITE CURRENT TAB DATA TO STORE
    store.commit("setSidebarData", {
      tabIndex: this.getTabIndex
    });
    // MAKE REQUEST TO SERVER FOR TAB DATA
    this.getTabData();
    // TEST VER
    // if (this.itemsFiltered !== undefined)
    // console.log("cr " + this.itemsFiltered.length);
  },
  mounted() {
    // SWITCH TO TASKS VIEW IF ONLY ONE PROJECT
    // if (this.itemsFiltered !== undefined)
    //   console.log("mn" + this.itemsFiltered.length);

    if (this.itemsFiltered !== undefined && this.itemsFiltered.length === 1) {
      // console.log(
      //   "Entering single project = " + this.itemsFiltered[0].title
      // );
      this.selectAndSet(this.itemsFiltered[0]);
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalNotification);
  },
  destroyed() {
    document.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
#sidebar {
  display: flex;
  /* flex-direction: column; */
  /* align-items: stretch; */
  z-index: 1;
  background: var(--main-bg-color);
  /* MAYBE REMOVE WIDTH? */
  /* width: 100%; */
}

.darkMain #sidebar {
  background: var(--sec-bg-color);
}

.static-side .fas,
.sidebar-header .fas {
  font-size: 140%;
}

/* SIDEBAR STATIC */

.static-side {
  background: #333842eb;
  color: #eee;
  width: 70px;
  min-width: 70px;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  flex-direction: column;
  transition: all 0.1s ease-in-out;
  z-index: 10;
  /* overflow-x: hidden; */
  /* border-right: 1px solid #444; */
}

.static-side:hover {
  transition-delay: 0.2s;
  z-index: 11;
  width: 180px;
}

.static-side .fas,
.static-side .fa,
.tab-container > img {
  /* padding: 15px 0; */
  width: 70px;
  display: block;
  text-align: center;
  cursor: pointer;
  color: #9599a0;
  font-size: 160%;
}

.static-side > * {
  padding: 5px 0 0 0;
  display: inline;
}

/* TABS START */

.tabs {
  margin: 0 0 auto;
}

.tabs > *,
.user-sidebar > * {
  width: 70px;
  cursor: pointer;
  /* height: 70px; */
}

/* .tabs > *:hover,
.user-sidebar > *:hover
{
  display: inline;
} */

.tab-container {
  width: 100%;
  line-height: 30px;
  display: block;
  color: #dacbcb;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  width: 180px;
  height: 55px;
  margin: 5px 0;
}

.tabs .tab-container:not(:first-child):hover,
.user-sidebar .tab-container:hover {
  background: #686f7b82;
}

.tabs .tab-container:first-child {
  cursor: auto;
}

.tablinks[disabled] {
  color: #0a0a0a;
  background: #4c4c4c;
}

.tabs > .active span {
  color: #e2e5eb;
}

.static-side .fa:hover,
.static-side .fas:hover {
  /* background: #03a9f42e; */
  color: #e2e5eb;
}

.popup.show {
  color: white;
}

.pro-title {
  padding: 0px 12px;
}

/* TABS END */

/* COLLAPSED START */

.collapse-btn {
  transform: rotate(0);
  transition: all 0.3s;
}

.collapse-btn.collapsed {
  transform: rotate(-180deg);
  transition: all 0.3s;
}

.sidebar-body.collapsed {
  padding: 0;
  width: 0;
  min-width: 0;
  max-width: 0;
  border: 0;
}

.sidebar-header.collapsed {
  transition: all 0.5s ease;
  width: 70px;
}

#sidebar.collapsed {
  transition: all 0.5s ease;
  width: 0;
  height: 0;
}

.hideArrow.collapsed {
  background: #2c3233 !important;
}

.sidebar-body.collapsed *,
.sidebar-header.collapsed > div,
.hideArrow .collapse-btn {
  display: none;
}

/* COLLAPSED END */

.sidebar-lower {
  display: flex;
  flex: 1;
}

/* SIDEBAR HEADER */

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  background: #fff;
  padding: 5px 5px 3px;
  font-size: 18px;
  text-align: center;
  height: 40px;
}

/* .sidebar-header > a {
  display: block;
  margin: auto;
} */

.sidebar-header > span {
  margin: auto 0 auto 20px;
  cursor: pointer;
}

.sidebar-header a .oi {
  margin-left: 10px;
}

.sidebar-header > a > .fas {
  margin-right: 15px;
}

.td-icons.fa-edit {
  line-height: 20px;
  color: #28a745;
  padding: 0 7px;
}

.td-icon-width {
  width: 40px;
}

.td-bold {
  font-weight: bolder;
}

/* TASK LIST END */

.avatar {
  border-radius: 5px !important;
  display: block;
  margin-top: 3px;
  padding: 0
}

#btn-pocetak {
  position: relative;
  top: 85%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

#menu-toggle {
  margin-right: 10px;
}

h1,
h2 {
  text-align: center;
}

#header {
  border-bottom: 1px solid gray;
  background: #ffb33b;
}

#kat-web {
  margin: auto;
}

/* SEARCH START*/

.search {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.darkTheme .input-group-text {
  background-color: whitesmoke;
  border: 1px solid #d2d2d236;
}

.darkTheme .search .form-control {
  background-color: #232323 !important;
  border: 1px solid #d2d2d236;
}

.search .form-control {
  background-color: #fff;
  border: 1px solid #d2d2d2b3;
}

.input-group-text {
  background-color: whitesmoke;
  border: 1px solid #d2d2d2b3;
}

.multiselect {
  margin: auto;
}

/* SEARCH END*/

/* ADD BUTTON */

#addItem {
  max-width: 130px;
  align-self: center;
  margin: 0 auto 0.6rem 4px;
}

#addItem:hover {
  box-shadow: 0 0 20px 1px rgba(19, 255, 45, 0.2);
}

.headeritem:hover {
  color: gray;
  cursor: pointer;
}

/* SIDEBAR BODY */

.sidebar-body {
  max-width: 100%;
  transition: all 0.5s ease;
  width: 0px;
  margin-left: 70px;
  /* FOR USE WHEN STATIC SIDE IS POSITION FIXED */
  background: var(--main-bg-color);
  flex: 1;
  height: 93vh;
  display: flex;
  flex-direction: column;
  padding: 35px 35px 20px 35px;
  border-right: 1px solid #a5adb53d;
}

.sidebar-body.darkTheme {
  background: var(--sec-bg-color);
}

.flex-form-action {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}

.form-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.flex-form-action fieldset {
  align-self: center;
}

.form-filter > * {
  margin: auto 5px;
}

.flex-form-action > form {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 0.6rem;
}

.tag-filter {
  flex: 1;
  margin-bottom: 10px;
  max-width: 200px;
}

.item-filter {
  display: flex;
  justify-content: space-around;
}

.table-time {
  margin-left: 15px;
}

.user-sidebar img {
  height: 40px;
  margin: 10px auto;
  border-radius: 5px;
  display: block;
}

label {
  margin: 0;
}

.feed-wrap {
  display: flex;
  margin-left: 70px;
  margin: 0 auto;
}

.left-al {
  text-align: left !important;
  margin-left: 5px;
}

#enon-img {
  position: absolute;
  top: 10px;
  margin-left: 21px;
  height: 35px;
  width: 34px;
}

#enon-full-img {
  position: absolute;
  top: 10px;
  height: 35px;
  width: 140px;
  margin-left: 21px;
}

.tab-container .count {
  color: black !important;
  position: absolute;
  top: 8px;
  left: 37px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.switch-enter-active,
.switch-leave-active {
  /* transition-delay: .5s; */
  transition: all 1s;
}

.switch-enter,
.switch-leave-active {
  opacity: 0;
}

@media screen and (max-width: 1200px) {
  .sidebar-body {
    padding: 25px 15px 10px 15px;
  }
}

@media screen and (max-width: 992px) {
  .sidebar-lower {
    height: 50vh;
  }
  /* .sidebar-body {
    visibility: hidden;
    padding: 0;
  } */
  #sidebar.max {
    height: 100vh;
  }
}

@media screen and (max-width: 700px) {
  .flex-form-action {
    justify-content: center;
  }
}
</style>
