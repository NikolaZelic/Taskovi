<template>
  <aside id="sidebar" :class="{ collapsed: !sidebarActive }">

    <div class="sidebar-header" :class="{ collapsed: !sidebarActive }">
      <span>
        <span v-show='currentTabIndex !== 0 || itemAction.edit !== undefined || itemAction.add !== undefined' title="Collapse Sidebar"
          @click="setSidebarBoolean(!sidebarActive)" class='fas fa-angle-double-left collapse-btn' :class='{"collapsed":!sidebarActive}'>
        </span>
      </span>
      <div>
        <a v-if='currentTabIndex !== 0' @click="getTabData(currentTabIndex = 0)">
          <strong>{{ project.title }}</strong> / </a>
        <span>{{ tabs[currentTabIndex].name }}</span>
        <span v-if='totalRows !== 0' class='badge badge-dark'>{{ totalRows }}</span>
      </div>
      <span></span>
    </div>

    <div class="sidebar-lower">

      <div class="static-side">

        <ul class="tabs">
          <li v-for="(tab, index) in tabs" v-if="index === 0 || project.id !== undefined" :key="index" :title="tab.name" class="tablinks"
            :class="[{active:currentTabIndex === index}, tab.icon]" @click="getTabData(currentTabIndex = index), setSidebarBoolean(true)"
            :disabled="tab.disabled">
          </li>
        </ul>

        <div class="user-sidebar">
          <span title='Change Theme' @click='changeTheme' class='theme-changer' :class='{darkTheme : darkTheme}'></span>
          <!-- <span title="User Options" class="fas fa-user-cog"></span> -->

          <!-- <popup/> -->
          <div class='user-placeholder'>
            <transition name='fade'>
              <user-popup v-show='activePopup' :class='{show: activePopup}' />
            </transition>
            <img title="User Options" src="@/assets/img/user.png" @click="userOptions" @mouseover='mouseOverPopup(true)' @mouseleave='mouseOverPopup(false)'
            />
          </div>
          <span title="Sign Out" class="fas fa-sign-out-alt" @click="signOut"></span>
        </div>

      </div>

      <!-- <div class="sidebar-content" > -->
      <div class="sidebar-body" :class="{ collapsed: !sidebarActive }">
        <!-- FILTERS -->
        <div class="form-filter">

          <b-form-group>
            <b-input-group class='search custom-modern'>
              <b-input-group-text slot="prepend">
                <span class="fas fa-search" @click='focusSearch'></span>
              </b-input-group-text>
              <b-form-input ref='search' v-model.trim="tabs[currentTabIndex].search" placeholder="Type to Search" />
              <b-input-group-append v-if='tabs[currentTabIndex].search'>
                <b-btn @click="tabs[currentTabIndex].search = ''">X</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>

          <div class="item-filter">
            <b-form-group v-if="showSubFilter()" role="group">
              <b-form-checkbox-group v-model="selectedFilter" :options="radioFilter">
              </b-form-checkbox-group>
            </b-form-group>
          </div>

        </div>
        <div class="item-list">

          <b-table responsive :items="activeArray" :dark='true' :striped='false' :hover='false' :small='true' :bordered='true' :outlined='false'
            :fields="fieldsToShow"
            :filter="tabs[currentTabIndex].search"
             @filtered="onFiltered"
              @row-clicked="selectAndSet">

            <!-- FIX ACTIVE ITEM SELECTION!!!!!!!!!!!!!!!!1 -->
            <template slot="title" slot-scope="data" :class="{ active: activeItem === data.item.id}">
              <span>{{data.item.title}}</span>
            </template>

            <template slot="edit_item" slot-scope="data">
              <span v-if='currentTabIndex !== 0 || data.item.is_admin === "true"' @click.stop="editItemButton(data.item)" class="td-icons fas fa-edit"
                title="Edit Item"></span>
            </template>

          </b-table>

          <!-- <table>
            <thead>
              <tr>
                <th class='td-flex'>{{tabs[currentTabIndex].name}}</th>
                <template v-if=' currentTabIndex ===0  && itemAction.edit === undefined && itemAction.add === undefined'>
                  <th>Deadline</th>
                  <th>Users on Project</th>
                  <th>Completed Tasks</th>
                  <th>In Progress Tasks</th>
                </template>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itemsFiltered" :key='item.id' :class="{ active: activeItem === item.id}">
                <td @click='selectAndSet(item)' class='td-flex'>{{ item.title }}</td>
                <td v-if="item.haveUnseenFeed ==='true'">
                  <span title="Unread" class="badge badge-primary badge-pill">1</span>
                </td>
                <template v-if=' currentTabIndex ===0 && itemAction.edit === undefined && itemAction.add === undefined'>
                  <td v-if='item.deadline !== undefined' class="badge badge-danger badge-pill">{{item.deadline}}</td>
                  <td v-if='item.users_count !== undefined' class="badge badge-success badge-pill">{{item.users_count}}</td>
                  <td v-if='item.completed_tasks !== undefined' class="badge badge-primary badge-pill">{{item.completed_tasks}}</td>
                  <td v-if='item.inprogress_tasks !== undefined' class="badge badge-light badge-pill">{{item.inprogress_tasks}}</td>

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
                </template>
                <td>
                  <span v-if='currentTabIndex !== 0 || item.is_admin === "true"' @click="editItemButton(item)" class="td-icons fas fa-edit"
                    title="Edit Item"></span>
                </td>
              </tr>
            </tbody>
          </table> -->
        </div>
        <button id="addItem" class="btn btn-block btn-success" @click="addItemButton">
          <span class="fas fa-plus-circle"></span> Add New</button>
      </div>
      <!-- </div> -->

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
    UserPopup
  },
  data() {
    return {
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
          key: "edit_item",
          label: "Edit",
          class: "text-center"
        }
      ],
      taskFields: [
        {
          key: "title",
          label: "Tasks",
          sortable: true
        },
        {
          key: "edit_item",
          label: "Edit",
          class: "text-center"
        }
      ],
      totalRows: this.activeArray === undefined ? 0 : this.activeArray.length,
      currentTabIndex: 0,
      project: {
        title: undefined,
        id: undefined
      },
      // adminFilter: true,
      activePopup: false,
      activeItem: undefined,
      selectedFilter: ["cr", "as"],
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
          icon: "fas fa-project-diagram",
          search: ""
        },
        {
          name: "Tasks",
          icon: "fas fa-tasks",
          search: ""
        }
      ]
    };
  },
  watch: {
    selectedFilter() {
      //   console.log(val);
      //   delete this.tabs[this.currentTabIndex].itemIndex;
      //   this.activeItem = undefined;
      this.getTaskFilterData();
    },
    currentTabIndex(val) {
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
    }
  },
  methods: {
    selectAndSet(item) {
      this.selectItem(item.id);
      this.activeItem = item.id;
      // console.log(this.currentTabIndex)
      if (this.currentTabIndex === 0) {
        // console.log(this.currentTabIndex)
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
          // case 2:
          this.getTaskFilterData();
          break;
        // case 3:
        //   this.actionTabDataTeam();
        //   break;
      }
    },
    getTaskFilterData() {
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
      store.dispatch("getTasks", {
        index: this.currentTabIndex,
        pro_id: this.project.id,
        created: cr,
        assigned: as,
        archived: ar
      });
    },
    actionTabDataProject() {
      store.dispatch("getProjects", {
        index: this.currentTabIndex
      });
    },
    showSubFilter() {
      let i = this.currentTabIndex;
      return i === 1 || i === 2;
    },
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
      sidebarActive: state => !state.mainFocused
    }),
    activeArray() {
      return store.getters.currentTabData;
    },
    // shownItemsCount() {
    //   return this.itemsFiltered === undefined
    //     ? null
    //     : this.itemsFiltered.length;
    // },
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
      }
      return this.taskFields;
    },
    itemsFiltered() {
      //   let tabData = this.activeArray;
      //   if (tabData === undefined) return;
      //   let filtered = tabData.filter(it => {
      //     var item = it.title;
      //     var searchItem = this.tabs[this.currentTabIndex].search;
      //     return item == undefined || searchItem == undefined
      //       ? false
      //       : item.toLowerCase().indexOf(searchItem.toLowerCase()) > -1;
      //   });
      //   return filtered;
    }
  },
  created() {
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
  /* overflow-x: hidden; */
  /* border-right: 1px solid #444; */
}

