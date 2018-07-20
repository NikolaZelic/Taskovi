<template>
<div class="height100 pb-5"  :class='{darkTheme: darkTheme}'>

  <template v-if="selectedItemID <= 0">
    <h1>Select task first...</h1>
  </template>

  <template v-else>

      <!-- Tabovi na vrhu stranice -->
      <nav class="nav nav-pills nav-fill mb-3">
        <button type="button" class="btn btn-dark nav-item nav-link back-button" @click='resetTaskView'><span class='fas fa-arrow-left'></span> Back</button>
        <button type="button" class="btn btn-warning nav-item nav-link" @click="changeTab('generalInfo')" :class="{'active': tabs.generalInfo}">General</button>
        <button type="button" class="btn btn-warning nav-item nav-link" @click="changeTab('steps')" :class="{'active': tabs.steps}">Steps</button>
        <button type="button" class="btn btn-warning nav-item nav-link" @click="changeTab('messages')" :class="{'active': tabs.messages}">Messages</button>
      </nav>

      <!-- TAB GeneralInfo -->
      <div class="card" :class='{darkTheme: darkTheme}' v-if="tabs.generalInfo">

        <div class="card-header"  :class='{darkTheme: darkTheme}'>
          <h4>{{this.taskGeneralInfo.tsk_title}}</h4>
        </div>

        <div class="card-body">
          <p>Project: {{this.taskGeneralInfo.pro_name}}</p>
          <p>Description: {{this.taskGeneralInfo.description}}</p>
          <p>Created by: {{this.taskGeneralInfo.usr_creator_name}} {{this.taskGeneralInfo.usr_creator_surname}}</p>
          <p>Time created: {{this.taskGeneralInfo.tsk_timecreated}}</p>
          <p>Deadline: {{this.taskGeneralInfo.tsk_deadline}}</p>
          <p>Status: {{this.taskGeneralInfo.sta_text}}</p>
          <!-- <p>Priority: {{this.taskGeneralInfo.pri_text}}</p> -->
          <!-- <p>Tags: <span class="badge badge-success" v-for="(tag,index) in this.taskGeneralInfo.tags" :key='index'>{{ tag.text }}</span></p> -->
        </div>

      </div>

      <!-- TAB Steps -->
      <div class="card" :class='{darkTheme: darkTheme}' v-if="tabs.steps">
        <div class="card-header task-header" :class='{darkTheme: darkTheme}' v-if="taskInfo[0] !== undefined">
          {{ taskInfo[0].taskname }}
        </div>

        <div class="card-body">
          <table class="table table-borderless table-hover">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Title</th>
                <th scope="col">Deadline</th>
                <!-- <th scope="col">Tags</th> -->
                <!-- <th scope="col">Priority</th> -->
                <th scope="col">Working</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(task, index) in taskInfo" :key='index' @click='getStepInfo(task.tsk_id); stepInfoToggle(); tabs.steps = false'>
                <td>
                  <i class="fas fa-check-circle text-success" v-if="task.sta_text === 'Completed'"></i>
                  <i class="far fa-hourglass text-info" v-if="task.sta_text === 'In Progress' || task.sta_text === 'Assigned'"></i>
                  <i class="fas fa-exclamation-triangle text-danger" v-if="task.sta_text === 'Failed' || task.sta_text === 'Rejected' || task.sta_text === 'Cancelled'"></i>
                </td>

                <td>
                 {{ task.tsk_title}}
                </td>

                <td>
                  {{ task.tsk_deadline }}
                </td>

                <!-- <td>
                  <span class="badge badge-success" v-for="(tag,index) in task.tags.slice(0, 3)" :key='index'>{{ tag.tag_text }}</span>
                  <span v-if="task.tags.length > 3">+ {{task.tags.length - 3}}</span>
                </td>

                <td>
                  <span class="badge" :class="task.pri_badge">{{task.pri_text}}</span>
                </td> -->

                <td>
                  <span v-if="task.you_are_worker === 1">
                    <i class="fas fa-user-cog" title="You are working on this step"></i> + {{task.usrworking - 1}} </span>
                  <span v-else>{{task.usrworking}}</span>
                </td>
              </tr>
            </tbody>

           </table>

         </div>

         <div class="card-footer" :class='{darkTheme: darkTheme}'>
           <button type="button" class="btn btn-primary" @click="itemAddStep" :disabled="inProgressExists">Add new step...</button>
         </div>
       </div>

      <!-- TAB Feeds -->
      <div class="card chat-box" :class='{darkTheme: darkTheme}' v-if="tabs.messages">
        <feed-element />
      </div>


      <!-- STEP data -->

      <!-- Showing data about selected step -->
      <div class="card mt-5" :class='{darkTheme: darkTheme}'  v-if="stepInfo.length > 0 &&  stepInfoShow">

        <div class="card-header" :class='{darkTheme: darkTheme}'>
          {{ stepInfo[0].tsk_title }}
        </div>

        <div class="card-body">
          <table class="stepInfoShow">

            <tr>
              <td class="align-top">Project:</td>
              <td><h5>{{stepInfo[0].pro_name}}</h5></td>
            </tr>

            <tr>
              <td class="align-top">Task:</td>
              <td><h5>{{stepInfo[0].taskname}}</h5></td>
            </tr>

            <tr v-if="stepInfo[0].description !== null">
              <td class="align-top">Description:</td>
              <td><h5>{{stepInfo[0].description}}</h5></td>
            </tr>

            <tr>
              <td class="align-top">Status:</td>
              <td><h5>{{stepInfo[0].sta_text}}
                <i class="fas fa-check-circle text-success" v-if="stepInfo[0].sta_text === 'Completed'"></i>
                <i class="far fa-hourglass text-info" v-if="stepInfo[0].sta_text === 'In Progress' || stepInfo[0].sta_text === 'Assigned'"></i>
                <i class="fas fa-exclamation-triangle text-danger" v-if="stepInfo[0].sta_text === 'Failed' || stepInfo[0].sta_text === 'Rejected' || stepInfo[0].sta_text === 'Cancelled'"></i>
                </h5>
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

            <!-- <tr v-if="stepInfo[0].pri_text !== null">
              <td class="align-top">Priority:</td>
              <td>
                <span class="badge" :class="stepInfo[0].pri_badge">{{stepInfo[0].pri_text}}</span>
              </td>
            </tr> -->

            <!-- <tr v-if="stepInfo[0].tags.length > 0">
              <td class="align-top">Tags:</td>
              <td>
                <span class="badge badge-success" v-for="(tag,index) in stepInfo[0].tags" :key='index'>{{ tag.text }}</span>
              </td>
            </tr> -->

            <tr v-if="stepInfo[0].tsk_deadline !== ''">
              <td class="align-top">Deadline:</td>
              <td><h5>{{stepInfo[0].tsk_deadline}}</h5></td>
            </tr>

            <tr v-if="stepInfo[0].tsk_estimated_completion_date !== ''">
              <td class="align-top">Estimated completion date:</td>
              <td><h5>{{stepInfo[0].tsk_estimated_completion_date}}</h5></td>
            </tr>

            <tr>
              <td class="align-top">Created by:</td>
              <td>
                <ul class="list-unstyled">
                  <li class="media mt-2">

                    <img v-if='stepInfo[0].usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png"/>
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + stepInfo[0].usr_picture"/>

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
              <td><h5>{{stepInfo[0].tsk_timecreated}}</h5></td>
            </tr>

            <tr v-if="stepInfo[0].tsk_timespent !== null">
              <td class="align-top">Total time spent:</td>
              <td><h5>{{stepInfo[0].tsk_timespent}}</h5></td>
            </tr>

            <tr class="poslednjiRed">
              <td class="align-top">Working:</td>
              <td>
                <ul class="list-unstyled">
                  <li class="media mt-2" v-for="(user,index) in stepInfo[0].usrworking" :key='index'>

                    <img v-if='user.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + user.usr_picture" />

                    <div class="media-body">
                      <div class="media-body">
                        <h5 class="mt-0 mb-1 inline-block">{{user.usr_name}}<small> -- {{user.usr_email}}</small></h5>
                        <span>Worked on this step for {{user.timespent}} minutes</span>
                      </div>
                    </div>

                  </li>

                  <li class="mt-3 mb-3 text-primary link" @click="showInactiveUsers; showInactive = !showInactive" v-if="!showInactive">Show inactive workers...</li>
                  <li class="mt-3 mb-3 text-primary link" @click="showInactive = !showInactive" v-if="showInactive">Hide inactive workers...</li>

                  <li class="media mt-2 text-muted" v-for="(inactive,index) in stepInfo[0].usrinactive" :key='index' v-if="showInactive">

                    <img v-if='inactive.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + inactive.usr_picture" />

                    <div class="media-body">
                      <div class="media-body">
                        <h5 class="mt-0 mb-1 inline-block">{{inactive.usr_name}}<small> -- {{inactive.usr_email}}</small></h5>
                        <span>Worked on this step for {{inactive.timespent}} minutes</span>
                      </div>
                    </div>

                  </li>

                </ul>
              </td>
            </tr>

          </table>
        </div>

        <div class="card-footer" :class='{darkTheme: darkTheme}'>
          <div class="float-right">
            <button type="button" class="btn btn-warning" @click="stepEditToggle()" v-if="stepInfo[0].you_are_creator !== null || stepInfo[0].you_are_worker !== null">Edit</button>
            <button type="button" class="btn btn-primary" @click="tabs.steps = true; stepInfoShow = false">Back</button>
          </div>
        </div>
      </div>

      <!-- Showing edit fields about selected step -->
      <div class="card mt-5" :class='{darkTheme: darkTheme}' v-if='stepInfo.length > 0 && stepEditShow'>

        <div class="card-header bg-warning" :class='{darkTheme: darkTheme}'>
          {{ stepInfo[0].tsk_title }}
        </div>

        <div class="card-body">

          <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="name">Task name:</label>
            <input type="text" class="form-control" id="name" v-model="edit.name">
          </div>

          <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="desc">Description:</label>
            <textarea class="form-control" id="desc" rows="3" v-model="edit.description"></textarea>
          </div>

          <label for="status">Change status:</label>
            <select class="form-control" id="status" v-model="edit.status">
            <option value="2" v-if="stepInfo[0].you_are_creator === 1">In Progress</option>
            <option value="3" v-if="stepInfo[0].you_are_worker === 1">Completed</option>
            <option value="4" v-if="stepInfo[0].you_are_worker === 1">Failed</option>
            <option value="5" v-if="stepInfo[0].you_are_worker === 1">Rejected</option>
            <option value="6" v-if="stepInfo[0].you_are_creator === 1">Cancelled</option>
          </select>

          <!-- <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="priority">Change priority:</label>
            <select class="form-control" id="priority" v-model="edit.priority">
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div> -->

          <!-- <label class="tag" for="tags">Tags</label>
          <multiselect @search-change="loadTags" :preserveSearch="true" :closeOnSelect="false" ref="tagSearchString" v-model="valueTag"
            id="tags" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="text" track-by="id" :options="optionsTag"
            :multiple="true" :taggable="true" @tag="addTag">
          </multiselect> -->

          <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="deadline">Deadline:</label>
            <flat-pickr name="deadline" ref='deadline' :config="config" id='deadline' class="form-control mb-3" v-model="edit.deadline"
              :placeholder="stepInfo[0].tsk_deadline"></flat-pickr>
          </div>

          <div v-if="stepInfo[0].you_are_worker === 1">
            <label for="estDate">Estimated completion date:</label>
            <flat-pickr name="estDate" ref='estDate' :config="estDate" id='estDate' class="form-control mb-3" v-model="edit.estTime"
              :placeholder="stepInfo[0].tsk_estimated_completion_date"></flat-pickr>
          </div>

          <div v-if="stepInfo[0].you_are_worker === 1">
            <label for="timeSpent">Your time spent [in minutes]:</label>
            <input type="number" class="form-control" id="timeSpent" :placeholder=" 'So far ' + youWorked + ' minutes'" v-model="edit.timespent">
          </div>

          <div v-if="stepInfo[0].you_are_worker === 1">
            <label for="progress">Progress: </label>
            <input type="range" class="custom-range" min="0" max="100" step="1" id="progress" v-model="edit.progress">
          </div>

          <label class="tag" for="working">Working:</label>

          <multiselect v-if="stepInfo[0].you_are_worker === 1 && stepInfo[0].you_are_creator !== 1" v-model="valueUser" id="working" placeholder="Search for users" label="name" track-by="id" :options="optionsUser" @remove="removeUser"
            :multiple="true">
            <span slot="noResult">There's no users with searched name in this project.</span>
          </multiselect>

          <multiselect v-if="stepInfo[0].you_are_creator === 1" v-model="valueUser" id="working" placeholder="Search for users" label="name" track-by="id" :options="optionsUser"
            :multiple="true">
            <span slot="noResult">There's no users with searched name in this project.</span>
          </multiselect>

        </div>

        <div class="card-footer" :class='{darkTheme: darkTheme}'>
          <div class="float-right">
            <button type="button" class="btn btn-warning" @click="saveChanges(); stepInfoToggle();">Save</button>
            <button type="button" class="btn btn-primary" @click="stepInfoToggle() ">Back</button>
          </div>
        </div>

      </div>

      <!-- Showing edit fields about selected step -->
      <div class="card mt-5" :class='{darkTheme: darkTheme}' v-if='stepInfo.length > 0 && stepEditShow'>

        <div class="card-header bg-warning" :class='{darkTheme: darkTheme}'>
          {{ stepInfo[0].tsk_title }}
        </div>

        <div class="card-body">

          <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="name">Task name:</label>
            <input type="text" class="form-control" id="name" v-model="edit.name">
          </div>

          <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="desc">Description:</label>
            <textarea class="form-control" id="desc" rows="3" v-model="edit.description"></textarea>
          </div>

          <label for="status">Change status:</label>
            <select class="form-control" id="status" v-model="edit.status">
            <option value="2" v-if="stepInfo[0].you_are_creator === 1">In Progress</option>
            <option value="3" v-if="stepInfo[0].you_are_worker === 1">Completed</option>
            <option value="4" v-if="stepInfo[0].you_are_worker === 1">Failed</option>
            <option value="5" v-if="stepInfo[0].you_are_worker === 1">Rejected</option>
            <option value="6" v-if="stepInfo[0].you_are_creator === 1">Cancelled</option>
          </select>

          <!-- <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="priority">Change priority:</label>
            <select class="form-control" id="priority" v-model="edit.priority">
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div> -->

          <!-- <label class="tag" for="tags">Tags</label>
          <multiselect @search-change="loadTags" :preserveSearch="true" :closeOnSelect="false" ref="tagSearchString" v-model="valueTag"
            id="tags" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="text" track-by="id" :options="optionsTag"
            :multiple="true" :taggable="true" @tag="addTag">
          </multiselect> -->

          <div v-if="stepInfo[0].you_are_creator === 1">
            <label for="deadline">Deadline:</label>
            <flat-pickr name="deadline" ref='deadline' :config="config" id='deadline' class="form-control mb-3" v-model="edit.deadline"
              :placeholder="stepInfo[0].tsk_deadline"></flat-pickr>
          </div>

          <div v-if="stepInfo[0].you_are_worker === 1">
            <label for="estDate">Estimated completion date:</label>
            <flat-pickr name="estDate" ref='estDate' :config="estDate" id='estDate' class="form-control mb-3" v-model="edit.estTime"
              :placeholder="stepInfo[0].tsk_estimated_completion_date"></flat-pickr>
          </div>

          <div v-if="stepInfo[0].you_are_worker === 1">
            <label for="timeSpent">Your time spent [in minutes]:</label>
            <input type="number" class="form-control" id="timeSpent" :placeholder=" 'So far ' + youWorked + ' minutes'" v-model="edit.timespent">
          </div>

          <div v-if="stepInfo[0].you_are_worker === 1">
            <label for="progress">Progress: </label>
            <input type="range" class="custom-range" min="0" max="100" step="1" id="progress" v-model="edit.progress">
          </div>

          <label class="tag" for="working">Working:</label>

          <multiselect v-if="stepInfo[0].you_are_worker === 1 && stepInfo[0].you_are_creator !== 1" v-model="valueUser" id="working" placeholder="Search for users" label="name" track-by="id" :options="optionsUser" @remove="removeUser"
            :multiple="true">
            <span slot="noResult">There's no users with searched name in this project.</span>
          </multiselect>

          <multiselect v-if="stepInfo[0].you_are_creator === 1" v-model="valueUser" id="working" placeholder="Search for users" label="name" track-by="id" :options="optionsUser"
            :multiple="true">
            <span slot="noResult">There's no users with searched name in this project.</span>
          </multiselect>

        </div>

        <div class="card-footer" :class='{darkTheme: darkTheme}'>
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
import {
  store
} from "@/store/index.js";
import {
  mapGetters
} from "vuex";
import Multiselect from "vue-multiselect";
import {
  api
} from "@/api/index";
import {
  mapState
} from "vuex";
import FeedElement from "@/components/Feed/FeedElement";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/confetti.css");

