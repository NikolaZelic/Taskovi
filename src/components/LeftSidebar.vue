<template>
<div>
  <aside id="left-sidebar">
    <!-- <ul class="sidebar-nav mr-auto"> -->
    <div class="left-static">
      <button class="navbar-toggler" @click="collapseSidebar">
        <span class="oi oi-menu"></span>
      </button>
      <tabs :tabs="tabs"></tabs>
    </div>

    <div class="sidebar-content" :class="{ collapsed: isCollapsedSidebar }">
      <div class="sidebar-header">
        <a>{{ tabTitle }}<span class="oi oi-check"></span></a>
        <span title="Refresh" class="oi oi-reload" @click="refreshData"></span>
      </div>
      <div class="sidebar-body">
        <form class="form-block">
          <div class="search">
            <span class="oi oi-magnifying-glass"></span>
            <input class="form-control mr-sm-2 hidden-md-down" v-model.trim="searchParentTasks" type="search" placeholder="Search" aria-label="Search">
          </div>
        </form>
        <div class="task-list">
          <table>
            <tbody>
              <tr v-for="ft in filterTasks">
                <td>{{ ft.title }}</td>
                <td>
                  <span title="URGENT" v-if="ft.urgent === 0" class="badge badge-danger badge-pill">U</span>
                </td>
                <td>
                  <span title="UNREAD" v-if="ft.seen === 0" class="badge badge-success badge-pill">{{ft.seen + 1 }}</span></td>
                <td>
                  <button title="CLOSE" class="close" @click="removeTask(ft)">&times;</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button id="addTask" class="btn btn-block btn-warning" @click="addTask"><span class="fas fa-plus"></span> Add new task</button>
      </div>
    </div>
  </aside>
</div>
</template>

<script>
import axios from 'axios'
import {
  bus
} from '../main';
import tabs from "@/components/Tabs"
export default {
  components: {
    tabs,
  },
  name: 'left-sidebar',
  data() {
    return {
      isCollapsedSidebar: false,
      activeTab: undefined,

      // tabProjects: false,
      // tabParentTasks: false,
      // tabMyTasks: false,
      // tabDebug: false,
      // searchProjects: '',
      searchParentTasks: '',
      // searchMyTasks: '',
      // searchDebug: '',
      tabTitle: '',
      tabs: [{
        name: 'My Projects',
        icon: 'fas fa-project-diagram',
      }, {
        name: 'My Created Tasks',
        icon: 'fa fa-user-check',
      }, {
        name: 'My Tasks',
        icon: 'fas fa-tasks',
      }, {
        name: 'Debug Tasks',
        icon: 'fas fa-bug',
      }, {
        name: 'Archived Tasks',
        icon: 'fas fa-archive',
      }, ],
      myTasks: [],
      myProjects: [],
      myCreatedTasks: [],
      debugTasks: [],
      archivedTasks: [],
      activeArray: [], // IMPROVE IN FUTURE
    }
  },
  methods: {

    addTask() {
      var st = prompt();
      if (st == null || st == "") return;
      var lastIndex = this.myTasks.length;
      this.myTasks.push({
        id: lastIndex++,
        title: st,
      })
      this.searchParentTasks = '';
    },
    removeTask(title) {
      console.log(title);
      var index = title.id;
      // console.log(this.filterTasks[0].title);
      for (var variable in this.filterTasks) {
        var tt = this.filterTasks[variable].title;
        if (tt == title) {
          console.log(title + this.filterTasks[variable].id);
        }
      }
      // return;
      this.myTasks.splice(index, 1);
    },
    collapseSidebar() {
      this.isCollapsedSidebar = !this.isCollapsedSidebar;
    },
    refreshData(){
      console.log(this.activeTab);
    }
  },
  computed: {
    filterTasks() {
      return this.activeArray.filter(it => {
        var item = it.title;
        var searchItem = this.searchParentTasks;
        return item == undefined || searchItem == undefined ? false : item.toLowerCase().indexOf(searchItem.toLowerCase()) > -1
      })
    },
  },
  created() {
    bus.$on('myProjects', data => {
      this.myProjects = data;
      this.activeArray = data;
      console.log(this.activeArray);
    });
    bus.$on('myTasks', data => {
      this.myTasks = data;
      this.activeArray = data;
      console.log(this.activeArray);
    });
    bus.$on('myCreatedTasks', data => {
      this.myCreatedTasks = data;
      this.activeArray = data;
      console.log(this.activeArray);
    });
    bus.$on('activeTab', data => {
      this.tabTitle = this.tabs[data].name;
      this.activeTab = data;
    });
  },
}
</script>

<style scoped>

#left-sidebar {
  min-width: 400px;
  max-width: 400px;
  min-height: 100vh;
  font-family: "Roboto" !important;
  color: #eee;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}


/* TASK LIST START */

.task-list {
  width: 100%;
  flex: 1 0px;
  overflow: auto;
  margin: 20px 0;
}

.task-list>table {
  padding: 0;
  width: 100%;
  /* height: 77vh; */
  overflow: hidden;
  overflow-y: auto;
  /* margin: 0 0 10px;
    padding: 0; */
}

.task-list tr {
  display: flex;
  line-height: 40px;
  text-decoration: none;
  color: #DDD;
}

.task-list td:first-child {
  flex: 1;
  padding-left: 10px;
}

.task-list td:last-child {
  margin: auto;
}

.task-list td {
  margin-right: 10px;
}

.task-list tr:hover {
  text-decoration: none;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

.task-list tr:active,
.task-list tr:focus,
.task-list tr.active {
  text-decoration: none;
  background: rgba(128, 128, 128, 0.2);
}

.close {
  color: #fff;
  margin-right: 15px;
}

/* #addTask {
  bottom: 15px;
  width: 90%;
  margin: 5px;
  margin: auto;
  position: absolute;
} */

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
