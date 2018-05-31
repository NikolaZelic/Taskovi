<template>
<aside id="sidebar" :class="{ collapsed: isCollapsedSidebar }">
  <div class="static-side">
    <span title="Collapse Sidebar" class="fas fa-bars" @click="collapseSidebar"></span>

    <div class="tabs">
      <button v-for="( tab, index ) in tabs" :key="index" :title="tab.name" class="tablinks" :class="[{active:currentTabIndex == index}, tab.icon]" @click="getTabData($event,currentTabIndex = index)">
        </button>
    </div>

    <div class="user-sidebar">
      <span title="User Options" class="fas fa-user-cog"></span>
      <span title="Sign Out" class="fas fa-sign-out-alt"></span>
    </div>
  </div>
  <div class="sidebar-content" :class="{ collapsed: isCollapsedSidebar }">
    <div class="sidebar-header">
      <a>{{ tabTitle }}
          <span class="fas fa-check"></span>
        </a>
      <span title="Refresh" class="fas fa-sync-alt" @click="refreshData"></span>
    </div>
    <div class="sidebar-body">
      <form class="form-block">
        <div class="search">
          <span class="fas fa-search"></span>
          <input class="form-control mr-sm-2 hidden-md-down" v-model.trim="searchData" type="search" placeholder="Search" aria-label="Search">
        </div>
      </form>
      <form v-if="activeSubFilter()" class="btn-group" role="group" aria-label="Item Filter">
        <button @click="getTabData('cr')" type="button" class="btn btn-warning">Created</button>
        <button @click="getTabData('as')" type="button" class="btn btn-warning">Assigned</button>
        <button @click="getTabData('ar')" type="button" class="btn btn-warning">Archived</button>
      </form>
      <div class="item-list">
        <table>
          <tbody>
            <tr v-for="item in filterArray" :key='item.id'>
              <td v-if="renamingItem !== item" @dblclick="renameItem(item)" @click='selectItem(item.id)'>{{ item.title }}</td>
              <input type="text" v-if="renamingItem === item" @keyup.enter="endEditing(item)" @blur="endEditing(item)" v-model="item.title" />
              <td v-if="item.haveUnseenFeed ==='true'">
                <span title="Unread" class="badge badge-primary badge-pill">1</span>
              </td>
              <td v-if="item.isUrgent === 'urgent'">
                <span title="Urgent" class="badge badge-danger badge-pill">U</span>
              </td>
              <td v-if="item.deadline !== undefined && item.deadline !== null">
                <span title="Deadline" class="badge badge-deadline badge-pill">
                    {{ deadlineSplit(item.deadline)}}
                  </span>
              </td>
              <td>
                <button title="Delete" class="close" @click="removeItem(item)">&times;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button id="addItem" class="btn btn-block btn-warning" @click="addItem">
          <span class="fas fa-plus"></span> Add New</button>
    </div>
  </div>
</aside>
</template>

<script>
import {
  bus
} from "../main";
import {
  store
} from "@/store/index.js";
import {
  mapGetters
} from "vuex";
// import LoginPage from "@/components/LoginPage";
export default {
  // components: {
  //   LoginPage
  // },
  data() {
    return {
      renamingItem: {},
      isCollapsedSidebar: false,
      currentTabIndex: undefined,
      searchData: "",
      tabTitle: "",
      tabs: [{
          name: "Projects",
          icon: "fas fa-project-diagram"
        },
        // {
        //   name: "Parent Tasks",
        //   icon: "fa fa-tasks"
        // },
        {
          name: "Tasks",
          icon: "fa fa-tasks"
        },
        {
          name: "BugFix Tasks",
          icon: "fas fa-bug"
        },
        {
          name: "Companies",
          icon: "fas fa-building"
        },
        {
          name: "Teams",
          icon: "fas fa-users"
        }
      ],
      activeArray: [] // IMPROVE IN FUTURE
    };
  },
  methods: {
    selectItem(id_item) {
      let ob = undefined;
      switch (this.activeTabIndex) {
        case 0: ob = { selectedProjectID: id_item };
          break;
        case 1: ob = { selectedTaskID: id_item };
          break;
        case 2: ob = { selectedBugFixID: id_item };
          break;
        case 3: ob = { selectedCompanyID: id_item };
          break;
        case 4: ob = { selectedTeamsID: id_item };
          break;
      }
      store.commit("changeSidebarSelection", ob);
    },
    collapseSidebar() {
      this.isCollapsedSidebar = !this.isCollapsedSidebar;
    },
    activeSubFilter() {
      let a = this.currentTabIndex;
      return a === 0 || a === 1 || a === 2;
    },
    addItem() {
      var tabData = this.getActiveArray(this.currentTabIndex);
      this.activeArray = tabData;
      return;
      console.log("> " + tabData);
      for (let i in tabData) {
        console.log(tabData[i].title);
      }
      // var st = prompt();
      // if (st == null || st == "") return;
      // this.searchData = '';
    },
    removeItem(item) {
      var aa = this.getActiveArray(this.currentTabIndex);
      console.log(aa);
      var index = aa.indexOf(item);
      console.log(index + "  |  " + aa.splice(index, 1));
    },
    endEditing(item) {
      this.renamingItem = {};
      if (item.title.trim() === "") {
        this.removeItem(item);
      }
    },
    renameItem(item) {
      this.renamingItem = item;
    },
    deadlineSplit(dateTime) {
      console.log(dateTime);
      return dateTime !== undefined && dateTime !== null ? dateTime.split(" ")[0] : "";
    },
    getTabData(type) {
      let cTab = this.currentTabIndex;
      this.isCollapsedSidebar = false;
      this.tabTitle = this.tabs[cTab].name;
      let s = "both";
      let t = cTab === 2 ? "bugfix" : "task";
      let a = "false";
      switch (type) {
        case "cr":
          s = "created";
          break;
        case "as":
          s = "assigned";
          break;
        case "ar":
          a = "true";
          break;
      }
      switch (cTab) {
        case 0:
          this.getProjectData(s, t, a);
          break;
        case 1:
        case 2:
          this.getTaskData(s, t, a);
          break;
        case 3:
          this.getCompanyData();
        case 4:
          this.getTeamData();
          break;
      }
      var aa = this.getActiveArray(cTab);
      // console.log(aa);
      this.activeArray = aa;
    },
    refreshData() {
      console.log(this.currentTabIndex);
    },
    getProjectData() {
      store.dispatch("getUserProjects", {
        index: this.currentTabIndex,
      });
    },
    getTaskData(s, t, a) {
      store.dispatch("getUserTasks", {
        index: this.currentTabIndex,
        state: s,
        type: t,
        archived: a
      });
    },
    getCompanyData() {
      store.dispatch("getUserCompanies", {
        index: this.currentTabIndex
      });
    },
    getTeamData() {
      store.dispatch("getUserTeams", {
        index: this.currentTabIndex
      });
    },
  },
  computed: {
    ...mapGetters({
      getActiveArray: "currentTabArray"
    }),
    filterArray() {
      var tabData = this.activeArray;
      if (tabData === undefined) return;
      console.log("SIDEBAR DUZINA TEST ============== " + tabData.length);
      return tabData.filter(it => {
        var item = it.title;
        var searchItem = this.searchData;
        return item == undefined || searchItem == undefined ?
          false :
          item.toLowerCase().indexOf(searchItem.toLowerCase()) > -1;
      });
    }
  },
  created() {
    bus.$on("activeTabIndex", data => {
      this.currentTabIndex = data;
      console.log("do i fire?>");
      var aa = this.getActiveArray(this.currentTabIndex);
      this.activeArray = aa;
    });
  },
  mounted() {
    this.getTabData(null, (this.currentTabIndex = 1));
  }
};
</script>

