<template>
  <aside id="sidebar" :class="{ collapsed: !sidebarActive }">

    <div class="sidebar-header" :class="{ collapsed: !sidebarActive }">
      <span title="Collapse Sidebar" @click="sidebarActive = !sidebarActive" class='fas fa-angle-double-left collapse-btn' :class='{"collapsed":!sidebarActive}'>
      </span>
      <div>
        <a v-if='currentTabIndex !== 0' @click="getTabData(currentTabIndex = 0)">
          <strong>{{ project.title }}</strong> / </a>
        <span>{{ tabs[currentTabIndex].name }}</span>
        <span v-if='shownItemsCount !== 0' class='badge badge-dark'>{{ shownItemsCount }}</span>
      </div>
      <span></span>
    </div>

    <div class="sidebar-lower">

      <div class="static-side">

        <ul class="tabs">
          <li v-for="( tab, index ) in tabs" v-if="index === 0 || project.id !== undefined" :key="index" :title="tab.name" class="tablinks"
            :class="[{active:currentTabIndex === index}, tab.icon]" @click="getTabData(currentTabIndex = index), sidebarActive=true"
            :disabled="tab.disabled">
          </li>
        </ul>

        <div class="user-sidebar">
          <span title='Change Theme' @click='changeTheme' class='theme-changer' :class='{darkTheme : darkTheme}'></span>
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
              <div class="search custom-modern">
                <span class="fas fa-search"></span>
                <input class="form-control mr-sm-2 hidden-md-down" v-model.trim="searchData" type="search" placeholder="Search"
                  aria-label="Search">
              </div>
            </form>
            <form v-if="showSubFilter()" class="item-filter" role="group" aria-label="Item Filter">

              <b-form-group>
                <b-form-checkbox-group v-model="selectedFilter" :options="radioFilter">
                </b-form-checkbox-group>
              </b-form-group>

              <!-- <label v-for='f in radioFilter' :key='f.value'>
                <input type="checkbox" name="check" :value="f.value" v-model="invokeFilterType">
                <span class="label-text">{{f.text}}</span>
              </label> -->

            </form>
            <!-- <form v-if="showAdminFilter()" class="item-filter" role="group" aria-label="Item Filter">
              <label>
                <input type="checkbox" v-model="adminFilter">
                <span class="label-text">is Admin</span>
              </label>
            </form> -->
          </div>
          <div class="item-list">
            <!-- <task-sidebar v-if="currentTabIndex === 1 || currentTabIndex === 2" /> -->
            <table>
              <thead v-if='currentTabIndex === 0'>
                <tr><th>Project</th><th>Desc</th><th>DeadLine</th></tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsFiltered" :key='item.id' :class="{ active: activeItem === item.id}">
                  <td>
                    <span @click="editItemButton(item)" class="td-icons fas fa-edit" title="Edit Item"></span>
                  </td>
                  <td @click='selectAndSet(item)' class='td-flex'>{{ item.title }}</td>
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
import { store } from "@/store/index.js";
import { api } from "@/api/index.js";
import { mapGetters } from "vuex";
import { mapState } from "vuex";
import UserPopup from "./UserPopup";
export default {
  components: {
    UserPopup,
  },
  data() {
    return {
      // isTask: false,
      sidebarActive: true,
      searchData: "",
      currentTabIndex: 0,
      project: {
        title: undefined,
        id: undefined
      },
      // adminFilter: true,
      activePopup: false,
      activeItem: undefined,
      selectedFilter: ["as"],
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
          text: "Archived",
          value: "ar"
        }
      ],
      tabs: [
        {
          name: "Projects",
          icon: "fas fa-project-diagram"
        },
        {
          name: "Tasks",
          icon: "fas fa-tasks"
        }
      ]
    };
  },
  watch: {
    selectedFilter() {
      //   console.log(val);
      //   delete this.tabs[this.currentTabIndex].itemIndex;
      //   this.activeItem = undefined;
      this.getFilterData();
    },
    currentTabIndex(val) {
      // this.sidebarActive = true; // MAYBE USED LATER FOR ACTIVATING SIDE FROM MAIN
      let tabItem = this.tabs[val].itemIndex;

      // HAVE TO CHECK IF AN ITEM WITH THE SPECIFIED ID EXIST ON THE LIST TO DISPLAY IT
      // console.log(tabItem);
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
    adminFilter(val) {
      let i = this.currentTabIndex;
      this.tabs[i].isAdmin = val;
      this.actionTabDataTeam();
    },
    sidebarActive(val) {
      store.commit("mainFocused", !val);
      window.sessionStorage.sidebarActive = val;
    }
  },
  methods: {
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
          this.actionTabDataProject();
          break;
        case 1:
        case 2:
          this.getFilterData();
          break;
        case 3:
          this.actionTabDataTeam();
          break;
      }
    },
    getFilterData() {
      let cr = this.selectedFilter.includes("cr");
      let as = this.selectedFilter.includes("as");
      let ar = this.selectedFilter.includes("ar");
      this.actionTabDataTask(cr, as, ar);
    },
    selectItem(itemID) {
      this.tabs[this.currentTabIndex].itemIndex = itemID;
      store.commit("setSidebarItemSelection", {
        index: this.currentTabIndex,
        id: itemID
      });
    },
    actionTabDataTask(cr, as, ar) {
      store.dispatch("getUserTaskList", {
        index: this.currentTabIndex,
        pro_id: this.project.id,
        created: cr,
        assigned: as,
        archived: ar
      });
    },
    actionTabDataProject() {
      store.dispatch("getUserProjects", {
        index: this.currentTabIndex
      });
    },
    showSubFilter() {
      let i = this.currentTabIndex;
      return i === 1 || i === 2;
    },
    // showAdminFilter() {
    //   let i = this.currentTabIndex;
    //   return i === 3;
    // },
    addItemButton() {
      store.dispatch("itemAddClick");
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
    changeTheme() {
      localStorage.dark = !this.darkTheme;
      store.commit("darkTheme", !this.darkTheme);
    },
    userOptions() {
      alert("Avatar Kliknut");
    }
  },
  computed: {
    ...mapState({
      getTabIndex: "currentTabIndex",
      darkTheme: "darkTheme"
    }),
    activeArray() {
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
        return item == undefined || searchItem == undefined
          ? false
          : item.toLowerCase().indexOf(searchItem.toLowerCase()) > -1;
      });
      return filtered;
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
    // WRITE CURRENT TAB TO STORE
    store.commit("setSidebarData", {
      index: this.currentTabIndex
    });
    // MAKE REQUEST TO SERVER FOR TAB DATA
    this.getTabData();
    // SET TASK VIEW IF ONLY ONE PROJECT
    if (this.itemsFiltered !== undefined && this.itemsFiltered.length === 1)
      selectAndSet(this.itemsFiltered[0]);
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
  font-size: 140%;
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

