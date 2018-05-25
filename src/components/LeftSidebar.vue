<template>
<aside id="left-sidebar">
  <div class="left-static">
    <span title="Collapse Sidebar" class="oi oi-menu" @click="collapseSidebar"></span>
    <tabs :tabs="tabs"></tabs>
    <div class="user-sidebar">
      <span title="User Options" class="fas fa-user-cog"></span>
      <span title="Sign In" class="fas fa-sign-in-alt" @click="showSignIn = true"></span>
      <span title="Sign Out" class="fas fa-sign-out-alt" @click="showSignIn = false"></span>
    </div>
  </div>

  <login v-if="showSignIn" @close="showModal = false">
  </login>
  <div v-else class="sidebar-content" :class="{ collapsed: isCollapsedSidebar }">
    <div class="sidebar-header">
      <a>{{ tabTitle }}<span class="oi oi-check"></span></a>
      <span title="Refresh" class="oi oi-reload" @click="refreshData"></span>
    </div>
    <div class="sidebar-body">
      <form v-if="activeSubFilter()" class="btn-group" role="group" aria-label="Item Filter">
        <button @click="getTabData('created', 'task', 'false')" type="button" class="btn btn-warning">Created</button>
        <button @click="getTabData('assigned', 'task', 'false')" type="button" class="btn btn-warning">Assigned</button>
        <button @click="getTabData('both', 'task', 'true')" type="button" class="btn btn-warning">Archived</button>
      </form>
      <form class="form-block">
        <div class="search">
          <span class="oi oi-magnifying-glass"></span>
          <input class="form-control mr-sm-2 hidden-md-down" v-model.trim="searchData" type="search" placeholder="Search" aria-label="Search">
        </div>
      </form>
      <div class="item-list">
        <table>
          <tbody>
            <tr v-for="item in filterArray">
              <td v-if="renamingItem !== item" @dblclick="renameItem(item)" @click='selectTask(item.id)'>{{ item.title }}</td>
              <input type="text" v-if="renamingItem === item" @keyup.enter="endEditing(item)" @blur="endEditing(item)" v-model="item.title"></input>
              <td v-if="item.isUrgent === 'urgent'"><span title="URGENT" class="badge badge-danger badge-pill">U</span></td>
              <td v-if="item.haveUnseenFeed ==='true'"><span title="UNREAD" class="badge badge-primary badge-pill">1</span></td>
              <td>
                <button title="CLOSE" class="close" @click="removeItem(item)">&times;</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button id="addItem" class="btn btn-block btn-warning" @click="addItem"><span class="fas fa-plus"></span> Add New</button>
    </div>
  </div>
</aside>
</template>

<script>
import {
  bus
} from '../main'
import {
  store
} from "@/store/store.js"
import {
  mapGetters
} from 'vuex'
import tabs from "@/components/Tabs"
import login from "@/components/Login"
export default {
  components: {
    tabs,
    login
  },
  name: 'left-sidebar',
  data() {
    return {
      sid: undefined,
      renamingItem: {},
      showSignIn: false,
      isCollapsedSidebar: false,
      activeTabIndex: undefined,
      searchData: '',
      tabTitle: '',
      tabs: [{
        name: 'Projects',
        icon: 'fas fa-project-diagram',
      }, {
        name: 'Tasks',
        icon: 'fa fa-tasks',
      }, {
        name: 'Debug Tasks',
        icon: 'fas fa-bug',
      }, {
        name: 'Companies',
        icon: 'fas fa-building',
      }, {
        name: 'Teams',
        icon: 'fas fa-users',
      }, ],
      activeArray: [], // IMPROVE IN FUTURE
    }
  },
  methods: {
    selectTask(tasid){
       store.commit("changeLeftSideSelection", {selectedTaskID: tasid});
    },
    collapseSidebar() {
      this.isCollapsedSidebar = !this.isCollapsedSidebar;
    },
    activeSubFilter() {
      let a = this.activeTabIndex;
      return a === 0 || a === 1 || a === 2;
    },
    addItem() {
      var tabData = this.getActiveArray(this.activeTabIndex);
      this.activeArray = tabData;
      return;
      console.log('> ' + tabData);
      for (let i in tabData) {
        console.log(tabData[i].title);
      }
      // var st = prompt();
      // if (st == null || st == "") return;
      // this.searchData = '';
    },
    removeItem(item) {
      var aa = this.getActiveArray(this.activeTabIndex);
      console.log(aa);
      var index = aa.indexOf(item);
      console.log(index + '  |  ' + aa.splice(index, 1));
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
    getTabData(s, t, a) {
      store.dispatch('getUserTasks', {
        index: this.activeTabIndex,
        state: s,
        type: t,
        archived: a,
      });
      var aa = this.getActiveArray(this.activeTabIndex);
      // console.log(aa);
      this.activeArray = aa;
    },
    refreshData() {
      console.log(this.activeTabIndex);
    },
  },
  computed: {
    ...mapGetters({
      getActiveArray: 'currentTabArray',
    }),
    filterArray() {
      //var tabData = this.getActiveArray(this.activeTabIndex);
      // this.activeArray = a;
      var tabData = this.activeArray;
      // for (let i in tabData) {
      //   console.log(tabData[i].title);
      // }
      if (tabData === undefined)
        return;
      console.log('DUZINA ============== ' + tabData.length);
      return tabData.filter(it => {
        var item = it.title;
        var searchItem = this.searchData;
        return item == undefined || searchItem == undefined ? false : item.toLowerCase().indexOf(searchItem.toLowerCase()) > -1
      })
    },
  },
  created() {
    bus.$on('activeTabIndex', data => {
      this.tabTitle = this.tabs[data].name;
      this.activeTabIndex = data;
      var aa = this.getActiveArray(this.activeTabIndex);
      // console.log('sss');
      // console.log(aa);
      this.activeArray = aa;
    });
    bus.$on('signin', data => {
      this.sid = data;
      bus.$emit('sid', data);
      this.showSignIn = false;
    });
    // bus.$on('netTabFilled', () => {
    //   console.log(this.activeTabIndex);
    //   console.log(this.activeTabIndex);
    // })
  },
}
</script>

<style scoped>
#left-sidebar {
  min-height: 100vh;
  color: #eee;
  display: flex;
  align-items: stretch;
}

/* SIDEBAR STATIC */

.left-static {
  background: #2d3436;
  width: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #444;
}

.left-static span {
  padding: 20px;
  display: block;
  text-align: center;
  cursor: pointer;
  color: #fff;
}

.left-static span:hover {
  background: #ccc;
  color: #333;
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
  color: #DDD;
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
  background: #44444466
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

@media screen and (max-width: 1100px) {
  #left-sidebar,
  #left-sidebar.active {
    margin-left: var(--left-sidebar-no-width);
  }
  /* #rightSidebar, #rightSidebar.active {
    margin-right: -350px;
  } */
}

/* SIDEBAR BODY */

.sidebar-body {
  width: 100%;
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

@media(min-width:768px) {
  #leftWrapper {
    padding-left: 0;
  }
  #leftWrapper.toggled {
    padding-left: 250px;
  }
  #sidebar-wrapper {
    width: 0;
  }
  #leftWrapper.toggled #sidebar-wrapper {
    width: 250px;
  }
  #page-content-wrapper {
    padding: 20px;
    position: relative;
  }
  #leftWrapper.toggled #page-content-wrapper {
    position: relative;
    margin-right: 0;
  }
}
</style>
