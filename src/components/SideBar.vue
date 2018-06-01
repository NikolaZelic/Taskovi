<template>
<aside id="sidebar" :class="{ collapsed: isCollapsedSidebar }">
  <div class="static-side">
    <span title="Collapse Sidebar" class="fas fa-bars" @click="isCollapsedSidebar = !isCollapsedSidebar"></span>

    <div class="tabs">
      <button v-for="( tab, index ) in tabs" :key="index" :title="tab.name" class="tablinks" :class="[{active:currentTab.index === index}, tab.icon]" @click="getTabData($event,currentTab.index = index)">
        </button>
    </div>

    <div class="user-sidebar">
      <span title="User Options" class="fas fa-user-cog"></span>
      <span title="Sign Out" class="fas fa-sign-out-alt"></span>
    </div>
  </div>
  <div class="sidebar-content" :class="{ collapsed: isCollapsedSidebar }">
    <div class="sidebar-header">
      <a><span :class="[currentTab.icon]"></span>{{ currentTab.title }}</a>
    </div>
    <div class="sidebar-body">
      <form class="form-block">
        <div class="search">
          <span class="fas fa-search"></span>
          <input class="form-control mr-sm-2 hidden-md-down" v-model.trim="searchData" type="search" placeholder="Search" aria-label="Search">
        </div>
      </form>
      <form v-if="showSubFilter()" class="item-filter" role="group" aria-label="Item Filter">
        <label><input type="radio" name="check" value="cs" v-model="invokeFilterType"> <span class="label-text">Created</span></label>
        <label><input type="radio" name="check" value="as" v-model="invokeFilterType" checked> <span class="label-text">Assigned</span></label>
        <label><input type="radio" name="check" value="ar" v-model="invokeFilterType"> <span class="label-text">Archived</span></label>
      </form>
      <div class="item-list">
        <table>
          <tbody>
            <tr v-for="item in filterArray" :key='item.id' :class="{ active: currentItemIndex === item.id}">
              <td v-if="renamingItem !== item" @dblclick="renameItem(item)" @click='selectItem(item.id, currentItemIndex = item.id)'>{{ item.title }}</td>
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
              <td><span class="td-icons fas fa-edit" title="Edit" @click=""></span></td>
              <td><span class="td-icons fas fa-check" title="Archive" @click="removeItem(item)"></span></td>
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
  store
} from "@/store/index.js";
import {
  mapGetters
} from "vuex";
export default {
  data() {
    return {
      renamingItem: {},
      isCollapsedSidebar: false,
      currentItemIndex: -1,
      searchData: "",
      currentTab: {
        index: 1,
        title: undefined,
        icon: undefined,
      },
      tabs: [{
          name: "Projects",
          icon: "fas fa-project-diagram"
        },
        {
          name: "Tasks",
          icon: "fa fa-tasks"
        },
        {
          name: "Issues",
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
      activeArray: [],
      invokeFilterType: undefined,
    };
  },
  watch: {
    invokeFilterType(val) {
      this.currentItemIndex = -1;
      this.getTabData(val);
    },
    'getActiveArray': function(val, oldVal) {
      this.activeArray = val;
    },
  },
  methods: {
    getTabData(type) {
      let index = this.currentTab.index;
      this.isCollapsedSidebar = false;
      this.currentTab.title = this.tabs[index].name;
      this.currentTab.icon = this.tabs[index].icon;
      let s = "both"; // DEFAULT
      if (type === null) s = "assigned";
      let t = index === 2 ? "bugfix" : "task";
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
      switch (index) {
        case 0:
        case 1:
        case 2:
          this.actionTabDataWork('getUserWork', s, t, a);
          break;
        case 3:
          this.actionTabDataPeople('getUserCompanies');
          break;
        case 4:
          this.actionTabDataPeople('getUserTeams');
          break;
      }
      this.setActiveArray();
    },
    selectItem(id_item) {
      store.commit("changeSidebarSelection", {
        index: this.currentTab.index,
        id: id_item,
      })
    },
    showSubFilter() {
      let a = this.currentTab.index;
      return a === 0 || a === 1 || a === 2;
    },
    addItem() {
      // this.setActiveArray();
      // return;
      // this.activeArray = tabData;
      // return;
      // console.log("> " + tabData);
      // for (let i in tabData) {
      //   console.log(tabData[i].title);
      // }
    },
    removeItem(item) {
      var aa = this.getActiveArray(this.currentTab.index);
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
      return dateTime !== undefined && dateTime !== null ? dateTime.split(" ")[0] : "";
    },
    actionTabDataWork(name, s, t, a) {
      store.dispatch(name, {
        index: this.currentTab.index,
        state: s,
        type: t,
        archived: a
      });
    },
    actionTabDataPeople(name) {
      store.dispatch(name, {
        index: this.currentTab.index,
      });
    },
    setActiveArray() {
      // console.log("setActiveArray RADII");
      var data = this.getActiveArray;
      this.activeArray = data;
    },
  },
  computed: {
    ...mapGetters([
      'getTabIndex',
    ]),
    getActiveArray() {
      return store.getters.currentTabArray;
    },
    filterArray() {
      var tabData = this.activeArray;
      if (tabData === undefined) return;
      return tabData.filter(it => {
        var item = it.title;
        var searchItem = this.searchData;
        return item == undefined || searchItem == undefined ?
          false :
          item.toLowerCase().indexOf(searchItem.toLowerCase()) > -1;
      });
    }
  },
  mounted() {
    store.commit("setSidebarData", {
      index: this.currentTab.index
    });
    this.getTabData(null);
  }
};
</script>

<style scoped>
#sidebar {
  color: #eee;
  display: flex;
  align-items: stretch;
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
  border-left: 3px solid yellow;
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
  justify-content: center;
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

.sidebar-header>a>span {
  margin-right: 20px;
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

/* .item-list td:last-child {
  margin: auto;
} */

.item-list td {
  margin-right: 10px;
}

.item-list tr:hover {
  text-decoration: none;
  color: #fff;
  background: #8e8e8e66 !important;
}

.item-list tr:active,
.item-list tr:focus {
  text-decoration: none;
  background: rgba(128, 128, 128, 0.2);
}

.item-list tr:nth-child(even) {
  background-color: #44444466;
}

.item-list tr.active {
  background-color: #6d4444;
}

.item-list tr>input {
  flex: 1;
}

.td-icons {
  color: #fff;
  cursor: pointer;
  font-size: 15px;
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

.item-filter {
  display: flex;
  justify-content: space-around;
}

.item-filter>* {
  color: white;
}

.badge-deadline {
  background: #8c28a7;
}
</style>