<style scoped>
#sidebar {
  color: #eee;
  display: flex;
  align-items: stretch;
  /* width: 45%; */
}

/* SIDEBAR STATIC */

.static-side {
  background: #2d3436;
  width: 70px;
  min-width: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #444;
}

.static-side span {
  padding: 20px;
  display: block;
  text-align: center;
  cursor: pointer;
  color: #fff;
}

.static-side span:hover {
  background: #ccc;
  color: #333;
}

/* TABS START */

.tablinks {
  width: 100%;
  text-align: center;
  padding: 12px 0;
  line-height: 30px;
  background: unset;
  border: unset;
  color: #fff;
}

.tablinks[disabled] {
  color: black;
  background: white;
}

.tablinks.active {
  background: #212529;
  color: yellow;
}

.tablinks:hover {
  background: #ccc;
  color: #333;
}

/* TABS END */

/* COLLAPSED START */

.sidebar-content.collapsed {
  width: 0;
  min-width: 0;
  max-width: 0;
}

#sidebar.collapsed {
  width: unset;
}

.sidebar-content.collapsed * {
  display: none;
}

/* COLLAPSED END */

/* SIDEBAR CONTENT */

.sidebar-content {
  max-width: 100%;
  background: #24262d;
  transition: all 0.5s ease;
  flex-direction: column;
  display: flex;
  width: 100%;
}

/* SIDEBAR HEADER */

.sidebar-header {
  display: flex;
  justify-content: space-between;
  background: #5a5a5a66;
  padding: 5px 5px 3px;
  font-size: 18px;
  text-align: center;
  width: 100%;
}

.sidebar-header * {
  color: #fff;
}

.sidebar-header a .oi {
  margin-left: 10px;
}

.sidebar-header>span {
  cursor: pointer;
}

/* TASK LIST START */

.item-list {
  width: 100%;
  flex: 1 0px;
  overflow: auto;
  margin: 0 0 10px 0;
}

.item-list>table {
  padding: 0;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
}

.item-list tr {
  display: flex;
  line-height: 40px;
  text-decoration: none;
  color: #ddd;
}

.item-list td:first-child {
  flex: 1;
  padding-left: 10px;
}

.item-list td:last-child {
  margin: auto;
}

.item-list td {
  margin-right: 10px;
}

.item-list tr:hover {
  text-decoration: none;
  color: #fff;
  background: #8e8e8e66 !important;
}

.item-list tr:active,
.item-list tr:focus,
.item-list tr.active {
  text-decoration: none;
  background: rgba(128, 128, 128, 0.2);
}

.item-list tr:nth-child(even) {
  background: #44444466;
}

.item-list tr>input {
  flex: 1;
}

.close {
  color: #fff;
  margin-right: 15px;
  font-size: 1.8rem;
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
}

.search span {
  color: #fff;
  position: absolute;
  left: 12px;
  top: 10px;
  opacity: 0.8;
}

.search input {
  text-indent: 25px;
  border: 1px solid #636567bf;
  border-radius: 0;
  color: #fff;
  background: #2d3436;
}

.search ::placeholder {
  color: #bbb;
}

/* SEARCH END*/

.headeritem:hover {
  color: gray;
  cursor: pointer;
}

/* SIDEBAR BODY */

.sidebar-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sidebar-body>form {
  margin-bottom: 15px;
}

.btn-group {
  margin: 0 auto 10px;
}

.btn-group>* {
  border: 1px solid #00000040;
}

.badge-deadline {
  background: #8c28a7;
}
</style>
