<template>
  <div>
    <!-- {{ this.timeOffset() }} -->
    <!-- {{ $moment("2018-08-01 08:22:32.0").add(1, 'year') }} -->
    <button @click="mom">a</button>
  </div>
</template>

<script>
import axios from "axios";
import { store } from "@/store/index.js";
import { mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import { api } from "@/api/index";
import { mapState } from "vuex";
import FeedElement from "@/components/Feed/FeedElement";
import Avatar from "vue-avatar";

// import moment from 'moment';

// import StepEdit from "@/components/Content/Task/StepEdit";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/material_blue.css");

export default {
  components: {
    flatPickr,
    Multiselect,
    FeedElement,
    // StepEdit,
    Avatar
  },

  data() {
    return {
      date: "2018-08-01 08:22:32.0",
      // youWorkedFor: 0,
      // inProgress: false,
      tabParam: undefined,
      editFields: false,

      tabs: {
        generalInfo: true,
        messages: false,
        steps: false
      },

      taskGeneralInfo: [],

      stepInfoShow: false,
      stepEditShow: false,

      showInactive: false,
      inactiveUsers: [],

      // valueTag: [],
      // optionsTag: [],

      // editDescription: false,

      edit: {
        name: undefined,
        description: undefined,
        status: undefined,
        // priority: undefined,
        deadline: undefined,
        estTime: undefined,
        timespent: undefined,
        progress: undefined
      },

      valueUser: [],
      optionsUser: [],

      taskInfo: [],
      showAllTags: false,
      showAllTagsID: undefined,
      stepInfo: [],
      stepShow: false,
      stepModal: false,

      project: {
        title: undefined,
        description: undefined,
        users: undefined,
        deadline: undefined,
        estDate: undefined
      },

      config: {
        wrap: false, // set wrap to true only when using 'input-group'
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i:S",
        altFormat: "F	j, Y H:i",
        altInput: true,
        minDate: "today"
      },
      estDate: {
        wrap: false, // set wrap to true only when using 'input-group'
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i:S",
        altFormat: "F	j, Y H:i",
        altInput: true,
        minDate: "today"
      }
    };
  },

  methods: {
    mom(){
      let a = this.$moment(this.date).subtract(10, 'minutes').format('YYYY-MM-DD HH:mm')
      // let b = this.$moment(a).add(10, 'year');
      console.log(a);
    },

    taskStatus(parameter) {
      axios
        .put(
          "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/status",
          {
            sid: localStorage.sid,
            status: parameter,
            tasid: this.selectedItemID
          }
        )
        .then(response => {
          // console.log('ovde')
          this.resetTaskView();
        });
    },

    editTaskBtn(taskID) {
      store.commit("itemEditClick", {
        id: this.selectedItemID
      });
    },

    editStepBtn(stepID) {
      store.commit("itemEditClick", {
        id: this.selectedItemID
      });
    },

    // jumpToFeed(task) {
    //   var stp_time_created = task.tsk_timecreated;
    //   var tsk_id = this.selectedItemID;
    //   store.commit("setSearchFeedParams", {
    //     tsk_id: tsk_id,
    //     stp_time_created
    //   });
    //   this.changeTab("messages");
    // },

    getGeneralInfo(taskID) {
      api.loadTaskInfo(localStorage.sid, taskID).then(response => {
        // this.taskGeneralInfo = response.data.data[0];
        // console.log(response.data.data[0]);
      });
    },

    changeTab(parameter) {
      if (parameter === "generalInfo") {
        this.tabs.generalInfo = true;
        this.tabs.steps = false;
        this.tabs.messages = false;
        this.getGeneralInfo(this.selectedItemID);
        this.stepInfoShow = false;
        this.stepEditShow = false;
      }

      if (parameter === "steps") {
        this.tabs.generalInfo = false;
        this.tabs.steps = true;
        this.tabs.messages = false;
        this.getTaskInfo(this.selectedItemID);
        this.stepInfoShow = false;
        this.stepEditShow = false;
      }

      if (parameter === "messages") {
        this.tabs.generalInfo = false;
        this.tabs.steps = false;
        this.tabs.messages = true;
        this.stepInfoShow = false;
        this.stepEditShow = false;
      }
    },

    showInactiveUsers() {
      //TRAZITI OD CELAVOG API KOJI VRACA SVE NEAKTIVNE USERE
    },

    resetTaskView() {
      store.commit("itemActionReset");
      store.commit("resetTaskView");
    },

    removeUser(removedOption) {
      let user = {
        id: removedOption.id,
        name: removedOption.name,
        email: removedOption.email
      };

      this.valueUser.push(user);
      // console.log(removedOption.email);
      // console.log(id);
    },

    itemAddStep() {
      this.tabs.generalInfo = false;
      this.tabs.steps = true;
      this.tabs.messages = false;
      store.commit("itemAddStep");
      // console.log('itemAddStep metoda')
    },

    loadTags() {
      // console.log(this.$refs.tagSearchString.search)
      api
        .loadTags(
          this.selectedProjectID,
          this.$refs.tagSearchString.search,
          localStorage.sid
        )
        .then(response => {
          // console.log(response.data.data);
          // this.optionsTag = response.data.data;
          if (response.data.data !== undefined) {
            this.optionsTag = response.data.data;
          }
        });
    },

    // saveDescription() {
    //   console.log("saved desc edit");
    // },

    // saveChanges() {
    //   axios
    //     .put(
    //       "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid",
    //       {
    //         tasid: this.selectedItemID,
    //         stepid: this.stepInfo[0].tsk_id,
    //         sid: localStorage.sid,
    //
    //         title: this.edit.name,
    //         description: this.edit.description,
    //         deadline: this.edit.deadline,
    //         // priority: this.edit.priority,
    //         status: this.edit.status,
    //         progress: this.edit.progress,
    //         timespent: this.edit.timespent,
    //         estimateddate: this.edit.estTime,
    //         usersarray: this.userStringArray
    //         // tagarray: this.tagStringArray
    //       }
    //     )
    //     .then(response => {
    //       this.getTaskInfo(this.selectedItemID);
    //       this.getStepInfo(this.stepInfo[0].tsk_id);
    //
    //       (this.edit.name = undefined),
    //         (this.edit.description = undefined),
    //         (this.edit.deadline = undefined),
    //         // (this.edit.priority = undefined),
    //         (this.edit.status = undefined),
    //         (this.edit.progress = undefined),
    //         (this.edit.timespent = undefined),
    //         (this.edit.estTime = undefined);
    //
    //       this.reportWritingToDB(response);
    //     });
    // },

    reportWritingToDB(result) {
      if (result.data.status === "OK") {
        store.commit("modalStatus", {
          message: "Step is edited successfully"
        });
      } else {
        store.commit("modalStatus", {
          ok: false,
          message: result.data.message
        });
      }
    },

    loadAllProjectUsers(projectID) {
      api.loadAllProjectUsers(localStorage.sid, projectID).then(response => {
        if (response.data.data !== undefined)
          this.optionsUser = response.data.data.users;
      });
    },

    addTag(newTag) {
      const tag = {
        text: newTag
      };
      this.valueTag.push(tag);
    },

    stepInfoToggle() {
      this.changeTab(this.tabParam);
      this.stepEditShow = false;
      this.stepInfoShow = true; //!this.stepInfoShow;
    },

    stepEditToggle() {
      this.stepInfoShow = false;
      this.stepEditShow = true; //!this.stepEditShow;
    },

    // getStepInfo(stepID) {
    //   axios
    //     .get(
    //       "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid",
    //
    //       {
    //         params: {
    //           tasid: this.selectedItemID,
    //           stepid: stepID,
    //           sid: localStorage.sid
    //         }
    //       }
    //     )
    //     .then(response => {
    //       if (response.data.data !== undefined) {
    //         // console.log(response.data.data);
    //         this.stepInfo = response.data.data;
    //
    //         // this.edit.name = response.data.data[0].tsk_title;
    //         // this.edit.description = response.data.data[0].description;
    //         // this.edit.status = response.data.data[0].sta_id;
    //         // this.edit.deadline = response.data.data[0].tsk_deadline;
    //         // this.edit.estTime = response.data.data[0].tsk_estimated_completion_date;
    //         // this.edit.timespent = response.data.data[0].tsk_timespent;
    //         // this.edit.progress = response.data.data[0].tsk_progress;
    //         // this.valueUser = response.data.data[0].usrworking;
    //
    //         for (var i = 0; i < response.data.data.length; i++) {
    //           // console.log(response.data.data[i].pri_text === 'MAX' ? true : false);
    //
    //           if (this.stepInfo[i].tsk_timespent !== null) {
    //             if (this.stepInfo[i].tsk_timespent <= 59) {
    //               this.stepInfo[i].tsk_timespent =
    //                 this.stepInfo[i].tsk_timespent + " minutes";
    //             } else {
    //               let minutes = this.stepInfo[i].tsk_timespent % 60;
    //               let hours = parseInt(this.stepInfo[i].tsk_timespent / 60);
    //
    //               this.stepInfo[i].tsk_timespent =
    //                 hours + " hour(s), " + minutes + " minute(s)";
    //             }
    //           }
    //
    //           if (this.stepInfo[i].sta_text !== null) {
    //             if (
    //               this.stepInfo[i].sta_text === "Assigned" ||
    //               this.stepInfo[i].sta_text === "In Progress"
    //             ) {
    //               this.stepInfo[i].background = "bg-info";
    //             } else if (
    //               this.stepInfo[i].sta_text === "Failed" ||
    //               this.stepInfo[i].sta_text === "Rejected" ||
    //               this.stepInfo[i].sta_text === "Cancelled"
    //             ) {
    //               this.stepInfo[i].background = "bg-danger";
    //             } else if (this.stepInfo[i].sta_text === "Completed") {
    //               this.stepInfo[i].background = "bg-success";
    //             } else {
    //               this.stepInfo[i].background = "bg-secondary";
    //             }
    //           } else {
    //             this.stepInfo[i].background = "bg-secondary";
    //           }
    //
    //           if (this.stepInfo[i].tsk_deadline === null) {
    //             this.stepInfo[i].tsk_deadline = "";
    //           } else {
    //             this.stepInfo[i].tsk_deadline = this.$moment(
    //               response.data.data[i].tsk_deadline
    //             ).format("MMMM Do YYYY, h:mm a");
    //           }
    //
    //           if (this.stepInfo[i].tsk_estimated_completion_date === null) {
    //             this.stepInfo[i].tsk_estimated_completion_date = "";
    //           } else {
    //             this.stepInfo[i].tsk_estimated_completion_date = this.$moment(
    //               response.data.data[i].tsk_estimated_completion_date
    //             ).format("MMMM Do YYYY, h:mm a");
    //           }
    //
    //           if (this.stepInfo[i].tsk_timecreated === null) {
    //             this.stepInfo[i].tsk_timecreated = "";
    //           } else {
    //             this.stepInfo[i].tsk_timecreated = this.$moment(
    //               response.data.data[i].tsk_timecreated
    //             ).format("MMMM Do YYYY, h:mm a");
    //           }
    //
    //           if (this.stepInfo[i].pri_text === "High") {
    //             this.stepInfo[i].pri_badge = "badge-danger";
    //           } else if (this.stepInfo[i].pri_text === "Medium") {
    //             this.stepInfo[i].pri_badge = "badge-warning";
    //           } else if (this.stepInfo[i].pri_text === "Low") {
    //             this.stepInfo[i].pri_badge = "badge-info";
    //           }
    //         }
    //       }
    //
    //       this.stepModal = true;
    //     })
    //     .then(response => {
    //       this.valueTag = [];
    //       if (this.stepInfo[0] !== undefined) {
    //         for (var i = 0; i < this.stepInfo[0].tags.length; i++) {
    //           const tag = {
    //             id: this.stepInfo[0].tags[i].id,
    //             text: this.stepInfo[0].tags[i].text
    //           };
    //           this.valueTag.push(tag);
    //         }
    //       }
    //     })
    //     .then(response => {
    //       this.valueUser = [];
    //       if (this.stepInfo[0] !== undefined) {
    //         for (var i = 0; i < this.stepInfo[0].usrworking.length; i++) {
    //           const user = {
    //             id: this.stepInfo[0].usrworking[i].usr_id,
    //             name: this.stepInfo[0].usrworking[i].usr_name,
    //             email: this.stepInfo[0].usrworking[i].usr_email
    //           };
    //           this.valueUser.push(user);
    //         }
    //       }
    //     })
    //     .then(response => {
    //       axios
    //         .get(
    //           "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid/inactiveusers",
    //           {
    //             params: {
    //               tasid: this.selectedItemID,
    //               stepid: stepID,
    //               sid: localStorage.sid
    //             }
    //           }
    //         )
    //         .then(response => {
    //           this.stepInfo[0].usrinactive = response.data.data;
    //         });
    //     });
    // },

    getTaskInfo(taskID) {
      api.getTaskInfo(taskID).then(response => {
        if (response.data.data !== undefined) {
          this.taskInfo = response.data.data;

          for (var i = 0; i < response.data.data.length; i++) {
            if (this.taskInfo[i].tsk_deadline === null) {
              this.taskInfo[i].tsk_deadline = "";
            } else {
              this.taskInfo[i].tsk_deadline = this.$moment(
                response.data.data[i].tsk_deadline
              ).format("MMMM Do YYYY, h:mm a");
            }

            let j = this.taskInfo[i];
            if (j.pri_text === "High") {
              this.taskInfo[i].pri_badge = "badge-danger";
            } else if (j.pri_text === "Medium") {
              this.taskInfo[i].pri_badge = "badge-warning";
            } else if (j.pri_text === "Low") {
              this.taskInfo[i].pri_badge = "badge-info";
            }
          }
        }
      });
    }
  },

  computed: {
    taskStatusBtn() {
      return this.taskGeneralInfo.sta_text === "In Progress";
    },

    currentMiniTab: {
      get() {
        if (this.tabs.generalInfo) return 0;
        if (this.tabs.steps) return 1;
        if (this.tabs.messages) return 2;
        return -1;
      },
      set() {}
    },

    inProgressExists() {
      let exists = false;

      for (var i = 0; i < this.taskInfo.length; i++) {
        if (this.taskInfo[i].sta_text === "In Progress") {
          exists = true;
        }
      }

      return exists;
    },

    generalInfoTrue() {
      // if(this.tabs.generalInfo === true){
      //   console.log('baaa');
      // } else {
      //   console.log('babaababa');
      // }
      return this.tabs.generalInfo;
    },

    youWorked() {
      if (this.stepInfo !== []) {
        for (var i = 0; i < this.stepInfo[0].usrworking.length; i++) {
          if (this.stepInfo[0].usrworking[i].isyou === "true") {
            return this.stepInfo[0].usrworking[i].timespent;
          } else {
            continue;
          }
        }
      } else {
        return 0;
      }
    },

    tagStringArray() {
      let niz = [];
      for (var i = 0; i < this.valueTag.length; i++) {
        niz.push(this.valueTag[i].text);
      }
      return JSON.stringify(niz);
    },

    userStringArray() {
      let niz = [];
      for (var i = 0; i < this.valueUser.length; i++) {
        niz.push(this.valueUser[i].id);
      }
      return JSON.stringify(niz);
    },

    selectedItemID() {
      var a = store.getters.selectedItemID;
      // console.log(a);
      if (a === undefined) return 0;
      else return a;
    },

    selectedProjectID() {
      var a = store.state.sidebarItemSelection[0];
      if (a === undefined) return 0;
      else return a;
    },

    selectedTaskID() {
      // var a = store.getters.selectedTaskID;
      // // console.log(a);
      // if (a === undefined) return 0;
      // else return a;
    },

    showSteps() {
      this.stepShow = this.selectedItemID === 0;
      return;
    },

    deadlineDate() {
      return this.$moment(
        this.taskInfo.deadline,
        "YYYY-MM-DD HH:mm:ss.S"
      ).format("DD/MM/YYYY (HH:mm)");
    },

    createdDate() {
      return this.$moment(
        this.taskInfo.createdDate,
        "YYYY-MM-DD HH:mm:ss.S"
      ).format("DD/MM/YYYY (HH:mm)");
    },

    ...mapState({
      itemEditClick: "itemEditClick",
      addStep: state => state.itemAction.addStep,
      darkTheme: state => state.darkTheme
    })
  },

  mounted() {
    this.localToUTC("2018-08-01 08:22:32.0");
    date();
    // if (this.selectedItemID !== 0) {
    // this.getTaskInfo(this.selectedItemID);
    this.getGeneralInfo(this.selectedItemID);
    // this.getTaskInfo(this.selectedItemID);
    // }

    this.loadAllProjectUsers(this.selectedProjectID);
  },

  watch: {
    // 'taskInfo': function(val, oldVal) {
    //   this.inProgressExists();
    // },
    // addingNewTask: function(val, oldVal){
    //   console.log(val);
    // },

    addStep: function(val, oldVal) {
      // console.log('val ' + val);
      // console.log('Oldval ' + oldVal);
      if (val === false) {
        this.getTaskInfo(this.selectedItemID);
        //this.getStepInfo(this.stepInfo[0].tsk_id);
      }
      // console.log('addstep iz watch-a');

      // if (this.selectedItemID !== undefined) {
      // this.getTaskInfo(this.selectedItemID);
      // }
      // this.getTaskInfo(store.state.selectedItemID);
    },

    selectedItemID: function(val, oldVal) {
      if (val !== 0) {
        // this.getTaskInfo(val);
        // this.getStepInfo(val);
        //this.getGeneralInfo(val);
        if (this.tabParam === undefined || this.tabParam === "generalInfo") {
          this.changeTab("generalInfo");
        } else if (this.tabParam === "steps") {
          this.changeTab("steps");
        } else if (this.tabParam === "messages") {
          // console.log(this.$refs.feed);
          this.$refs.feed.changeSelectedTask();
          this.changeTab("messages");
        }

        this.stepInfoShow = false;
        this.stepEditShow = false;
        // this.loadAllProjectUsers(val);
      }
      // this.getCompanyInfo(val);
      // this.loadAdmins(val);
      // this.loadEmployees(val);
    },

    selectedProjectID: function(val, oldVal) {
      // console.log('prijekat' + val);
      // if (val !== 0) {
      //   this.loadAllProjectUsers(val);
      // }
    },

    selectedTaskID: function(val, oldVal) {
      // console.log('a');
      if (val !== 0) {
        // console.log('novi je task broj' + val);
      }
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
<style scoped>
h1 {
  text-align: left;
}

.tabs {
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
}

.save {
  display: inline-block;
  margin-left: auto;
}

.save .fa {
  margin: 0 10px;
}

.card {
  border: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  border: 1px solid #c3c1c13d;
}

.card-header.darkTheme,
  /* .card-footer.darkTheme  */

 {
  background: var(--dark);
  color: var(--sec-color);
}

.card-body {
  border: 1px solid #8e8e8e4d;
  border-radius: 5px;
}

.card-body td:first-child {
  color: #adadad;
  padding-right: 30px;
}

.card.darkTheme {
  background: var(--dark-super);
  color: var(--sec-color) !important;
}

.table-hover tbody tr:hover {
  background-color: #6f6f6f1f;
}

.badge {
  margin: 0.125rem;
}

.pointer {
  cursor: pointer;
}

.pad-0 {
  padding: 0;
}

.slika {
  border: 1px solid #333;
}

label {
  padding-top: 10px;
}

.stepInfoShow {
  width: 100%;
}

.stepInfoShow td {
  width: 50%;
  padding: 5px 0;
}

.header {
  display: flex;
  padding: 10px 20px;
  justify-content: space-between;
  color: initial;
}

.link {
  cursor: pointer;
  text-decoration: underline;
}

.back-button {
  flex-grow: 0.1 !important;
}

button.nav-item {
  margin: 5px;
}

.height100 {
  margin-top: 21px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-box {
  /* height: 100%; */
  /* padding-bottom: 50px; */
}

td.align-top {
  width: 20%;
}

.stepInfoShow tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.poslednjiRed {
  border-bottom: 0px !important;
}

nav .btn-warning.active {
  background-color: #ffe186 !important;
  border-color: #ffe186 !important;
}

input[type="text" i]:disabled {
  background-color: #ffffff;
  border: 0;
  color: #000000;
  font-weight: 400;
}

textarea:disabled {
  background-color: #ffffff;
  border: 0;
  color: #000000;
  font-weight: 400;
}

#task-table td {
  padding: 5px 10px;
}

td .form-control {
  border: none;
  border-bottom: 1px solid #a09e9e57;
  padding-left: 0px;
}

.fa-hand-point-right {
  cursor: pointer;
}
</style>