.static-side > * {
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
  border-left: 3px solid var(--ac-light-color);
}

.tablinks:hover,
.static-side span:hover {
  background: #eadc903b;
  color: var(--ac-light-color);
  /* border-left: 3px solid #a7a7a7; */
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

.sidebar-header.collapsed {
  width: 70px;
}

/* .sidebar-header.collapsed > span {
    margin: 0;
  } */

#sidebar.collapsed {
  width: unset;
}

.sidebar-content.collapsed *,
  .sidebar-header.collapsed>div
  /* .sidebar-header.collapsed .theme-changer  */

 {
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
  justify-content: space-between;
  align-items: center;
  color: black;
  background: var(--ac-light-color);
  padding: 5px 5px 3px;
  font-size: 18px;
  text-align: center;
  height: 45px;
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

/* ADD BUTTON */

#addItem {
  line-height: 10px;
}

#addItem:hover {
  box-shadow: 0 0 20px 1px rgba(255, 248, 19, 0.2);
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
  background: #2d3436;
  color: #fff;
}

.search input:hover {
  border: 1px solid var(--ac-color);
}
.search input::placeholder {
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

.form-filter > form {
  margin-bottom: 10px;
}

.item-filter {
  display: flex;
  justify-content: space-around;
}

.item-filter > * {
  color: white;
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
  height: 25px;
  width: 25px;
  margin: 20px auto;
  /* padding: auto; */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
