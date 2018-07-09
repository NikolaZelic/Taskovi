<template>
  <div>

    <template v-if="selectedItemID <= 0">
      <h1>Select task first...</h1>
    </template>

    <template v-else>

      <!-- Showing data about all steps inside selected task -->
      <div class="card" v-if="!stepInfoShow && !stepEditShow">

        <div class="card-header task-header" v-if="taskInfo[0] !== undefined">
          {{ taskInfo[0].taskname }}
        </div>

        <div class="card-body">

          <table class="table table-borderless text-center text-dark table-hover">

            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Title</th>
                <th scope="col">Deadline</th>
                <th scope="col">Tags</th>
                <th scope="col">Priority</th>
                <th scope="col">Working</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(task, index) in taskInfo" :key='index' @click='getStepInfo(task.tsk_id); stepInfoToggle()' data-toggle="modal" data-target="#stepInformation">

                <td>
                  <i class="fas fa-check-circle text-success" v-if="task.sta_text === 'Completed'"></i>
                  <i class="fas fa-spinner text-info" v-if="task.sta_text === 'In Progress' || task.sta_text === 'Assigned'"></i>
                  <i class="fas fa-exclamation-triangle text-danger" v-if="task.sta_text === 'Failed' || task.sta_text === 'Rejected' || task.sta_text === 'Cancelled'"></i>
                </td>

                <td>
                  {{ task.tsk_title}}
                </td>

                <td>
                  {{ task.tsk_deadline }}
                </td>

                <td>
                  <span class="badge badge-success" v-for="(tag,index) in task.tags.slice(0, 3)" :key='index'>{{ tag.tag_text }}</span>
                  <span v-if="task.tags.length > 3">+ {{task.tags.length - 3}}</span>
                </td>

                <td>
                  <span class="badge" :class="task.pri_badge">{{task.pri_text}}</span>
                </td>

                <td>
                  {{task.usrworking}}
                </td>

              </tr>
            </tbody>

          </table>

        </div>

        <div class="card-footer">
          <button type="button" class="btn btn-primary"  @click="itemAddStep">Add new step...</button>
        </div>

      </div>

      <!-- Showing data about selected step -->
      <div class="card" v-if='stepInfoShow && !stepEditShow && stepInfo[0] !== undefined'>

        <div class="card-header">
          {{ stepInfo[0].tsk_title }}
        </div>

        <div class="card-body">
          <table class="stepInfoShow">

            <tr>
              <td class="align-top">Project:</td>
              <td>{{stepInfo[0].pro_name}}</td>
            </tr>

            <tr>
              <td class="align-top">Task:</td>
              <td>{{stepInfo[0].taskname}}</td>
            </tr>

            <tr v-if="stepInfo[0].description !== null">
              <td class="align-top">Description:</td>
              <td>{{stepInfo[0].description}}</td>
            </tr>

            <tr>
              <td class="align-top">Status:</td>
              <td>{{stepInfo[0].sta_text}}
                <i class="fas fa-check-circle text-success" v-if="stepInfo[0].sta_text === 'Completed'"></i>
                <i class="fas fa-spinner text-info" v-if="stepInfo[0].sta_text === 'In Progress' || stepInfo[0].sta_text === 'Assigned'"></i>
                <i class="fas fa-exclamation-triangle text-danger" v-if="stepInfo[0].sta_text === 'Failed' || stepInfo[0].sta_text === 'Rejected' || stepInfo[0].sta_text === 'Cancelled'"></i>
              </td>
            </tr>

            <tr v-if="stepInfo[0].tsk_progress !== null">
              <td class="align-top">Progress:</td>
              <td>
                <div class="progress">
                  <div class="progress-bar" role="progressbar" :style=" 'width:' + stepInfo[0].tsk_progress + '%' ">{{stepInfo[0].tsk_progress}}%</div>
                </div>
              </td>
            </tr>

            <tr v-if="stepInfo[0].pri_text !== null">
              <td class="align-top">Priority:</td>
              <td><span class="badge" :class="stepInfo[0].pri_badge">{{stepInfo[0].pri_text}}</span></td>
            </tr>

            <tr v-if="stepInfo[0].tags.length > 0">
              <td class="align-top">Tags:</td>
              <td>
                <span class="badge badge-success" v-for="(tag,index) in stepInfo[0].tags" :key='index'>{{ tag.text }}</span>
              </td>
            </tr>

            <tr v-if="stepInfo[0].tsk_deadline !== ''">
              <td class="align-top">Deadline:</td>
              <td>{{stepInfo[0].tsk_deadline}}</td>
            </tr>

            <tr v-if="stepInfo[0].tsk_estimated_completion_date !== ''">
              <td class="align-top">Estimated completion date:</td>
              <td>{{stepInfo[0].tsk_estimated_completion_date}}</td>
            </tr>

            <tr>
              <td class="align-top">Created by:</td>
              <td>
                <ul class="list-unstyled">
                  <li class="media mt-2">

                    <img v-if='stepInfo[0].usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + stepInfo[0].usr_picture" />

                    <div class="media-body">
                      <div class="media-body">
                        <h5 class="mt-0 mb-1">{{stepInfo[0].usr_creator_name}} {{stepInfo[0].usr_creator_surname}}</h5>
                        <span>{{stepInfo[0].usr_email}}</span>
                      </div>
                    </div>

                  </li>
                </ul>
              </td>
            </tr>

            <tr>
              <td class="align-top">Time created:</td>
              <td>{{stepInfo[0].tsk_timecreated}}</td>
            </tr>

            <tr v-if="stepInfo[0].tsk_timespent !== null">
              <td class="align-top">Time spent:</td>
              <td>{{stepInfo[0].tsk_timespent}}</td>
            </tr>

            <tr>
              <td class="align-top">Working:</td>
              <td>
                <ul class="list-unstyled">
                  <li class="media mt-2" v-for="(user,index) in stepInfo[0].usrworking" :key='index'>

                    <img v-if='user.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + user.usr_picture" />

                    <div class="media-body">
                      <div class="media-body">
                        <h5 class="mt-0 mb-1">{{user.usr_name}}</h5>
                        <span>{{user.usr_email}}</span>
                      </div>
                    </div>

                  </li>
                </ul>
              </td>
            </tr>

          </table>
        </div>

        <div class="card-footer">
          <div class="float-right">
            <button type="button" class="btn btn-warning" @click="stepEditToggle()">Edit</button>
            <button type="button" class="btn btn-primary" @click="stepInfoToggle()">Back</button>
          </div>
        </div>

      </div>

      <!-- Showing edit fields about selected step -->
      <div class="card" v-if='!stepInfoShow && stepEditShow && stepInfo[0] !== undefined'>

        <div class="card-header bg-warning">
          {{ stepInfo[0].tsk_title }}
        </div>

        <div class="card-body">

          <div v-if="stepInfo[0].yours === null">
            <label for="name">Task name:</label>
            <input type="text" class="form-control" id="name" v-model="edit.name">
          </div>

          <div v-if="stepInfo[0].yours === null">
            <label for="desc">Description:</label>
            <textarea class="form-control" id="desc" rows="3" v-model="edit.description"></textarea>
          </div>

          <label for="status">Change status:</label>
          <select class="form-control" id="status" v-model="edit.status">
            <option value="2" v-if="stepInfo[0].yours === null">In Progress</option>
            <option value="3" v-if="stepInfo[0].yours === 1">Completed</option>
            <option value="4" v-if="stepInfo[0].yours === 1">Failed</option>
            <option value="5" v-if="stepInfo[0].yours === 1">Rejected</option>
            <option value="6" v-if="stepInfo[0].yours === null">Cancelled</option>
          </select>

          <div v-if="stepInfo[0].yours === null">
            <label for="priority">Change priority:</label>
            <select class="form-control" id="priority" v-model="edit.priority">
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>

          <label class="tag" for="tags">Tags</label>
          <multiselect @search-change="loadTags"  :preserveSearch="true" :closeOnSelect="false" ref="tagSearchString"
          v-model="valueTag" id="tags" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="text" track-by="id" :options="optionsTag"
          :multiple="true" :taggable="true" @tag="addTag">
          </multiselect>

          <div v-if="stepInfo[0].yours === null">
            <label for="deadline">Deadline:</label>
            <flat-pickr name="deadline" ref='deadline' :config="config" id='deadline' class="form-control mb-3" v-model="edit.deadline" :placeholder="stepInfo[0].tsk_deadline"></flat-pickr>
          </div>

          <div v-if="stepInfo[0].yours === 1">
            <label for="estDate">Estimated completion date:</label>
            <flat-pickr name="estDate" ref='estDate' :config="estDate" id='estDate' class="form-control mb-3" v-model="edit.estTime" :placeholder="stepInfo[0].tsk_estimated_completion_date"></flat-pickr>
          </div>

          <div v-if="stepInfo[0].yours === 1">
            <label for="timeSpent">Time spent [in minutes]:</label>
            <input type="number" class="form-control" id="timeSpent" :placeholder=" 'So far: ' + stepInfo[0].tsk_timespent" v-model="edit.timespent">
          </div>

          <div v-if="stepInfo[0].yours === null">
            <label for="progress">Progress: </label>
            <input type="range" class="custom-range" min="0" max="100" step="1" id="progress" v-model="edit.progress">
          </div>

          <label class="tag" for="working">Working:</label>
          <multiselect v-model="valueUser" id="working" placeholder="Search for users" label="name" track-by="id" :options="optionsUser" :multiple="true">
          <span slot="noResult">There's no users with searched name in this project.</span>
          </multiselect>

        </div>

        <div class="card-footer">
          <div class="float-right">
            <button type="button" class="btn btn-warning" @click="saveChanges(); stepInfoToggle();">Save</button>
            <button type="button" class="btn btn-primary" @click="stepInfoToggle() ">Back</button>
          </div>
        </div>

      </div>

    </template>

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
      stepInfoShow: false,
      stepEditShow: false,


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
    itemAddStep(){
        store.commit("itemAddStep");
        // console.log('itemAddStep metoda')
    },


