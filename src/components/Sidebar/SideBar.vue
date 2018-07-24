<template>
  <aside id="sidebar" :class="{ collapsed: !sidebarActive || globalFeed }">

    <!-- <div class="sidebar-header" :class="{ collapsed: !sidebarActive || globalFeed, hideArrow: !showArrow }">    
      <div>
        <button class="btn pro-title" v-if='currentTabIndex !== 0' @click="getTabData(currentTabIndex = 0)">
          <strong>
            <span class='fa fa-arrow-left'></span>
          </strong>
        </button>
        <span v-if='currentTabIndex !== 0 && project.title != undefined'> Project: {{ project.title }} /</span>
        <span> {{ tabs[currentTabIndex].name }}</span>
      </div>
      <span></span>
    </div> -->


      <div class="static-side">

        <div class="tabs">
          <div class="tab-container" @click='showGlobalFeed(),notifSelected=true' :class="{active:notifSelected}">
            <span class="fas fa-bell"></span>
            <span class="badge badge-success count">{{notifDisplay}}</span>
            <!-- <transition name='slide'> -->
              <span class='left-al'>Notifications</span>
            <!-- </transition> -->
          </div>

          <div v-for="(tab, index) in tabs" v-if="index === 0 || project.id !== undefined" :key="index" class="tablinks tab-container" :class="{active:currentTabIndex === index && !notifSelected}"
            @click="getTabData(currentTabIndex = index), setSidebarBoolean(true), notifSelected=false" :disabled="tab.disabled">
            <span :class='tab.icon'></span>
            <span class='left-al'>{{tab.name}}</span>
          </div>
        </div>

        <div class="user-sidebar">

          <!-- <div class="theme-placeholder" @click='changeTheme'>
            <span class='theme-changer' :class='{darkTheme : darkTheme}'></span>
            <span class='left-al'>Theme</span>
          </div> -->

          <div class='tab-container' @click="userOptions">
            <!-- <transition name='fade'>
              <user-popup v-show='activePopup' :class='{show: activePopup}' />
            </transition> -->
            <span class='fa fa-user'>
              <!-- <img :src="avatarUrl" @mouseover='mouseOverPopup(true)' @mouseleave='mouseOverPopup(false)' /> -->
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


      <div class="sidebar-body" ref='sidBody' :class="{ collapsed: !sidebarActive || globalFeed || currentTabIndex === 2, darkTheme: darkTheme }">

        <div class="flex-form-action">

          <button id="addItem" class="btn btn-block btn-success" @click="addItemButton">
            <span class="fas fa-plus-circle"></span> Add New
            <span>{{tabs[currentTabIndex].single}}</span>
          </button>

          <div class="form-filter">

            <template v-if="!showSubFilter()">
              <b-form-group>
                <b-input-group :class='{darkTheme:darkTheme}' class='search'>
                  <b-input-group-text slot="prepend">
                    <span class="fas fa-search" @click='focusSearch'></span>
                  </b-input-group-text>
                  <b-form-input ref='search' v-model.trim="tabs[currentTabIndex].search" placeholder="Filter items" />
                  <b-input-group-append v-if='tabs[currentTabIndex].search'>
                    <b-btn @click="tabs[currentTabIndex].search = ''">X</b-btn>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </template>

            <template v-if="showSubFilter()">
              <div class='tag-filter'>

                <b-input-group class='search'>

                  <multiselect id='tags' @search-change="getTagSuggestions" :loading="tagLoading" v-model='taskSearchTag' :options="tagsNet" :preserveSearch="true"
                    :multiple="true" :taggable="false" track-by='id' :custom-label="showTagRes" :close-on-select="false" :clear-on-select="false" :show-no-results='false'
                    :hide-selected="true" placeholder="Search by Tags or Text"></multiselect>

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

          </div>

        </div>

        <div class="item-list" ref='tabdata' @scroll='tableScroll'>

          <b-table responsive :items="activeArray" thead-class='head-resp' :dark='darkTheme' :small='false'
            :bordered='false' :outlined='false' :fields="fieldsToShow" :filter="tabs[0].search" @filtered='removeActiveClass' @row-clicked="selectAndSet">

            <template slot="title" slot-scope="data" >
              <span>{{data.item.title}} </span>
              <!-- <span v-if='data.item.can_edit === "true"' @click.stop="editItemButton(data.item)" class="td-icons fas fa-edit"
                title="Edit Item"></span> -->
            </template>
            
            <!-- DUE DATE -->
            <template slot="due_date" slot-scope="data">
              <span v-if='data.item.pro_deadline!==null'>{{$moment(data.item.pro_deadline).format('YYYY-MM-DD')}}</span>
            </template>

            <!-- DUE TIME -->
            <template slot="due_time" slot-scope="data">
              <span v-if='data.item.pro_deadline!==null'>{{$moment(data.item.pro_deadline).format('HH:mm')}}</span>
            </template>


            <!-- IN PROGRESS TASKS -->
            <template slot="HEAD_inprogress_tasks" slot-scope="data">
              <span class='fas fa-ellipsis-h' title="InProgress Tasks"></span>
            </template>

            <template slot="inprogress_tasks" slot-scope="data">
              <span class='badge badge-primary' v-if='data.item.inprogress_tasks !== 0'>{{data.item.inprogress_tasks}}</span>
            </template>

            <!-- FAILED TASKS -->
            <template slot="HEAD_failed_tasks" slot-scope="data">
              <span class='fas fa-times-circle' title="Failed Tasks"></span>
            </template>

            <template slot="failed_tasks" slot-scope="data">
              <span class='badge badge-danger' v-if='data.item.failed_tasks !== 0'>{{data.item.failed_tasks}}</span>
            </template>

            <!-- COMPLETED TASKS -->
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
            
            <!-- FEEDS -->
            <template slot='HEAD_unseen_feed' slot-scope="data">
              <span class="fas fa-bell" title="Notifications"></span>
            </template>

            <template slot="unseen_feed" slot-scope="data">
              <span class='badge badge-success' v-if='data.item.unseen_feed !== 0'>{{data.item.unseen_feed}}</span>
            </template>



            <!-- <template slot='HEAD_users' slot-scope="data">
                  <span @click.stop="editPeopleButton(data.item)" class="td-icons fas fa-user" title="Edit People"></span>
            </template> -->

            
            <!-- STATUS -->
            <template slot="HEAD_sta_text" slot-scope="data">
              <span class='fas fa-sync-alt' title="Status"></span>
            </template>

            <!-- <template slot="sta_text" slot-scope="data">
              <span class='badge badge-warning' v-if='data.item.sta_text !== 0'>{{data.item.sta_text}}</span>
            </template> -->

            <!-- TASK USERS -->
            <template slot="HEAD_users" slot-scope="data">
              <span class='fas fa-users' title="View users on task"></span>
            </template>

            <template slot='users' slot-scope="data">
              <span @click.stop="editPeopleButton(data.item)" class="td-icons fas fa-user" title="Edit People"></span>
            </template>

          </b-table>
        </div>
      </div>
    <!-- </div> -->

    <user-tasks v-if='showTaskPeople'></user-tasks>

  </aside>
