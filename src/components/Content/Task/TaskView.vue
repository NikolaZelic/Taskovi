<template>
  <div class="height100 mh-100" style="display: block" v-if="!addStep">

    <template v-if="selectedItemID <= 0">
      <h1>Select task first...</h1>
    </template>

    <template v-else>

      <div class='task-tabs'>
        <b-tabs v-model='currentMiniTab'>
          <b-tab title="Task Info" @click="changeTab('generalInfo'); tabParam = 'generalInfo'" active>
          </b-tab>
          <b-tab title="Steps" @click="changeTab('steps'); tabParam = 'steps'">
          </b-tab>
          <b-tab title="Messages" @click="changeTab('messages'); tabParam = 'messages'">
          </b-tab>
        </b-tabs>
      </div>

      <!-- TAB OverView -->
      <div class="card" :class='{darkTheme: darkTheme}' v-if="tabs.generalInfo">

        <div class="card-body">
          <table id="task-table">

            <tr>
              <td>Task Title:</td>
              <td>
                {{this.taskGeneralInfo.tsk_title}}
                <!-- <input class="form-control" type="text" :value="this.taskGeneralInfo.tsk_title"> -->
              </td>
            </tr>

            <tr>
              <td>Description:</td>
              <td>
                {{this.taskGeneralInfo.description}}
                <!-- <textarea class="form-control" type="text" :value="this.taskGeneralInfo.description"></textarea> -->
              </td>
            </tr>

            <!-- <tr><td>Description:</td><td>{{this.taskGeneralInfo.description}}</td></tr> -->
            <tr>
              <td>Created by:</td>
              <td>{{this.taskGeneralInfo.usr_creator_name}} {{this.taskGeneralInfo.usr_creator_surname}}</td>
            </tr>
            <tr>
              <td>Time created:</td>
              <td v-if='this.taskGeneralInfo.tsk_timecreated !== null'>{{$moment(this.taskGeneralInfo.tsk_timecreated).format('YYYY-MM-DD HH:mm')}}</td>
            </tr>
            <tr>
              <td>Deadline:</td>
              <td v-if='this.taskGeneralInfo.tsk_deadline !== null'>
                <span >{{$moment(this.taskGeneralInfo.tsk_deadline).format('YYYY-MM-DD HH:mm')}}</span>
              </td>
            </tr>

            <tr>
              <td>Status:</td>
              <td>{{this.taskGeneralInfo.sta_text}}</td>
            </tr>

            <tr>
              <td>Deadline:</td>
              <td v-if='this.taskGeneralInfo.tsk_deadline !== null'>
                <span >{{$moment(this.taskGeneralInfo.tsk_deadline).format('YYYY-MM-DD HH:mm')}}</span>
              </td>
            </tr>

            <tr>
              <td class="align-top">Working:</td>
              <td>
                <ul class="list-unstyled">
                  <li class="media mt-2" v-for="(user,index) in taskGeneralInfo.usrworking" :key='index'>

                    <img v-if='user.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png"
                    />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + user.usr_picture" />

                    <div class="media-body">
                      <div class="media-body">
                        <h5 class="mt-0 mb-1 inline-block">{{user.name}}
                          <small> -- {{user.usr_email}}</small>
                        </h5>
                        <!-- <span>Worked on this task for {{user.timespent}} minutes</span> -->
                      </div>
                    </div>

                  </li>


                </ul>
              </td>
            </tr>


          </table>

          <button type="button" class="btn btn-success save" @click="editTaskBtn()">
            <span class="fa fa-edit"></span> Edit</button>
        </div>

        <!-- <div class="card-body">
          <p>Project: {{this.taskGeneralInfo.pro_name}}</p>
          <p>Description: {{this.taskGeneralInfo.description}}</p>
          <p>Created by: {{this.taskGeneralInfo.usr_creator_name}} {{this.taskGeneralInfo.usr_creator_surname}}</p>
          <p>Time created: {{$moment(this.taskGeneralInfo.tsk_timecreated).format('YYYY-MM-DD HH:mm')}}</p>
          <p>Deadline: {{$moment(this.taskGeneralInfo.tsk_deadline).format('YYYY-MM-DD HH:mm')}}</p>
          <p>Status: {{this.taskGeneralInfo.sta_text}}</p>  </div> -->

      </div>

      <!-- TAB Steps -->
      <div class="card" :class='{darkTheme: darkTheme}' v-if="tabs.steps">
        <!-- <div class="card-header task-header" :class='{darkTheme: darkTheme}'>
          <h4 v-if="taskInfo[0] !== undefined">{{ taskInfo[0].taskname }}</h4>

        </div> -->

        <div class="card-body">
          <table class="table table-borderless table-hover">
            <thead>
              <tr>
                <th scope="col">Go to messages</th>
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
                <td @click.stop='jumpToFeed(task)' title="Go to messages for this step">
                  <i class="far fa-hand-point-right link-feed"></i>
                  <i class="far fa-envelope"></i>
                </td>

                <td :title="task.sta_text">
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

          <button type="button" class="btn btn-primary save" @click="itemAddStep" :disabled="inProgressExists">
            <span class="fa fa-plus"></span> New Step...</button>
        </div>

      </div>

      <!-- TAB Feeds -->
      <!-- <div class="card chat-box" :class='{darkTheme: darkTheme}' v-if="tabs.messages"> -->
      <feed-element ref='feed' :class='{darkTheme: darkTheme}' v-if="tabs.messages" />
      <!-- </div> -->


      <!-- STEP data -->

      <!-- Showing data about selected step -->
      <div class="card mt-5" :class='{darkTheme: darkTheme}' v-if="stepInfo.length > 0 &&  stepInfoShow">

        <div class="card-header" :class='{darkTheme: darkTheme}'>
          {{ stepInfo[0].tsk_title }}
        </div>

        <div class="card-body">
          <table class="stepInfoShow">

            <tr>
              <td class="align-top">Project:</td>
              <td>
                <h5>{{stepInfo[0].pro_name}}</h5>
              </td>
            </tr>

            <tr>
              <td class="align-top">Task:</td>
              <td>
                <h5>{{stepInfo[0].taskname}}</h5>
              </td>
            </tr>

            <tr v-if="stepInfo[0].description !== null">
              <td class="align-top">Description:</td>
              <td>
                <h5>{{stepInfo[0].description}}</h5>
              </td>
            </tr>

            <tr>
              <td class="align-top">Status:</td>
              <td>
                <h5>{{stepInfo[0].sta_text}}
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
              <td>
                <h5>{{stepInfo[0].tsk_deadline}}</h5>
              </td>
            </tr>

            <tr v-if="stepInfo[0].tsk_estimated_completion_date !== ''">
              <td class="align-top">Estimated completion date:</td>
              <td>
                <h5>{{stepInfo[0].tsk_estimated_completion_date}}</h5>
              </td>
            </tr>

            <tr>
              <td class="align-top">Created by:</td>
              <td>
                <ul class="list-unstyled">
                  <li class="media mt-2">

                    <img v-if='stepInfo[0].usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png"
                    />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + stepInfo[0].usr_picture"
                    />

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
              <td>
                <h5>{{stepInfo[0].tsk_timecreated}}</h5>
              </td>
            </tr>

            <tr v-if="stepInfo[0].tsk_timespent !== null">
              <td class="align-top">Total time spent:</td>
              <td>
                <h5>{{stepInfo[0].tsk_timespent}}</h5>
              </td>
            </tr>

            <tr class="poslednjiRed">
              <td class="align-top">Working:</td>
              <td>
                <ul class="list-unstyled">
                  <li class="media mt-2" v-for="(user,index) in stepInfo[0].usrworking" :key='index'>

                    <img v-if='user.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png"
                    />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + user.usr_picture" />

                    <div class="media-body">
                      <div class="media-body">
                        <h5 class="mt-0 mb-1 inline-block">{{user.usr_name}}
                          <small> -- {{user.usr_email}}</small>
                        </h5>
                        <span>Worked on this step for {{user.timespent}} minutes</span>
                      </div>
                    </div>

                  </li>

                  <li class="mt-3 mb-3 text-primary link" @click="showInactiveUsers; showInactive = !showInactive" v-if="!showInactive">Show inactive workers...</li>
                  <li class="mt-3 mb-3 text-primary link" @click="showInactive = !showInactive" v-if="showInactive">Hide inactive workers...</li>

                  <li class="media mt-2 text-muted" v-for="(inactive,index) in stepInfo[0].usrinactive" :key='index' v-if="showInactive">

                    <img v-if='inactive.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png"
                    />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + inactive.usr_picture"
                    />

                    <div class="media-body">
                      <div class="media-body">
                        <h5 class="mt-0 mb-1 inline-block">{{inactive.usr_name}}
                          <small> -- {{inactive.usr_email}}</small>
                        </h5>
                        <span>Worked on this step for {{inactive.timespent}} minutes</span>
                      </div>
                    </div>

                  </li>

                </ul>
              </td>
            </tr>

          </table>
          <div class="float-right">
            <button type="button" class="btn btn-primary" @click="stepEditToggle()" v-if="stepInfo[0].you_are_creator !== null || stepInfo[0].you_are_worker !== null"><span class='fa fa-edit'></span> Edit</button>
            <button type="button" class="btn btn-danger" @click="tabs.steps = true; stepInfoShow = false"><span class='fas fa-ban'></span> Cancel</button>
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

          <multiselect v-if="stepInfo[0].you_are_worker === 1 && stepInfo[0].you_are_creator !== 1" v-model="valueUser" id="working"
            placeholder="Search for users" label="name" track-by="id" :options="optionsUser" @remove="removeUser" :multiple="true">
            <span slot="noResult">There's no users with searched name in this project.</span>
          </multiselect>

          <multiselect v-if="stepInfo[0].you_are_creator === 1" v-model="valueUser" id="working" placeholder="Search for users" label="name"
            track-by="id" :options="optionsUser" :multiple="true">
            <span slot="noResult">There's no users with searched name in this project.</span>
          </multiselect>
          <div class="float-right">
            <button type="button" class="btn btn-success" @click="saveChanges(); stepInfoToggle();"><span class='fa fa-save'></span> Save</button>
            <button type="button" class="btn btn-danger" @click="stepInfoToggle()"><span class='fas fa-ban'></span> Cancel</button>
          </div>
        </div>

      </div>

      <!-- <step-edit /> -->

    </template>

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

