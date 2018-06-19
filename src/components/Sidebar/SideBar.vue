<template>
  <aside id="sidebar">
    <!-- <button @click="tts">Activate alert</button> -->
    <div class="sidebar-header">
      <span title="Collapse Sidebar" @click="sidebarActive = !sidebarActive" class='fas fa-angle-double-right collapse-btn' :class='{"collapsed":!sidebarActive}'>
      </span>
      <a>
        <span :class="tabs[currentTabIndex].icon"></span>
        <span>{{ tabs[currentTabIndex].name }}</span>
        <span v-if='shownItemsCount !== 0' class='badge badge-light'>{{ shownItemsCount }}</span>
      </a>
    </div>
    <div class="sidebar-lower">
      <div class="static-side">
        <!-- <svg height="3px" width="100%">
         <line stroke-linecap="round" x1="10%" y1="0" x2="90%" y2="0" style="stroke: #666; stroke-width: 1;"></line>
       </svg> -->

        <ul class="tabs">
          <!-- :tabindex="index+1" -->
          <li v-for="( tab, index ) in tabs" v-if="index === 0 || companyID !== undefined" :key="index" :title="tab.name" class="tablinks"
            :class="[{active:currentTabIndex === index}, tab.icon]" @click="getTabData(currentTabIndex = index), sidebarActive=true"
            :disabled="tab.disabled">
          </li>
        </ul>

        <div class="user-sidebar">
          <!-- <span title="User Options" class="fas fa-user-cog"></span> -->
          <transition name='fade'>
            <user-popup v-show='activePopup' :class='{show: activePopup}' />
          </transition>
          <!-- <popup/> -->
          <img title="User Options" src="@/assets/img/user.png" @click="userOptions" @mouseover='mouseOverPopup(true)' @mouseleave='mouseOverPopup(false)'
          />
          <span title="Sign Out" class="fas fa-sign-out-alt" @click="signOut"></span>
        </div>

      </div>
      <div class="sidebar-content" :class="{ collapsed: !sidebarActive }">
        <div class="sidebar-body">
          <div class="form-filter">
            <form class="form-block">
              <div class="search">
                <span class="fas fa-search"></span>
                <input class="form-control mr-sm-2 hidden-md-down darktheme" v-model.trim="searchData" type="search" placeholder="Search"
                  aria-label="Search">
              </div>
            </form>
            <form v-if="showSubFilter()" class="item-filter" role="group" aria-label="Item Filter">
              <label v-for='f in radioFilter' :key='f.value'>
                <input type="radio" name="check" :value="f.value" v-model="invokeFilterType">
                <span class="label-text">{{f.name}}</span>
              </label>
            </form>
            <form v-if="showAdminFilter()" class="item-filter" role="group" aria-label="Item Filter">
              <label>
                <input type="checkbox" v-model="adminFilter">
                <span class="label-text">is Admin</span>
              </label>
            </form>
          </div>
          <div class="item-list">
            <task-sidebar v-if="currentTabIndex === 2 || currentTabIndex === 3" />
            <table v-else>
              <tbody>
                <tr v-for="item in itemsFiltered" :key='item.id' :class="{ active: activeItem === item.id}">
                  <td>
                    <span class="td-icons fas fa-edit" title="Edit Item" @click="editItemButton(item, activeItem = item.id)"></span>
                  </td>
                  <td @click='selectItem(item.id, activeItem = item.id)' class='td-flex'>{{ item.title }}</td>
                  <td v-if="item.haveUnseenFeed ==='true'">
                    <span title="Unread" class="badge badge-primary badge-pill">1</span>
                  </td>
                  <td v-if="item.isUrgent === 'urgent'">
                    <span title="Urgent" class="badge badge-purple badge-pill">U</span>
                  </td>
                  <td v-if="item.deadline !== undefined && item.deadline !== null">
                    <span title="Deadline" class="badge badge-danger">
                      {{ deadlineSplit(item.deadline) }}
                    </span>
                  </td>
                  <td v-if="item.userscount !== undefined && item.userscount !== null">
                    <span title="Team Members Count" class="badge badge-danger">{{ item.userscount }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button id="addItem" class="btn btn-block btn-warning" @click="addItemButton">
            <span class="fas fa-plus-circle"></span> Add New</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
  import {
    store
  } from "@/store/index.js";
  import {
    api
  } from "@/api/index.js";
  import {
    mapGetters
  } from "vuex";
  import {
    mapState
  } from "vuex";
  import UserPopup from "./UserPopup";
  import TaskSidebar from "./TaskSidebar";
  export default {
    components: {
      UserPopup,
      TaskSidebar
    },
    data() {
      return {
        isTask: false,
        sidebarActive: true,
        searchData: "",
        currentTabIndex: 0,
        companyID: undefined,
        activePopup: false,
        activeItem: undefined,
        adminFilter: true,
        radioFilter: [{
            name: "Created",
            value: "cr"
          },
          {
            name: "Assigned",
            value: "as"
          },
          {
            name: "Archived",
            value: "ar"
          },
          {
            name: "All",
            value: "all"
          }
        ],
        tabs: [{
            name: "Companies",
            icon: "fas fa-building",
            isAdmin: true
          },
          {
            name: "Projects",
            icon: "fas fa-project-diagram"
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
            isAdmin: true
          }
        ],
        activeArray: [],
        invokeFilterType: "as"
      };
    },
    watch: {
      invokeFilterType(val, oldVal) {
        delete this.tabs[this.currentTabIndex].itemIndex;
        this.activeItem = undefined;
        this.getTabData();
      },
      getActiveArray(val, oldVal) {
        this.activeArray = val;
      },
      currentTabIndex(val) {
        // this.sidebarActive = true; // MAYBE USED LATER FOR ACTIVATING SIDE FROM MAIN
        let tabItem = this.tabs[val].itemIndex;
        this.activeItem = tabItem === tabItem;
      },
      adminFilter(val) {
        let i = this.currentTabIndex;
        this.tabs[i].isAdmin = val;
        this.actionTabDataPeople();
      },
      activeItem(val) {
        if (this.currentTabIndex === 0) this.companyID = val;
      },
      sidebarActive(val) {
        store.commit("mainFocused", !val);
        window.sessionStorage.sidebarActive = val;
      }
    },
    methods: {
      //REMOVE TTS() LATER
      // tts() {
      //   store.commit('modalStatus', {
      //     active: true,
      //     message: 'no comment'
      //   })
      //   // console.log('s');
      // },
      getTabData() {
        let index = this.currentTabIndex;
        let type = this.invokeFilterType;
        let s = type === null ? "assigned" : "created";
        let t = this.tabs[index].name === "Issues" ? "bugfix" : "task";
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
          case "all":
            s = "all";
            break;
        }
        switch (index) {
          case 0:
          case 4:
            this.actionTabDataPeople();
            break;
          case 1:
            this.actionTabDataProject(s, t, a);
            break;
          case 2:
          case 3:
            this.actionTabDataParentTask(s, t, a);
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
      actionTabDataParentTask(s, t, a) {
        store.dispatch("getUserAllTasks", {
          index: this.currentTabIndex,
          state: s,
          type: t,
          archived: a
        });
      },
      actionTabDataProject(s, t, a) {
        store.dispatch("getUserWork", {
          index: this.currentTabIndex,
          state: s,
          type: t,
          archived: a
        });
      },
      actionTabDataPeople() {
        let i = this.currentTabIndex;
        let name = i === 0 ? "getUserCompanies" : "getUserTeams";
        store.dispatch(name, {
          index: i,
          admin: this.tabs[i].isAdmin
          // comid: this.getCompanyID,
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
      deadlineSplit(dateTime) {
        return dateTime !== undefined && dateTime !== null ?
          dateTime.split(" ")[0] :
          "";
      },
      setActiveArray() {
        this.activeArray = this.getActiveArray;
      },
      userOptions() {
        alert("Avatar Kliknut");
      },
      signOut() {
        window.localStorage.removeItem("sid");
        api.sessionActive();
      },
      mouseOverPopup(val) {
        this.activePopup = val;
      }
    },
    computed: {
      ...mapState({
        getTabIndex: "currentTabIndex",
        getCompanyID: state => state.modulecompany.id
      }),
      getActiveArray() {
        return store.getters.currentTabData;
      },
      shownItemsCount() {
        return this.itemsFiltered === undefined ?
          null :
          this.itemsFiltered.length;
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
      let sidebarActive = window.sessionStorage.sidebarActive;
      if (sidebarActive !== undefined) {
        try {
          let parsed = JSON.parse(sidebarActive);
          this.sidebarActive = parsed;
        } catch (e) {
          console.log("Browser Storage is invalid " + e);
        }
      }
      store.commit("setSidebarData", {
        index: this.currentTabIndex
      });
      this.getTabData();
    }
  };

</script>

<style scoped>
  #sidebar {
    color: #eee;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .static-side .fas,
  .sidebar-header .fas {
    font-size: 125%;
  }

  /* SIDEBAR STATIC */

  .static-side {
    background: #2d3436;
    width: 70px;
    min-width: 70px;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    /* border-right: 1px solid #444; */
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
    text-align: center;
    padding: 12px 0;
    line-height: 30px;
    display: block;
    color: #fff;
    cursor: pointer;
  }

  .tablinks[disabled] {
    color: #0a0a0a;
    background: #4c4c4c;
  }

  .tablinks.active {
    background: #24262d;
    color: yellow;
    border-left: 3px solid yellow;
  }

  .tablinks:hover {
    background: #eadc903b;
    color: #fff;
    border-left: 3px solid #a7a7a7;
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

  .sidebar-lower {
    display: flex;
    flex: 1;
  }

  /* SIDEBAR HEADER */

  .sidebar-header {
    display: flex;
    justify-content: center;
    color: black;
    background: #ffb037;
    padding: 5px 5px 3px;
    font-size: 18px;
    text-align: center;
    /* width: 100%; */
    width: 276%;
    height: 45px;
  }

  .sidebar-header>a {
    display: block;
    margin: auto;
  }

  .sidebar-header>span {
    margin: auto 0 auto 20px;
    cursor: pointer;
  }

  .sidebar-header a .oi {
    margin-left: 10px;
  }

  .sidebar-header>a>.fas {
    margin-right: 15px;
  }

  /* HOVER EFFECT */

  #addItem:hover {
    box-shadow: 0 0 20px 4px rgba(255, 248, 19, 0.2);
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

  .search input.darkTheme:focus {
    background: #2d3436;
    color: #fff;
  }

  .search input.darkTheme::placeholder {
    color: #888;
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
    border-right: 1px solid #ffc10742;
  }

  .form-filter {
    border-bottom: 1px solid gray;
    margin-bottom: 10px;
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
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to
  /* .fade-leave-active below version 2.1.8 */

    {
    opacity: 0;
  }

</style>