loadTags(){
  // console.log(this.$refs.tagSearchString.search)

  axios.get("http://682b121.mars1.mars-hosting.com/mngapi/projects/:proid/tags", {
  params: {
        proid: this.selectedProjectID,
        type: 'task',
        searchstring: this.$refs.tagSearchString.search,
        sid: window.localStorage.getItem("sid")
      }

      }).then(response =>{
        // console.log(response.data.data);
        // this.optionsTag = response.data.data;
        if(response.data.data !== undefined){
          this.optionsTag = response.data.data;
        }
      })
},

    saveDescription(){
      // console.log('saved desc edit');
    },

    saveChanges(){
      axios.put("http://682b121.mars1.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid", {

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

      }).then(response => {
          this.getStepInfo(this.stepInfo[0].tsk_id);
          this.getTaskInfo(this.selectedItemID);

          this.edit.name = undefined,
          this.edit.description = undefined,
          this.edit.deadline = undefined,
          this.edit.priority = undefined,
          this.edit.status = undefined,
          this.edit.progress = undefined,
          this.edit.timespent = undefined,
          this.edit.estTime = undefined
      })
    },

    loadAllProjectUsers(projectID){
      axios.get("http://682b121.mars1.mars-hosting.com/mngapi/projects/:proid/users", {
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

stepInfoToggle(){
  this.stepEditShow = false;
  this.stepInfoShow = !this.stepInfoShow;
},

stepEditToggle(){
  this.stepInfoShow = false;
  this.stepEditShow = !this.stepEditShow;
},


    getStepInfo(stepID) {
      // console.log('taskID' + taskID + ', stepID' + stepID);
      axios.get("http://682b121.mars1.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid", {
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
                this.stepInfo[i].tsk_deadline = (moment(response.data.data[i].tsk_deadline).format('MMMM Do YYYY, h:mm a'));
              }

              if (this.stepInfo[i].tsk_estimated_completion_date === null) {
                this.stepInfo[i].tsk_estimated_completion_date = ''
              } else {
                this.stepInfo[i].tsk_estimated_completion_date = (moment(response.data.data[i].tsk_estimated_completion_date).format('MMMM Do YYYY, h:mm a'));
              }

              if (this.stepInfo[i].tsk_timecreated === null) {
                this.stepInfo[i].tsk_timecreated = ''
              } else {
                this.stepInfo[i].tsk_timecreated = (moment(response.data.data[i].tsk_timecreated).format('MMMM Do YYYY, h:mm a'));
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
      axios.get("http://682b121.mars1.mars-hosting.com/mngapi/tasks/:tasid/steps", {
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
                this.taskInfo[i].tsk_deadline = (moment(response.data.data[i].tsk_deadline).format('MMMM Do YYYY, h:mm a'));
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

        this.stepInfoShow = false;
        this.stepEditShow = false;
        // this.loadAllProjectUsers(val);
      }
      // this.getCompanyInfo(val);
      // this.loadAdmins(val);
      // this.loadEmployees(val);
    },


    'selectedProjectID': function(val, oldVal) {
      // console.log('prijekat' + val);
      // if (val !== 0) {
      //   this.loadAllProjectUsers(val);
      // }
    },

    'selectedTaskID': function(val, oldVal) {
      // console.log('a');
        if (val !== 0) {
          // console.log('novi je task broj' + val);
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

.stepInfoShow{
  width: 100%;
}

.stepInfoShow td{
  width: 50%;
  padding: 5px 0;
}
</style>
