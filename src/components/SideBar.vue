<template>
<aside id="sidebar">
  <div class="static-side">
    <span title="Collapse Sidebar" @click="isCollapsedSidebar = !isCollapsedSidebar" :class='[
    {"fas fa-angle-double-right":isCollapsedSidebar},
    {"fas fa-angle-double-left":!isCollapsedSidebar}]'>
  </span>
    <svg height="3px" width="100%">
      <line stroke-linecap="round" x1="10%" y1="0" x2="90%" y2="0" style="stroke:#636262;stroke-width:2" />
    </svg>

    <div class="tabs">
      <button v-for="( tab, index ) in tabs" :key="index" :title="tab.name" class="tablinks" :class="[{active:currentTabIndex === index}, tab.icon]" @click="getTabData($event,currentTabIndex = index)" :disabled="tab.disabled === true">
      </button>
    </div>

    <div class="user-sidebar">
      <!-- <span title="User Options" class="fas fa-user-cog"></span> -->
      <transition name='fade'>
        <popup v-show='activePopup' :class='{show: activePopup}' />
      </transition>
      <!-- <popup/> -->
      <img title="User Options" src="@/assets/user.png" @click="userOptions" @mouseover='mouseOverPopup(true)' @mouseleave='mouseOverPopup(false)' />
      <span title="Sign Out" class="fas fa-sign-out-alt" @click="signOut"></span>
    </div>
  </div>
  <div class="sidebar-content" :class="{ collapsed: isCollapsedSidebar }">
    <div class="sidebar-header">
      <a>
          <span :class="tabs[currentTabIndex].icon"></span>
          <span>{{ tabs[currentTabIndex].name }}</span>
          <span v-if='shownItemsCount !== 0' class='badge badge-warning'>{{ shownItemsCount }}</span>
        </a>
    </div>
    <div class="sidebar-body">
      <div class="form-filter">
        <form class="form-block">
          <div class="search">
            <span class="fas fa-search"></span>
            <input class="form-control mr-sm-2 hidden-md-down" v-model.trim="searchData" type="search" placeholder="Search" aria-label="Search">
          </div>
        </form>
        <form v-if="showSubFilter()" class="item-filter" role="group" aria-label="Item Filter">
          <label>
              <input type="radio" name="check" value="cs" v-model="invokeFilterType">
              <span class="label-text">Created</span>
            </label>
          <label>
              <input type="radio" name="check" value="as" v-model="invokeFilterType">
              <span class="label-text">Assigned</span>
            </label>
          <label>
              <input type="radio" name="check" value="ar" v-model="invokeFilterType">
              <span class="label-text">Archived</span>
            </label>
        </form>
        <form v-if="showAdminFilter()" class="item-filter" role="group" aria-label="Item Filter">
          <label>
              <input type="checkbox" v-model="teamAdmin">
              <span class="label-text">is Admin</span>
            </label>
        </form>
      </div>
      <div class="item-list">
        <table>
          <tbody>
            <tr v-for="(item,index) in itemsFiltered" :key='item.id' :class="{ active: activeItem === item.id}">
              <td v-if='showSubFilter()'>
                <label title="Mark as Completed">
                    <input type="checkbox">
                    <span class="label-text"></span>
                  </label>
              </td>
              <!-- @click="removeItem(item)" -->
              <td>
                <span class="td-icons fas fa-edit" title="Edit Item" @click="editItemButton(item, activeItem = item.id)"></span>
              </td>
              <td v-if="renamingItem !== item" @dblclick="renameItem(item)" @click='selectItem(item.id, activeItem = item.id)' class='td-flex'>{{ item.title }}</td>
              <input v-else type="text" @keyup.enter="endEditing(item)" @blur="endEditing(item)" v-model="item.title" v-focus/>
              <td v-if="item.haveUnseenFeed ==='true'"><span title="Unread" class="badge badge-primary badge-pill">1</span></td>
              <td v-if="item.isUrgent === 'urgent'"><span title="Urgent" class="badge badge-purple badge-pill">U</span></td>
              <td v-if="item.deadline !== undefined && item.deadline !== null">
                <span title="Deadline" class="badge badge-danger">
                    {{ deadlineSplit(item.deadline) }}
                  </span>
              </td>
              <td v-if="item.userscount !== undefined && item.userscount !== null"><span title="Team Members Count" class="badge badge-danger">{{ item.userscount }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button id="addItem" class="btn btn-block btn-warning" @click="addItemButton">
          <span class="fas fa-plus-circle"></span> Add New</button>
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
import {
  mapState
} from 'vuex'
import popup from './UserPopup';
export default {
  components: {
    popup,
  },
  data() {
    return {
      renamingItem: {},
      isCollapsedSidebar: false,
      searchData: "",
      currentTabIndex: 1,
      activePopup: false,
      activeItem: undefined,
      teamAdmin: true,
      tabs: [{
          name: "Companies",
          icon: "fas fa-building",
          isAdmin: true,
        }, {
          name: "Projects",
          icon: "fas fa-project-diagram",
        },
        {
          name: "Tasks",
          icon: "fas fa-tasks"
        },
        {
          name: "Issues",
          icon: "fas fa-bug"
        },
        {
          name: "Teams",
          icon: "fas fa-users",
          isAdmin: true,
        }
      ],
      activeArray: [],
      invokeFilterType: "as",
      backColorCache: {},
      frontColorCache: {},
    };
  },
  watch: {
    invokeFilterType(val, oldVal) {
      // console.log(val + ' ' + oldVal);
      delete this.tabs[this.currentTabIndex].itemIndex;
      this.activeItem = undefined;
      this.getTabData(val);
    },
    getActiveArray(val, oldVal) {
      this.activeArray = val;
    },
    currentTabIndex(val) {
      this.isCollapsedSidebar = false;
      this.activeItem = this.tabs[val].itemIndex;
    },
    teamAdmin(val) {
      this.tabs[this.currentTabIndex].isAdmin = val;
      this.actionTabDataTeam();
    }
  },
  methods: {
    getTabData(type) {
      let index = this.currentTabIndex;
      let s = "both"; // DEFAULT
      if (type === null) s = "assigned";
      let t = this.tabs[index].name === 'Issues' ? "bugfix" : "task";
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
          this.actionTabDataCompany();
          break;
        case 1:
        case 2:
        case 3:
          this.actionTabDataWork("getUserWork", s, t, a);
          break;
        case 4:
          this.actionTabDataTeam();
          break;
      }
      this.setActiveArray();
    },
    selectItem(itemID) {
      this.tabs[this.currentTabIndex].itemIndex = itemID;
      store.commit("setSidebarItemSelection", {
        index: this.currentTabIndex,
        id: itemID
      });
    },
    showSubFilter() {
      let i = this.currentTabIndex;
      return i === 1 || i === 2 || i === 3;
    },
    showAdminFilter() {
      let i = this.currentTabIndex;
      return i === 0 || i === 4;
    },
    addItemButton() {
      store.dispatch("itemAddClick");
    },
    editItemButton(item) {
      store.dispatch("itemEditClick", item);
    },
    removeItem(item) {
      var aa = this.getActiveArray(this.currentTabIndex);
      // console.log(aa);
      var index = aa.indexOf(item);
      // console.log(index + "  |  " + aa.splice(index, 1));
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
      return dateTime !== undefined && dateTime !== null ?
        dateTime.split(" ")[0] :
        "";
    },
    actionTabDataWork(name, s, t, a) {
      store.dispatch(name, {
        index: this.currentTabIndex,
        state: s,
        type: t,
        archived: a
      });
    },
    actionTabDataTeam() {
      let i = this.currentTabIndex;
      store.dispatch('getUserTeams', {
        index: i,
        admin: this.tabs[i].isAdmin,
        // comid: this.getCompanyID,
      });
    },
    actionTabDataCompany() {
      let i = this.currentTabIndex;
      store.dispatch('getUserCompanies', {
        index: i,
        admin: this.tabs[i].isAdmin,
      });
    },
    setActiveArray() {
      this.activeArray = this.getActiveArray;
    },
    userOptions() {
      alert('Avatar Kliknut');
    },
    signOut() {
      alert('Sign out Kliknut');
    },
    mouseOverPopup(val) {
      this.activePopup = val;
    },
    beforeEnter: function(el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function(el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function() {
        Velocity(
          el, {
            opacity: 1,
            height: '1.6em'
          }, {
            complete: done
          }
        )
      }, delay)
    },
    leave: function(el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function() {
        Velocity(
          el, {
            opacity: 0,
            height: 0
          }, {
            complete: done
          }
        )
      }, delay)
    },
  },
  computed: {
    ...mapState({
      getTabIndex: 'currentTabIndex',
      getCompanyID: 'companyID',
    }),
    getActiveArray() {
      return store.getters.currentTabData;
    },
    shownItemsCount() {
      return this.itemsFiltered === undefined
      ? null
      : this.itemsFiltered.length;
    },
    itemsFiltered() {
      let tabData = this.activeArray;
      if (tabData === undefined) return;
      let filtered = tabData.filter(it => {
        var item = it.title;
        var searchItem = this.searchData;
        return item == undefined || searchItem == undefined ?
          false :
          item.toLowerCase().indexOf(searchItem.toLowerCase()) > -1;
      });
      return filtered;
    }
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  },
  mounted() {
    store.commit("setSidebarData", {
      index: this.currentTabIndex
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
  /* justify-content: space-between; */
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

.static-side>* {
  padding: 5px 0;
}

/* TABS START */

.tabs {
  margin: 0 0 auto;
}

.tablinks {
  width: 100%;
  text-align: center;
  padding: 12px 0;
  line-height: 30px;
  background: unset;
  border: unset;
  color: #fff;
  cursor: pointer;
}

.tablinks[disabled] {
  color: #0a0a0a;
  background: #4c4c4c;
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
  background: #2d3436;
  padding: 5px 5px 3px;
  font-size: 18px;
  text-align: center;
  width: 100%;
}

.sidebar-header a .oi {
  margin-left: 10px;
}

.sidebar-header>a>.fas {
  margin-right: 15px;
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
  /* border-collapse: collapse; */
}

.item-list>table td {
  height: 100%;
  /* overflow: hidden; */
  /* overflow-y:auto; */
}

.item-list tr {
  display: flex;
  line-height: 32px;
}

.item-list tr:hover {
  text-decoration: none;
  color: #e2ff05;
  background: #8e8e8e66 !important;
}

.item-list tr:active,
.item-list tr:focus {
  text-decoration: none;
  background: rgba(128, 128, 128, 0.2);
}

.item-list tr:nth-child(even) {
  background-color: #69696917;
}

.item-list tr.active {
  border-left: 3px solid #baf52d;
  background-color: #080808;
}

.item-list td {
  /* border-left: 1px solid #333;
  border-right: 1px solid #333; */
  padding: 0 7px;
}

.item-list td:first-child {
  border-left: none;
}

.item-list td:last-child {
  border-right: none;
}

.td-flex {
  flex: 1;
}

.item-list tr>input {
  flex: 1;
  line-height: initial;
}

.td-icons {
  cursor: pointer;
  font-size: 15px;
}

/* HOVER EFFECT */

#addItem:hover {
  box-shadow: 0px 0px 17px 0px rgba(255, 248, 19, 0.2);
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
  padding: 15px;
}

.form-filter>form {
  margin-bottom: 10px;
}

.item-filter {
  display: flex;
  justify-content: space-around;
}

.item-filter>* {
  color: white;
}

.badge-purple {
  background: #8c28a7;
}

.user-sidebar img {
  height: 40px;
  margin: 10px auto;
  border-radius: 50%;
  display: block;
}

label {
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */

  {
  opacity: 0;
}
</style>