export default {
  components: {
    flatPickr,
    Multiselect,
    FeedElement
  },

  data() {
    return {
      // youWorkedFor: 0,
      // inProgress: false,

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
    getGeneralInfo(taskID) {
      axios.get("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid", {
        params: {
          tasid: taskID,
          sid: localStorage.sid
        }
      }).then(response => {
        this.taskGeneralInfo = response.data.data[0];
        // console.log(response.data.data[0]);
      })
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
        // console.log('Parametar messages')
      }

      // console.log(parameter);
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
      store.commit("itemAddStep");
      // console.log('itemAddStep metoda')
    },

    loadTags() {
      // console.log(this.$refs.tagSearchString.search)

      axios
        .get(
          "http://695u121.mars-t.mars-hosting.com/mngapi/projects/:proid/tags", {
            params: {
              proid: this.selectedProjectID,
              type: "task",
              searchstring: this.$refs.tagSearchString.search,
              sid: localStorage.sid
            }
          }
        )
        .then(response => {
          // console.log(response.data.data);
          // this.optionsTag = response.data.data;
          if (response.data.data !== undefined) {
            this.optionsTag = response.data.data;
          }
        });
    },

    saveDescription() {
      // console.log('saved desc edit');
    },

    saveDescription() {
      console.log("saved desc edit");
    },

    saveChanges() {
      axios
        .put(
          "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid", {
            tasid: this.selectedItemID,
            stepid: this.stepInfo[0].tsk_id,
            sid: localStorage.sid,

            title: this.edit.name,
            description: this.edit.description,
            deadline: this.edit.deadline,
            // priority: this.edit.priority,
            status: this.edit.status,
            progress: this.edit.progress,
            timespent: this.edit.timespent,
            estimateddate: this.edit.estTime,
            usersarray: this.userStringArray,
            // tagarray: this.tagStringArray
          }
        )
        .then(response => {

          this.getTaskInfo(this.selectedItemID);
          this.getStepInfo(this.stepInfo[0].tsk_id);

          (this.edit.name = undefined),
          (this.edit.description = undefined),
          (this.edit.deadline = undefined),
          // (this.edit.priority = undefined),
          (this.edit.status = undefined),
          (this.edit.progress = undefined),
          (this.edit.timespent = undefined),
          (this.edit.estTime = undefined);

          this.reportWritingToDB(response);
        });
    },

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
      axios
        .get("http://695u121.mars-t.mars-hosting.com/mngapi/projects/:proid", {
          params: {
            proid: projectID,
            sid: localStorage.sid
          }
        })
        .then(response => {
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
      this.stepEditShow = false;
      this.stepInfoShow = true; //!this.stepInfoShow;
    },

    stepEditToggle() {
      this.stepInfoShow = false;
      this.stepEditShow = true; //!this.stepEditShow;
    },

    getStepInfo(stepID) {
      // console.log('taskID' + taskID + ', stepID' + stepID);
      axios
        .get(
          "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid",

          {
            params: {
              tasid: this.selectedItemID,
              stepid: stepID,
              sid: localStorage.sid
            }
          }
        )
        .then(response => {
          if (response.data.data !== undefined) {
            // console.log(response.data.data);
            this.stepInfo = response.data.data;

            // this.edit.name = response.data.data[0].tsk_title;
            // this.edit.description = response.data.data[0].description;
            // this.edit.status = response.data.data[0].sta_id;
            // this.edit.deadline = response.data.data[0].tsk_deadline;
            // this.edit.estTime = response.data.data[0].tsk_estimated_completion_date;
            // this.edit.timespent = response.data.data[0].tsk_timespent;
            // this.edit.progress = response.data.data[0].tsk_progress;
            // this.valueUser = response.data.data[0].usrworking;








            for (var i = 0; i < response.data.data.length; i++) {
              // console.log(response.data.data[i].pri_text === 'MAX' ? true : false);

              if (this.stepInfo[i].tsk_timespent !== null) {
                if (this.stepInfo[i].tsk_timespent <= 59) {
                  this.stepInfo[i].tsk_timespent =
                    this.stepInfo[i].tsk_timespent + " minutes";
                } else {
                  let minutes = this.stepInfo[i].tsk_timespent % 60;
                  let hours = parseInt(this.stepInfo[i].tsk_timespent / 60);

                  this.stepInfo[i].tsk_timespent =
                    hours + " hour(s), " + minutes + " minute(s)";
                }
              }

              if (this.stepInfo[i].sta_text !== null) {
                if (
                  this.stepInfo[i].sta_text === "Assigned" ||
                  this.stepInfo[i].sta_text === "In Progress"
                ) {
                  this.stepInfo[i].background = "bg-info";
                } else if (
                  this.stepInfo[i].sta_text === "Failed" ||
                  this.stepInfo[i].sta_text === "Rejected" ||
                  this.stepInfo[i].sta_text === "Cancelled"
                ) {
                  this.stepInfo[i].background = "bg-danger";
                } else if (this.stepInfo[i].sta_text === "Completed") {
                  this.stepInfo[i].background = "bg-success";
                } else {
                  this.stepInfo[i].background = "bg-secondary";
                }
              } else {
                this.stepInfo[i].background = "bg-secondary";
              }

              if (this.stepInfo[i].tsk_deadline === null) {
                this.stepInfo[i].tsk_deadline = "";
              } else {
                this.stepInfo[i].tsk_deadline = moment(
                  response.data.data[i].tsk_deadline
                ).format("MMMM Do YYYY, h:mm a");
              }

              if (this.stepInfo[i].tsk_estimated_completion_date === null) {
                this.stepInfo[i].tsk_estimated_completion_date = "";
              } else {
                this.stepInfo[i].tsk_estimated_completion_date = moment(
                  response.data.data[i].tsk_estimated_completion_date
                ).format("MMMM Do YYYY, h:mm a");
              }

              if (this.stepInfo[i].tsk_timecreated === null) {
                this.stepInfo[i].tsk_timecreated = "";
              } else {
                this.stepInfo[i].tsk_timecreated = moment(
                  response.data.data[i].tsk_timecreated
                ).format("MMMM Do YYYY, h:mm a");
              }

              if (this.stepInfo[i].pri_text === "High") {
                this.stepInfo[i].pri_badge = "badge-danger";
              } else if (this.stepInfo[i].pri_text === "Medium") {
                this.stepInfo[i].pri_badge = "badge-warning";
              } else if (this.stepInfo[i].pri_text === "Low") {
                this.stepInfo[i].pri_badge = "badge-info";
              }
            }
          }

          // this.stepInfo.tags = this.tas
          this.stepModal = true;
        })
        .then(response => {
          this.valueTag = [];
          if (this.stepInfo[0] !== undefined) {
            for (var i = 0; i < this.stepInfo[0].tags.length; i++) {
              // console.log(this.stepInfo[0].tags[i].tag_text)
              // console.log(this.options.name);
              const tag = {
                id: this.stepInfo[0].tags[i].id,
                text: this.stepInfo[0].tags[i].text
              };
              this.valueTag.push(tag);
            }
          }
        })
        .then(response => {
          this.valueUser = [];
          if (this.stepInfo[0] !== undefined) {
            for (var i = 0; i < this.stepInfo[0].usrworking.length; i++) {
              // console.log(this.stepInfo[0].tags[i].tag_text)
              // console.log(this.options.name);
              const user = {
                id: this.stepInfo[0].usrworking[i].usr_id,
                name: this.stepInfo[0].usrworking[i].usr_name,
                email: this.stepInfo[0].usrworking[i].usr_email
              };
              // console.log(this.stepInfo[0].usrworking[i]);
              this.valueUser.push(user);
            }
          }
        }).then(response => {
          axios.get("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid/inactiveusers", {
            params: {
              tasid: this.selectedItemID,
              stepid: stepID,
              sid: localStorage.sid
            }
          }).then(response => {
            // console.log('Inactive users');
            // console.log(resp.data.data);
            // this.stepInfo = response.data.data;
            this.stepInfo[0].usrinactive = response.data.data;
          })
        });

      // .then(response => {
      //   window.location.href = "#step";
      // });
    },

    getTaskInfo(taskID) {
      api.getTaskInfo(taskID).then(response => {
        if (response.data.data !== undefined) {
          this.taskInfo = response.data.data;

          for (var i = 0; i < response.data.data.length; i++) {
            // console.log(response.data.data[i].pri_text === 'MAX' ? true : false);

            if (this.taskInfo[i].tsk_deadline === null) {
              this.taskInfo[i].tsk_deadline = "";
            } else {
              this.taskInfo[i].tsk_deadline = moment(
                response.data.data[i].tsk_deadline
              ).format("MMMM Do YYYY, h:mm a");
            }

            if (this.taskInfo[i].pri_text === "High") {
              this.taskInfo[i].pri_badge = "badge-danger";
            } else if (this.taskInfo[i].pri_text === "Medium") {
              this.taskInfo[i].pri_badge = "badge-warning";
            } else if (this.taskInfo[i].pri_text === "Low") {
              this.taskInfo[i].pri_badge = "badge-info";
            }
          }

          // this.taskInfo.tsk_deadline = 'a'//moment(response.data.data.tsk_deadline ).format('MMMM Do YYYY, h:mm:ss a')
        }
      });
    }
  },

  computed: {

    // addingNewTask(){
    //   return store.state.itemAction.add;
    // },

    inProgressExists(){
      let exists = false;

      for (var i = 0; i < this.taskInfo.length; i++) {
        if(this.taskInfo[i].sta_text === "In Progress"){
          exists = true
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
          if (this.stepInfo[0].usrworking[i].isyou === 'true') {
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
      return moment(this.taskInfo.deadline, "YYYY-MM-DD HH:mm:ss.S").format(
        "DD/MM/YYYY (HH:mm)"
      ); //moment(this.taskInfo.deadline, "YYYY");
    },

    createdDate() {
      return moment(this.taskInfo.createdDate, "YYYY-MM-DD HH:mm:ss.S").format(
        "DD/MM/YYYY (HH:mm)"
      ); //moment(this.taskInfo.deadline, "YYYY");
    },

    ...mapState({
      addStep: state => state.itemAction.addStep,
      darkTheme: state => state.darkTheme
    })
  },

  mounted() {
    if (this.selectedItemID !== 0) {
      // this.getTaskInfo(this.selectedItemID);
      this.getGeneralInfo(this.selectedItemID);
      // this.getTaskInfo(this.selectedItemID);

    }

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
      if(val === false){
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
        this.getGeneralInfo(val);
        this.changeTab("generalInfo");

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
</style><style scoped>h1 {
  text-align: left;
}

.card-header.darkTheme.bg-warning,
.card-footer.darkTheme.bg-warning {
  color: initial;
}

.card-header.darkTheme,
.card-footer.darkTheme {
  background: var(--dark);
  color: var(--sec-color);
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


.back-button{
  flex-grow: 0.1 !important;
}

button.nav-item{
  margin: 5px;
}

.height100{
  height: 90vh; /*100%;*/
  /* margin-bottom: 20px; */

}

.chat-box{
  height: 100%;
  /* padding-bottom: 50px; */
}

td.align-top{
  width: 20%;
}

.stepInfoShow tr{
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.poslednjiRed{
  border-bottom: 0px !important;
}

nav .btn-warning.active{
  background-color: #ffe186 !important;
  border-color: #ffe186 !important;
}
</style>
