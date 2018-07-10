<!-- SLUZI ZA TESTIRANJE -->
<!-- NA KRAJU OBRISATI -->
<!-- ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
 -->

<template>
<div>

  <select class="col-md-1 offset-md-6 mt-5" >
    <option value="2" selected disabled>In Progress</option>
    <option value="3" hidden>Completed</option>
    <option value="4" >Failed</option>
  </select>

</div>
</template>

<script>
import axios from "axios";
import {store} from "@/store/index.js";
import {mapGetters} from "vuex";
import Multiselect from 'vue-multiselect'

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/confetti.css");

export default {
  components: {
    flatPickr,
    Multiselect
  },

  data() {
    return {
      valueTag: [],
      optionsTag: [],

      // editDescription: false,

      edit: {
        name: undefined,
        description: undefined,
        status: undefined,
        priority: undefined,
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
        altInput: true
      },
      estDate: {
        wrap: false, // set wrap to true only when using 'input-group'
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i:S",
        altFormat: "F	j, Y H:i",
        altInput: true
      }
    };
  },

  methods: {

loadTags(){
  // console.log(this.$refs.tagSearchString.search)

  axios.get("http://695u121.mars-t.mars-hosting.com/mngapi/projects/:proid/tags", {
  params: {
        proid: this.selectedProjectID,
        type: 'task',
        searchstring: this.$refs.tagSearchString.search,
        sid: window.localStorage.getItem("sid")
      }

      }).then(response =>{
        // console.log(response.data.data);
        // this.optionsTag = response.data.data;
        this.optionsTag = response.data.data;
      })
},

    saveDescription(){
      console.log('saved desc edit');
    },

    saveChanges(){
      axios.put("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid", {

            tasid: this.selectedItemID,
            stepid: this.stepInfo[0].tsk_id,
            sid: window.localStorage.getItem("sid"),

            title: this.edit.name,
            description:  this.edit.description,
            deadline:  this.edit.deadline,
            priority: this.edit.priority,
            status: this.edit.status,
            progress: this.edit.progress,
            timespent: this.edit.timespent,
            estimateddate:  this.edit.estTime,
            usersarray: this.userStringArray,
            tagarray: this.tagStringArray

      }).then( response =>{
        $('#stepInformation, #stepEdit').modal('hide');
          this.getTaskInfo(this.selectedItemID);
      })
    },

    loadAllProjectUsers(projectID){
      axios.get("http://695u121.mars-t.mars-hosting.com/mngapi/projects/:proid/users", {
          params: {
            proid: projectID,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
            this.optionsUser = response.data.data;
            // console.log(response.data.data)
          })
    },

    addTag (newTag) {
          const tag = {
            text: newTag
          }
          this.valueTag.push(tag)
        },

        addUser (newUser) {
              const user = {
                id: newUser
              }
              this.valueUser.push(user)
            },


    getStepInfo(stepID) {
      // console.log('taskID' + taskID + ', stepID' + stepID);
      axios.get("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid", {
          params: {
            tasid: this.selectedItemID,
            stepid: stepID,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          if (response.data.data !== undefined) {
            // console.log(response.data.data);
            this.stepInfo = response.data.data;


            for (var i = 0; i < response.data.data.length; i++) {
              // console.log(response.data.data[i].pri_text === 'MAX' ? true : false);

              if (this.stepInfo[i].tsk_timespent !== null) {
                if (this.stepInfo[i].tsk_timespent <= 59) {
                  this.stepInfo[i].tsk_timespent = this.stepInfo[i].tsk_timespent + ' minutes'
                } else {
                  let minutes = this.stepInfo[i].tsk_timespent % 60;
                  let hours = parseInt(this.stepInfo[i].tsk_timespent / 60);

                  this.stepInfo[i].tsk_timespent = hours + ' hour(s), ' + minutes + ' minute(s)'
                }
              }

              if (this.stepInfo[i].sta_text !== null) {

                if (this.stepInfo[i].sta_text === 'Assigned' || this.stepInfo[i].sta_text === 'In Progress') {
                  this.stepInfo[i].background = 'bg-info'
                } else if (this.stepInfo[i].sta_text === 'Failed' || this.stepInfo[i].sta_text === 'Rejected' || this.stepInfo[i].sta_text === 'Cancelled') {
                  this.stepInfo[i].background = 'bg-danger'
                } else if (this.stepInfo[i].sta_text === 'Completed') {
                  this.stepInfo[i].background = 'bg-success'
                }
                else{
                  this.stepInfo[i].background = 'bg-secondary'
                }
              }else{
                  this.stepInfo[i].background = 'bg-secondary'
              }





              if (this.stepInfo[i].tsk_deadline === null) {
                this.stepInfo[i].tsk_deadline = ''
              } else {
                this.stepInfo[i].tsk_deadline = (moment(response.data.data[i].tsk_deadline).format('MMMM Do YYYY, h:mm:ss a'));
              }

              if (this.stepInfo[i].tsk_estimated_completion_date === null) {
                this.stepInfo[i].tsk_estimated_completion_date = ''
              } else {
                this.stepInfo[i].tsk_estimated_completion_date = (moment(response.data.data[i].tsk_estimated_completion_date).format('MMMM Do YYYY, h:mm:ss a'));
              }

              if (this.stepInfo[i].tsk_timecreated === null) {
                this.stepInfo[i].tsk_timecreated = ''
              } else {
                this.stepInfo[i].tsk_timecreated = (moment(response.data.data[i].tsk_timecreated).format('MMMM Do YYYY, h:mm:ss a'));
              }

              if (this.stepInfo[i].pri_text === 'High') {
                this.stepInfo[i].pri_badge = 'badge-danger'
              } else if (this.stepInfo[i].pri_text === 'Medium') {
                this.stepInfo[i].pri_badge = 'badge-warning'
              } else if (this.stepInfo[i].pri_text === 'Low') {
                this.stepInfo[i].pri_badge = 'badge-info'
              }
            }


          }


          // this.stepInfo.tags = this.tas
          this.stepModal = true;
        }).then(response => {


          this.valueTag = [];
          if(this.stepInfo[0] !== undefined){
            for (var i = 0; i < this.stepInfo[0].tags.length; i++) {
              // console.log(this.stepInfo[0].tags[i].tag_text)
              // console.log(this.options.name);
              const tag = {
                id: this.stepInfo[0].tags[i].id,
                text: this.stepInfo[0].tags[i].text
              }
              this.valueTag.push(tag);
            }
          }

        }).then(response => {


          this.valueUser = [];
          if(this.stepInfo[0] !== undefined){
            for (var i = 0; i < this.stepInfo[0].usrworking.length; i++) {
              // console.log(this.stepInfo[0].tags[i].tag_text)
              // console.log(this.options.name);
              const user = {
                id: this.stepInfo[0].usrworking[i].usr_id,
                name: this.stepInfo[0].usrworking[i].usr_name,
                email: this.stepInfo[0].usrworking[i].usr_email
              }
              // console.log(this.stepInfo[0].usrworking[i]);
              this.valueUser.push(user);
            }
          }

        })


      // .then(response => {
      //   window.location.href = "#step";
      // });



    },

    getTaskInfo(taskID) {
      axios.get("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps", {
          params: {
            tasid: taskID,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          if (response.data.data !== undefined) {


            this.taskInfo = response.data.data;

            for (var i = 0; i < response.data.data.length; i++) {
              // console.log(response.data.data[i].pri_text === 'MAX' ? true : false);


              if (this.taskInfo[i].tsk_deadline === null) {
                this.taskInfo[i].tsk_deadline = ''
              } else {
                this.taskInfo[i].tsk_deadline = (moment(response.data.data[i].tsk_deadline).format('MMMM Do YYYY, h:mm:ss a'));
              }

              if (this.taskInfo[i].pri_text === 'High') {
                this.taskInfo[i].pri_badge = 'badge-danger'
              } else if (this.taskInfo[i].pri_text === 'Medium') {
                this.taskInfo[i].pri_badge = 'badge-warning'
              } else if (this.taskInfo[i].pri_text === 'Low') {
                this.taskInfo[i].pri_badge = 'badge-info'
              }
            }



            // this.taskInfo.tsk_deadline = 'a'//moment(response.data.data.tsk_deadline ).format('MMMM Do YYYY, h:mm:ss a')
          }
        });
    }
  },

  computed: {

    tagStringArray(){
      let niz = [];
      for (var i = 0; i < this.valueTag.length; i++) {
        niz.push(this.valueTag[i].text);
      }
      return JSON.stringify(niz);
    },

    userStringArray(){
      let niz = [];
      for (var i = 0; i < this.valueUser.length; i++) {
        niz.push(this.valueUser[i].id);
      }
      return JSON.stringify(niz);
    },

    selectedItemID() {
      var a = store.getters.selectedItemID;
      console.log(a);
      if (a === undefined) return 0;
      else return a;
    },

    selectedProjectID() {
      var a = store.state.sidebarItemSelection[0];
      if (a === undefined) return 0;
      else return a;
    },

    selectedTaskID() {
      var a = store.getters.selectedItemID;
      // console.log(a);
      if (a === undefined) return 0;
      else return a;
    },

    showSteps() {
      if (this.selectedItemID === 0) {
        this.stepShow = false;
        return;
      } else {
        this.stepShow = true;
        return;
      }

    },

    deadlineDate() {
      return moment(this.taskInfo.deadline, 'YYYY-MM-DD HH:mm:ss.S').format('DD/MM/YYYY (HH:mm)'); //moment(this.taskInfo.deadline, "YYYY");
    },

    createdDate() {
      return moment(this.taskInfo.createdDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD/MM/YYYY (HH:mm)'); //moment(this.taskInfo.deadline, "YYYY");
    }

  },

  mounted() {
    if (this.selectedItemID !== 0) {
      this.getTaskInfo(this.selectedItemID);

    }

    this.loadAllProjectUsers(this.selectedProjectID);


  },

  watch: {
    'selectedItemID': function(val, oldVal) {
      if (val !== 0) {
        this.getTaskInfo(val);
        this.getStepInfo(val);
        // this.loadAllProjectUsers(val);
      }
      // this.getCompanyInfo(val);
      // this.loadAdmins(val);
      // this.loadEmployees(val);
    },


    'selectedProjectID': function(val, oldVal) {
      console.log('prijekat' + val);
      // if (val !== 0) {
      //   this.loadAllProjectUsers(val);
      // }
    },

    'selectedTaskID': function(val, oldVal) {
      // console.log('a');
        if (val !== 0) {
          console.log('novi je task broj' + val);
        }
    }

  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
h1 {
  text-align: left;
}

.task-header {
  color: #333 !important;
}

.step-header {
  color: #fff !important;
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
</style>
