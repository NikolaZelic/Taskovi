<template>
<div>
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
                <td v-if="renamingItem !== item" @dblclick="renameItem(item)">{{ item.title }}</td>
                <input type="text" v-if="renamingItem === item" @keyup.enter="endEditing(item)" @blur="endEditing(item)" v-model="item.title"></input>
                <td><span title="URGENT" v-if="item.urgent === 0" class="badge badge-danger badge-pill">U</span></td>
                <td><span title="UNREAD" v-if="item.seen === 0" class="badge badge-success badge-pill">{{item.seen + 1 }}</span></td>
                <td>
                  <button title="CLOSE" class="close" @click="removeItem(item)">&times;</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button id="addItem" class="btn btn-block btn-warning" @click="addItem"><span class="fas fa-plus"></span> Add new <span>{{item}}</span></button>
      </div>
    </div>
  </aside>
</div>
</template>

<script>
import {
  bus
} from '../main';
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
      item: "Task",
      renamingItem: {},
      showSignIn: false,
      isCollapsedSidebar: false,
      activeTabIndex: undefined,
      searchData: '',
      tabTitle: '',
      tabs: [{
        name: 'My Projects',
        icon: 'fas fa-project-diagram',
        // data: this.$store.state.leftSideBarContent[0],
      }, {
        name: 'My Created Tasks',
        icon: 'fa fa-user-check',
        // data: this.$store.state.leftSideBarContent[1],
      }, {
        name: 'My Assigned Tasks',
        icon: 'fas fa-tasks',
        // data: this.$store.state.leftSideBarContent[2],
      }, {
        name: 'Debug Tasks',
        icon: 'fas fa-bug',
        // data: this.$store.state.leftSideBarContent[3],
      }, {
        name: 'Archived Tasks',
        icon: 'fas fa-archive',
        // data: this.$store.state.leftSideBarContent[4],
      }, ],
      activeArray: [], // IMPROVE IN FUTURE
    }
  },
  methods: {
    collapseSidebar() {
      this.isCollapsedSidebar = !this.isCollapsedSidebar;
    },
    addItem() {
      var st = prompt();
      if (st == null || st == "") return;
      var lastIndex = this.myTasks.length;
      this.myTasks.push({
        id: lastIndex++,
        title: st,
      })
      this.searchData = '';
    },
    removeItem(item) {
      var index = this.activeArray.indexOf(item);
      this.activeArray.splice(index, 1);
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
    refreshData() {
      console.log(this.activeTabIndex);
    },
  },
  computed: {
    filterArray() {
      if (this.activeArray === undefined)
        return;
      return this.activeArray.filter(it => {
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
      this.activeArray = this.$store.state.leftSideBarContent[this.activeTabIndex];
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
  min-width: 400px;
  max-width: 400px;
  min-height: 100vh;
  color: #eee;
  display: flex;
  /* flex-direction: row; */
  align-items: stretch;
}

/* SIDEBAR STATIC */

.left-static {
  background: #24262d;
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

.left-static>span:hover {
  color: #fff300;
}

/* TASK LIST START */

.item-list {
  width: 100%;
  flex: 1 0px;
  overflow: auto;
  margin: 20px 0;
}

.item-list>table {
  padding: 0;
  width: 100%;
  /* height: 77vh; */
  overflow: hidden;
  overflow-y: auto;
  /* margin: 0 0 10px;
    padding: 0; */
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
  background: rgba(255, 255, 255, 0.2);
}

.item-list tr:active,
.item-list tr:focus,
.item-list tr.active {
  text-decoration: none;
  background: rgba(128, 128, 128, 0.2);
}

.item-list tr:nth-child(even) {
  background: #23232366;
}

.item-list tr:nth-child(even):hover {
  background: #58585866;
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
  border: 1px solid #252627bf;
  border-radius: 0;
  color: #fff;
  background: #24262d;
}

.search ::placeholder {
  color: #bbb;
}

/* SEARCH END*/

.headeritem:hover {
  color: gray;
  cursor: pointer;
}

/* .selected {
  text-align: left;
  padding: 21px;
  font-size: 150%;
  color: #f48a18;
  border-bottom: 4px solid #f48a18;
} */

/* CHECKLATER=================================== */

/* #content {
  background-color: #e6e6e6;
  width: 100%;
  height: 100%;
  position: relative;
}

/* .btn-circle {
  width: 50px;
  height: 50px;
  text-align: center;
  margin: 8px;
  padding: 6px 0;
  font-size: 22px;
  line-height: 1.42;
  border-radius: 50%;
  border: transparent;
} */

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



/* AVATAR POPUP END */
</style>