import StepEdit from "@/components/Content/Task/StepEdit";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/material_blue.css");

export default {
  components: {
    flatPickr,
    Multiselect,
    FeedElement,
    StepEdit
  },

  data() {
    return {
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

    jumpToFeed(task) {
      var stp_time_created = task.tsk_timecreated;
      var tsk_id = this.selectedItemID;
      store.commit("setSearchFeedParams", {
        tsk_id: tsk_id,
        stp_time_created
      });
      this.changeTab("messages");
    },

    getGeneralInfo(taskID) {
      axios
        .get("http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid", {
          params: {
            tasid: taskID,
            sid: localStorage.sid
          }
        })
        .then(response => {
          this.taskGeneralInfo = response.data.data[0];
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

      axios
        .get(
          "http://695u121.mars-t.mars-hosting.com/mngapi/projects/:proid/tags",
          {
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

    // saveDescription() {
    //   console.log("saved desc edit");
    // },

    saveChanges() {
      axios
        .put(
          "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid",
          {
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
            usersarray: this.userStringArray
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
      this.changeTab(this.tabParam);
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
                this.stepInfo[i].tsk_deadline = this.$moment(
                  response.data.data[i].tsk_deadline
                ).format("MMMM Do YYYY, h:mm a");
              }

              if (this.stepInfo[i].tsk_estimated_completion_date === null) {
                this.stepInfo[i].tsk_estimated_completion_date = "";
              } else {
                this.stepInfo[i].tsk_estimated_completion_date = this.$moment(
                  response.data.data[i].tsk_estimated_completion_date
                ).format("MMMM Do YYYY, h:mm a");
              }

              if (this.stepInfo[i].tsk_timecreated === null) {
                this.stepInfo[i].tsk_timecreated = "";
              } else {
                this.stepInfo[i].tsk_timecreated = this.$moment(
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

          this.stepModal = true;
        })
        .then(response => {
          this.valueTag = [];
          if (this.stepInfo[0] !== undefined) {
            for (var i = 0; i < this.stepInfo[0].tags.length; i++) {
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
              const user = {
                id: this.stepInfo[0].usrworking[i].usr_id,
                name: this.stepInfo[0].usrworking[i].usr_name,
                email: this.stepInfo[0].usrworking[i].usr_email
              };
              this.valueUser.push(user);
            }
          }
        })
        .then(response => {
          axios
            .get(
              "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/steps/:stepid/inactiveusers",
              {
                params: {
                  tasid: this.selectedItemID,
                  stepid: stepID,
                  sid: localStorage.sid
                }
              }
            )
            .then(response => {
              this.stepInfo[0].usrinactive = response.data.data;
            });
        });
    },

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
  display: block;
  margin-left: auto;
}

.save .fa {
  margin-right: 10px;
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
