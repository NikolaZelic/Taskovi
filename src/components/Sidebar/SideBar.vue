<template>
  <aside id="sidebar" :class="{ collapsed: !sidebarActive }">

    <div class="sidebar-header" :class="{ collapsed: !sidebarActive }">
      <span>
        <span v-show='itemAction.edit !== undefined || itemAction.add !== undefined || taskID !== undefined' title="Collapse Sidebar"
          @click="setSidebarBoolean(!sidebarActive)" class='fas fa-angle-double-left collapse-btn' :class='{"collapsed":!sidebarActive}'>
        </span>
      </span>
      <div>
        <a v-if='currentTabIndex !== 0' @click="getTabData(currentTabIndex = 0)">
          <button class="btn btn-warning pro-title">
            <strong>{{ project.title }}</strong>
          </button> / </a>
        <span>{{ tabs[currentTabIndex].name }}</span>
        <span v-if='totalRows !== 0' class='badge badge-dark'>{{ totalRows }}</span>
      </div>
      <span></span>
    </div>

    <div class="sidebar-lower">

      <div class="static-side">

        <div class="tabs">
          <div class="notif">
            <span class="fas fa-bell"></span>
            <span class="badge badge-success count">{{notifCount === 0 ? '' : notifCount}}</span>
            <transition name='slide'>
              <span class='left-al'>Notifications</span>
            </transition>
          </div>

          <div v-for="(tab, index) in tabs" v-if="index === 0 || project.id !== undefined" :key="index" class="tablinks" :class="{active:currentTabIndex === index}"
            @click="getTabData(currentTabIndex = index), setSidebarBoolean(true)" :disabled="tab.disabled">
            <span :class='tab.icon'></span>
            <span class='left-al'>{{tab.name}}</span>
          </div>
        </div>

        <div class="user-sidebar">

          <div class="theme-placeholder">
            <span @click='changeTheme' class='theme-changer' :class='{darkTheme : darkTheme}'></span>
            <span class='left-al'>Theme</span>
          </div>

          <div class='user-placeholder'>
            <transition name='fade'>
              <user-popup v-show='activePopup' :class='{show: activePopup}' />
            </transition>
            <span>
              <img :src="avatarUrl" @click="userOptions" @mouseover='mouseOverPopup(true)' @mouseleave='mouseOverPopup(false)' />
            </span>
            <span class='left-al'>Options</span>
          </div>

          <div class="logout-placeholder">
            <span class="fas fa-sign-out-alt" @click="signOut"></span>
            <span class='left-al'>Sign Out</span>
          </div>

        </div>

      </div>

      <div class="sidebar-body" :class="{ collapsed: !sidebarActive, darkTheme: darkTheme }">

        <div class="flex-form-action">

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

                  <multiselect id='tags' @search-change="getTagSuggestions" :loading="tagLoading" v-model='tagsInput' :options="tagsNet" :preserveSearch="true"
                    :multiple="true" :taggable="false" track-by='id' :custom-label="showTagRes" :close-on-select="false" :clear-on-select="false"
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

          <button id="addItem" class="btn btn-block btn-success" @click="addItemButton">
            <span class="fas fa-plus-circle"></span> Add New
            <span>{{tabs[currentTabIndex].single}}</span>
          </button>
        </div>

        <div class="item-list" ref='tabdata' @scroll='tableScroll'>

          <b-table responsive :items="activeArray" thead-class='head-resp' :dark='darkTheme' :striped='false' :hover='false' :small='true'
            :bordered='true' :fields="fieldsToShow" :filter="tabs[currentTabIndex].search" @filtered="onFiltered" @row-clicked="selectAndSet">

            <!-- FIX ACTIVE ITEM SELECTION!!!!!!!!!!!!!!!!1 -->
            <template slot="title" slot-scope="data" :class="{ active: activeItem === data.item.id}">
              <span>{{data.item.title}}</span>
            </template>

            <template slot="unseen_feed" slot-scope="data">
              <span class='badge badge-success' v-if='data.item.unseen_feed !== 0'>{{data.item.unseen_feed}}</span>
            </template>

            <template slot='HEAD_unseen_feed' slot-scope="data">
              <span class="fas fa-bell" title="Notifications"></span>
            </template>

            <!-- <template slot='HEAD_users' slot-scope="data">
                  <span @click.stop="editPeopleButton(data.item)" class="td-icons fas fa-user" title="Edit People"></span>
            </template> -->

            <template slot='users' slot-scope="data">
              <span @click.stop="editPeopleButton(data.item)" class="td-icons fas fa-user" title="Edit People"></span>
            </template>

            <template slot="edit_item" slot-scope="data">
              <button v-if='data.item.can_edit === "true"' @click.stop="editItemButton(data.item)" class="td-icons btn btn-warning fas fa-edit"
                title="Edit Item"></button>
            </template>

          </b-table>

        </div>

      </div>

    </div>

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
import Multiselect from "vue-multiselect";
import { baseURL } from "@/api/config.js";
export default {
  components: {
    UserPopup,
    UserTasks,
    Multiselect
  },
  data() {
    return {
      tagsNet: [],
      tagsInput: [],
      tagsText: undefined,
      tagLoading: false,
      scrollPos: 0,
      // sideHover: false,
      avatarUrl: "",
      totalRows: this.activeArray === undefined ? 0 : this.activeArray.length,
      currentTabIndex: 0,
      showTaskPeople: true,
      activePopup: false,
      activeItem: undefined,
      intervalNotification: null,
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
        }
      ],
      projectFields: [
        {
          key: "title",
          label: "Projects",
          sortable: true
        },
        {
          key: "pro_deadline",
          label: "Deadline",
          sortable: true,
          class: "text-center"
        },
        {
          key: "users_count",
          label: "Users on Project",
          sortable: true,
          class: "text-center"
        },
        {
          key: "inprogress_tasks",
          label: "In Progress Tasks",
          sortable: true,
          class: "text-center"
        },
        {
          key: "failed_tasks",
          label: "Failed Tasks",
          sortable: true,
          class: "text-center"
        },
        {
          key: "completed_tasks",
          label: "Completed Tasks",
          sortable: true,
          class: "text-center"
        },
        {
          key: "unseen_feed",
          label: "N",
          // sortable: true,
          class: "text-center td-icon-width"
        },
        {
          key: "edit_item",
          label: "Edit",
          class: "text-center td-icon-width"
        }
      ],
      taskFields: [
        {
          key: "id",
          label: "ID",
          sortable: true
        },
        {
          key: "title",
          label: "Tasks",
          sortable: true
        },
        {
          key: "sta_text",
          label: "Status",
          sortable: true
        },
        {
          key: "unseen_feed",
          // sortable: true,
          class: "text-center td-icon-width"
        },
        {
          key: "users",
          class: "text-center td-icon-width"
        },
        {
          key: "edit_item",
          label: "Edit",
          class: "text-center td-icon-width"
        }
      ]
    };
  },
  watch: {
    selectedFilter() {
      this.getTaskFilterData();
    },
    currentTabIndex(val) {
      let tabItem = this.tabs[val].itemIndex;
      this.tagsText = "";
      // HAVE TO CHECK IF AN ITEM WITH THE SPECIFIED ID EXIST ON THE LIST TO DISPLAY IT
      if (tabItem === undefined) {
        store.commit("setSidebarItemSelection", {
          index: this.currentTabIndex,
          id: undefined
        });
      } else {
        for (var i = 0; i < this.itemsFiltered; i++) {
          if (this.itemsFiltered[i].id === tabItem) {
            // ID FOUND
            this.activeItem = tabItem; // MERGE ACTIVEITEM AND TABITEM IN FUTURE IF U CAN
            return;
          }
        }
        this.activeItem = undefined;
        store.commit("setSidebarItemSelection", {
          index: this.currentTabIndex,
          id: undefined
        });
      }
    },
    // IS IT USED???
    adminFilter(val) {
      console.log("HELLO FROM ADMINFILTER");
      let i = this.currentTabIndex;
      this.tabs[i].isAdmin = val;
      this.actionTabDataTeam();
    },
    tagsInput(val) {
      // this.tagsText = "";
      // WHEN A TAG IS CHANGED INVOKE API TASKS GET
      // console.log(val.length);
      this.getTaskFilterData();
    },
    tagsText(val) {
      if (val !== undefined || val != "") this.getTaskFilterData();
    },
    scrollPos(val) {}
  },
  methods: {
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
      this.tagsText = query;
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
          this.tagsNet = arr !== undefined ? arr : [];
          this.tagLoading = false;
        });
    },
    getAvatar() {
      let link = "auth/users/img";
      axios
        .get(link, {
          params: {
            sid: localStorage.sid
          }
        })
        .then(r => {
          this.avatarUrl = baseURL + link + "?sid=" + localStorage.sid;
        });
    },
    selectAndSet(item) {
      this.selectItem(item.id);
      this.activeItem = item.id;
      if (this.currentTabIndex === 0) {
        this.project = item;
        this.currentTabIndex = 1;
        this.getTabData();
      }
    },
    getTabData() {
      let index = this.currentTabIndex;
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
        searchstr: this.tagsText,
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

      // FIX TIMERS

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
      this.activeItem = item.id;
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
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
    }
  },
  computed: {
    ...mapState({
      getTabIndex: "currentTabIndex",
      itemAction: "itemAction",
      darkTheme: "darkTheme",
      notifCount: "notificationCount",
      sidebarActive: state => !state.mainFocused
    }),
    ...mapGetters({
      taskID: "selectedItemID"
    }),
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
        this.taskID !== undefined
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
      this.tagsInput.forEach(element => {
        local.push(element.id);
      });
      return local;
    }
  },
  created() {
    this.getAvatar();
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

    store.dispatch("getFeedCount");
    this.intervalNotification = setInterval(
      function() {
        this.checkNotifications();
      }.bind(this),
      20000
    );
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
  flex-direction: column;
  align-items: stretch;
}