</template>

<script>
import { store } from "@/store/index.js";
import { api } from "@/api/index.js";
import { mapGetters, mapState } from "vuex";
import { instance as axios } from "@/api/config.js";
import UserPopup from "./UserPopup";
import UserTasks from "./UserTasks";
import GlobalFeed from "@/components/Feed/GlobalFeed.vue";
import Multiselect from "vue-multiselect";
import { baseURL } from "@/api/config.js";
export default {
  components: {
    UserPopup,
    UserTasks,
    Multiselect,
    GlobalFeed
  },
  data() {
    return {
      tagsNet: [],
      taskSearchTag: [],
      taskSearchText: undefined,
      tagLoading: false,
      scrollPos: 0,
      avatarUrl: "",
      currentTabIndex: 0,
      showTaskPeople: true,
      activePopup: false,
      intervalNotification: null,
      notifSelected: false,
      selectedFilter: [],
      project: {
        title: undefined,
        id: undefined
      },
      radioFilter: [
        {
          text: "Created",
          value: "cr"
        },
        {
          text: "Assigned",
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
        },
        {
          name: "Configuration",
          single: "Task",
          icon: "fas fa-cog"
        }
        // {
        //   name: "Users",
        //   single: "Task",
        //   icon: "fas fa-users",
        //   search: ""
        // }
      ],
      projectFields: [
        {
          key: "title",
          label: "Projects",
          sortable: true,
          class: "flex-td",
          thClass: "td-blue"
        },
        {
          //key: 'pro_deadline',
          key: "due_date",
          label: "Due Date",
          // sortable: true,
          class: "text-center",
          thClass: "td-blue"
        },
        {
          key: "due_time",
          label: "Due Time",
          // sortable: true,
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
          label: "N",
          // sortable: true,
          class: "text-center td-icon-width ",
          thClass: "td-yellow"
        }
        // {
        //   key: "edit_item",
        //   label: "Edit",
        //   class: "text-center td-icon-width"
        // }
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
          class: "flex-td",
          thClass: "td-blue"
        },
        {
          key: "sta_text",
          label: "Status",
          sortable: true,
          thClass: "td-orange"
        },
        {
          key: "unseen_feed",
          // sortable: true,
          class: "text-center td-icon-width",
          thClass: "td-yellow"
        },
        {
          key: "users",
          class: "text-center td-icon-width",
          thClass: "td-purple"
        }
        // {
        //   key: "edit_item",
        //   label: "Edit",
        //   class: "text-center td-icon-width"
        // }
      ]
    };
  },
  watch: {
    globalFeed(val) {
      // console.log(this.$refs.sidBody);
      // this.$refs.sidBody.classList(
      //   "sidebar-body"
      // )[0].style.display = val ? "none" : "flex";
    },
    currentTabIndex(val) {
      this.taskSearchText = "";
      if (val === 1) this.selectedFilter = [];
      if (val < 0) return;
      this.removeActiveClass(null);
      if (this.tabs[val].itemIndex === undefined) {
        // IF ITEM INDEX IS UNDEFINED, COMMIT TO STORE
        store.commit("setSidebarItemSelection", {
          index: this.currentTabIndex,
          id: undefined
        });
      }
    },
    selectedFilter() {
      // FIRES WHEN CHECKBOXES CHANGE
      this.getTaskFilterData();
    },
    taskSearchTag() {
      this.getTaskFilterData();
    },
    taskSearchText(val) {
      if (val !== undefined || val != "") this.getTaskFilterData();
    },
    scrollPos(val) {}
  },
  methods: {
    showGlobalFeed() {
      // this.currentTabIndex = -1;
      store.commit("showGlobalFeed", true);
      // this.$refs.sidBody.style.display = "none";
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
            proid: this.project.id,
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
    getAvatar() {
      let link = "auth/users/img";
      let localImg = "static/img/user.png";
      axios
        .get(link, {
          params: {
            sid: localStorage.sid
          }
        })
        .then(r => {
          if (r.data["unset key"] === null) {
            this.avatarUrl = localImg;
          } else this.avatarUrl = baseURL + link + "?sid=" + localStorage.sid;
        });
    },
    removeActiveClass(e, elParentID) {
      if (elParentID === undefined) {
        elParentID = document
          .getElementsByTagName("table")[0]
          .getElementsByTagName("tbody")[0];
      }
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
      if (this.currentTabIndex === 0) {
        this.project = item;
        this.currentTabIndex = 1;
        // this.getTabData(); // WHAT IS THIS?
      } else if (this.currentTabIndex === 1) {
        // ADD ACTIVE CLASS IF TASKS
        tableRow.classList.add("active");
      }
    },
    getTabData() {
      let index = this.currentTabIndex;
      this.currentTabIndex = -1;
      this.currentTabIndex = index;
      store.commit("showGlobalFeed", false);
      // this.$refs.sidBody.style.display = "flex";
      switch (index) {
        case 0:
          // SETS UNDEFINED PROJECT TO STORE TO REMOVE TASKS TAB
          this.project = {};
          this.actionTabDataProject();
          break;
        case 1:
          this.getTaskFilterData();
          break;
      }
    },
    selectItem(itemID) {
      this.tabs[this.currentTabIndex].itemIndex = itemID;
      store.commit("setSidebarItemSelection", {
        index: this.currentTabIndex,
        id: itemID
      });
    },
    getTaskFilterData() {
      let cr = this.selectedFilter.includes("cr");
      let as = this.selectedFilter.includes("as");
      let ar = this.selectedFilter.includes("ar");
      this.actionTabDataTask(cr, as, ar);
    },
    actionTabDataTask(cr, as, ar) {
      clearInterval(this.intervalNotification);
      store.dispatch("getTasks", {
        index: this.currentTabIndex,
        pro_id: this.project.id,
        created: cr,
        assigned: as,
        archived: ar,
        searchstr: this.taskSearchText,
        tagarray: this.tagIds
      });
      this.intervalNotification = setInterval(
        function() {
          this.checkNotifications();
        }.bind(this),
        20000
      );
    },
    actionTabDataProject() {
      clearInterval(this.intervalNotification);
      store.dispatch("getProjects", {
        index: this.currentTabIndex
      });
      this.intervalNotification = setInterval(
        function() {
          this.checkNotifications();
        }.bind(this),
        20000
      );
    },
    checkNotifications() {
      // EVERY 20 SECONDS
      store.dispatch("getFeedCount");
      // REFRESH TAB DATA
      // BREAKS THE UX FLOW - RESETS VIEW
      // if (this.currentTabIndex === 0) {
      //   this.actionTabDataProject();
      // }
      // else if (this.currentTabIndex === 1) {
      //   this.getTaskFilterData();
      // }
    },
    showSubFilter() {
      let i = this.currentTabIndex;
      return i === 1 || i === 2;
    },
    addItemButton() {
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
    changeTheme() {
      localStorage.dark = !this.darkTheme;
      store.commit("darkTheme", !this.darkTheme);
    },
    userOptions() {
      this.$router.push("user");
    },
    setSidebarBoolean(val) {
      store.commit("mainFocused", !val);
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
        : this.notifCount > 99 ? "99+" : this.notif;
    },
    showArrow() {
      return (
        this.itemAction.edit !== undefined ||
        this.itemAction.add !== undefined ||
        (this.currentTabIndex === 1 && this.selectedItemID !== undefined)
      );
    },
    activeArray() {
      return store.getters.currentTabData;
    },
    fieldsToShow() {
      if (this.currentTabIndex === 0) {
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
        let shortTask = ["ID", "Tasks", "Users", "Edit"];
        return this.taskFields.filter(item => {
          return shortTask.includes(item.label);
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
    this.getAvatar();

    // GET FEED TIMER - HAS TO BE IN CREATED
    store.dispatch("getFeedCount");
    this.intervalNotification = setInterval(
      function() {
        this.checkNotifications("INITIAL SETUP");
      }.bind(this),
      20000
    );
    document.addEventListener("scroll", this.handleScroll);
    // WRITE CURRENT TAB TO STORE
    store.commit("setSidebarData", {
      index: this.currentTabIndex
    });
    // MAKE REQUEST TO SERVER FOR TAB DATA
    this.getTabData();
    // TEST VER
    if (this.itemsFiltered !== undefined)
      console.log("cr " + this.itemsFiltered.length);
  },
  mounted() {
    // SWITCH TO TASKS VIEW IF ONLY ONE PROJECT
    // if (this.itemsFiltered !== undefined)
    //   console.log("mn" + this.itemsFiltered.length);

    if (this.itemsFiltered !== undefined && this.itemsFiltered.length === 1) {
      console.log(
        "Ubacujem u jedini projekat = " + this.itemsFiltered[0].title
      );
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
  /* overflow-x: hidden; */
  /* border-right: 1px solid #444; */
}

.static-side:hover {
  transition-delay: 0.2s;
  z-index: 11;
  width: 180px;
}

.static-side .fas,
.static-side .fa {
  padding: 15px 0;
  width: 70px;
  display: block;
  text-align: center;
  cursor: pointer;
  color: #9599a0;
  font-size: 160%;
}

/* .user-sidebar > * > span {
  width: 70px;
  display: block;
  text-align: center;
  cursor: pointer;
  color: #fff;
} */

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
  width: unset;
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

/* TASK LIST END */

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
  max-width: 210px;
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
  /* margin: auto; */
  /* width: 30rem; */
}

.form-filter fieldset {
  /* display: block; */
  width: 100%;
}

.form-filter > * {
  margin: auto 5px;
}

.form-filter > form {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 0.6rem;
}

.tag-filter {
  flex: 1;
  margin-bottom: 10px;
}

.item-filter {
  display: flex;
  justify-content: space-around;
}

.badge-purple {
  background: #bf6cd6;
  color: #fff;
}

.user-sidebar img {
  height: 40px;
  margin: 10px auto;
  border-radius: 5px;
  display: block;
}

/* .user-sidebar .user-placeholder {
  position: relative;
} */

label {
  margin: 0;
}

.feed-wrap {
  display: flex;
  margin-left: 70px;
  margin: 0 auto;
}

.theme-changer.darkTheme {
  background: var(--main-bg-color);
}

.theme-changer.darkTheme:hover {
  background: rgba(228, 228, 228, 0.7);
}

.theme-changer {
  border-radius: 50%;
  border: 1px solid #fff03799;
  box-shadow: 0 0 2px #fff81d;
  background: var(--sec-bg-color);
  margin: 16px 22px;
  width: 30px !important;
  height: 30px;
}

.left-al {
  text-align: left !important;
  margin-left: 5px;
}

.tab-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 180px;
}

.tab-container .count {
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

.slide-enter-active,
.slide-leave-active {
  transition-delay: 3s;
  transition: opacity 0.5s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}

@media screen and (max-width: 992px) {
  .sidebar-lower {
    height: 50vh;
  }
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