.static-side span {
  padding: 15px;
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
  border-left: 3px solid var(--ac-bg-light-color);
}

.tablinks:hover,
.static-side span:hover {
  background: #eadc903b;
  color: var(--ac-color-light);
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
  .sidebar-header.collapsed>div
  /* .sidebar-header.collapsed .theme-changer  */

 {
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

/* ADD BUTTON */

#addItem {
  line-height: 10px;
  max-width: 500px;
  align-self: center;
}

#addItem:hover {
  box-shadow: 0 0 20px 1px rgba(19, 255, 45, 0.2);
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

.search * {
  border-color: #717171;
}

.form-control {
  border-color: #717171;
}

.search span {
  color: #fff;
  /*  position: absolute;
  left: 12px;
  top: 10px;
  opacity: 0.8; */
}

.search .input-group-text {
  background: #2d3436;
  border-right: 0;
}

.search input {
  /* text-indent: 25px; */
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
  max-width: 100%;
  background: #272a31;
  transition: all 0.5s ease;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-right: 1px solid var(--ac-color-dark);
}

/* .form-filter { */

/* border-bottom: 1px solid gray; */

/* margin-bottom: 10px; */

/* } */

.form-filter > form {
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
  height: 25px;
  width: 25px;
  margin: 20px auto;
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