.static-side .fas,
.sidebar-header .fas {
  font-size: 140%;
}

/* SIDEBAR STATIC */

.static-side {
  background: #222829f7;
  color: #eee;
  width: 70px;
  min-width: 70px;
  display: flex;
  flex-direction: column;
  transition: all 0.1s ease-in-out;
  z-index: 9;
  /* overflow-x: hidden; */
  /* border-right: 1px solid #444; */
}

.static-side:hover {
  transition-delay: 0.3s;
  width: 180px;
  /* position: fixed;
  height: 100vh; */
  /* width: 100px; */
}

.tablinks > span,
.user-sidebar > * > .left-al,
.notif .fa-bell {
  padding: 15px 0;
  width: 70px;
  display: block;
  text-align: center;
  cursor: pointer;
  color: #fff;
}

.user-sidebar > * > span {
  width: 70px;
  display: block;
  text-align: center;
  cursor: pointer;
  color: #fff;
}

.static-side > * {
  padding: 5px 0;
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

.notif,
.tablinks,
.user-sidebar > * {
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

.tablinks.active {
  background: #24262d;
  border-left: 3px solid var(--ac-color);
}

.tablinks.active span {
  color: yellow;
}

.notif:hover,
.user-sidebar > *:hover {
  background: #eadc903b;
  color: var(--ac-color-light);
}

.popup.show {
  color: white;
}

.pro-title {
  padding: 3px 20px;
  background-color: #ffcf3d;
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

.sidebar-body.collapsed *,
.sidebar-header.collapsed > div {
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
  background: var(--ac-bg-light-color);
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
  min-width: 400px;
  max-width: 700px;
  margin: auto;
}

.input-group-text,
.search .form-control {
  border-color: #717171;
}

.search .form-control {
  min-width: 300px;
}

/* SEARCH END*/

/* ADD BUTTON */

#addItem {
  max-width: 300px;
  align-self: center;
  margin-bottom: 1rem;
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
  width: 100%;
  flex: 1;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-right: 1px solid var(--ac-color-dark);
}

.flex-form-action {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.form-filter > form {
  margin-bottom: 10px;
}

.tag-filter {
  margin-bottom: 10px;
}

.item-filter {
  display: flex;
  justify-content: space-around;
}

.badge-purple {
  background: #8c28a7;
}

.user-sidebar img {
  height: 40px;
  margin: 10px auto;
  border-radius: 15px;
  display: block;
}

.user-sidebar .user-placeholder {
  position: relative;
}

label {
  margin: 0;
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
  margin: 22px;
  width: 30px !important;
  height: 30px;
}

.left-al {
  text-align: left !important;
}

.notif,
.tablinks,
.theme-placeholder,
.user-placeholder,
.logout-placeholder {
  position: relative;
  display: flex;
  align-items: center;
  width: 180px;
}

.notif .count {
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
</style>
