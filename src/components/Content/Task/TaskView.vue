<template>
<div>
  <template v-if="selectedItemID <= 0">
    <h1>Select task first...</h1>
  </template>
  <!-- Prikaz podataka pojedinacnog taska -->
  <template v-else>


<!--
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
      Launch demo modal
    </button>
-->
<!-- Modal
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
-->





      <div class="card">
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


              <tr v-for="(task, index) in taskInfo" :key='index' @click='getStepInfo(task.tsk_id)' data-toggle="modal" data-target="#stepInformation">
                <td>
                  <i class="fas fa-check-circle text-success" v-if="task.sta_text === 'Completed'"></i>
                  <i class="fas fa-spinner text-info" v-if="task.sta_text === 'In Progress' || task.sta_text === 'Assigned'"></i>
                  <i class="fas fa-exclamation-triangle text-danger" v-if="task.sta_text === 'Failed' || task.sta_text === 'Rejected' || task.sta_text === 'Cancelled'"></i>
                </td>

                <td>{{ task.tsk_title}}</td>
                <td>
                  {{ task.tsk_deadline }}
                </td>


                <td>

                  <div v-if='showAllTags && showAllTagsID === index'>
                    <span class="badge badge-success" v-for="(tag,index) in task.tags" :key='index'>{{ tag.tag_text }}</span>
                    <span class="badge badge-default pointer" @click='showAllTags= !showAllTags; showAllTagsID = index' v-if="task.tags.length > 3">Show less</span>
                  </div>

                  <div v-else>
                    <span class="badge badge-success" v-for="(tag,index) in task.tags.slice(0, 3)" :key='index'>{{ tag.tag_text }}</span>
                    <span v-if="task.tags.length > 3">+ {{task.tags.length - 3}}</span>
                    <span class="badge badge-default pointer" @click='showAllTags= !showAllTags; showAllTagsID = index' v-if="task.tags.length > 3">Show all</span>
                  </div>

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
      </div>




      <div class="modal fade" id="stepInformation" tabindex="-1" role="dialog" v-if="stepInfo.length > 0">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header step-header" :class="stepInfo[0].background">
              <h5 class="modal-title" id="exampleModalLabel">{{ stepInfo[0].tsk_title }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" class="step-header">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p><strong>Project: </strong>{{stepInfo[0].pro_name}}</p>
              <p><strong>Task: </strong>{{stepInfo[0].taskname}}</p>

              <p><strong>Status: </strong>
                {{stepInfo[0].sta_text}}
                <i class="fas fa-check-circle text-success" v-if="stepInfo[0].sta_text === 'Completed'"></i>
                <i class="fas fa-spinner text-info" v-if="stepInfo[0].sta_text === 'In Progress' || stepInfo[0].sta_text === 'Assigned'"></i>
                <i class="fas fa-exclamation-triangle text-danger" v-if="stepInfo[0].sta_text === 'Failed' || stepInfo[0].sta_text === 'Rejected' || stepInfo[0].sta_text === 'Cancelled'"></i>
              </p>

              <p><strong>Description: </strong>{{stepInfo[0].description}}</p>
              <p><strong>Priority: </strong><span class="badge" :class="stepInfo[0].pri_badge">{{stepInfo[0].pri_text}}</span></p>



              <div>
                <p><strong>Tags: </strong>
                <span class="badge badge-success" v-for="tag in stepInfo[0].tags">{{ tag.tag_text }}</span>
              </p>
              </div>


              <p><strong>Deadline: </strong>{{stepInfo[0].tsk_deadline}}</p>
              <p><strong>Estimated completion date: </strong>{{stepInfo[0].tsk_estimated_completion_date}}</p>

    <p><strong>Created by: </strong>
      <ul class="list-unstyled">
        <li class="media mt-2">

          <img v-if='stepInfo[0].usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
          <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + stepInfo[0].usr_picture" />

          <div class="media-body">
            <div class="media-body">
                  <h5 class="mt-0 mb-1">{{stepInfo[0].usr_creator_name}} {{stepInfo[0].usr_creator_surname}}</h5>
                    {{stepInfo[0].usr_email}}
              </div>
              </div>

        </li>
      </ul>
    </p>
              <p><strong>Time created: </strong>{{stepInfo[0].tsk_timecreated}}</p>
              <p><strong>Time spent: </strong>{{stepInfo[0].tsk_timespent}}</p>
              <p><strong>Working: </strong>
                <ul class="list-unstyled">
                  <li class="media mt-2" v-for="(user,index) in stepInfo[0].usrworking" :key='index'>

                    <img v-if='user.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
                    <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + user.usr_picture" />

                    <div class="media-body">
                      <div class="media-body">
                            <h5 class="mt-0 mb-1">{{user.usr_name}}</h5>
                              {{user.usr_email}}
                        </div>
                        </div>

                  </li>
                </ul>
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

<!--
      <div class="card mt-5 col-md-6 offset-md-3 pad-0 mb-5" v-if="stepInfo.length > 0" id="step">
        <div class="card-header step-header " :class="stepInfo[0].background">
          {{ stepInfo[0].tsk_title }}
        </div>
        <div class="card-body">
          <p><strong>Project: </strong>{{stepInfo[0].pro_name}}</p>
          <p><strong>Task: </strong>{{stepInfo[0].taskname}}</p>

          <p><strong>Status: </strong>
            {{stepInfo[0].sta_text}}
            <i class="fas fa-check-circle text-success" v-if="stepInfo[0].sta_text === 'Completed'"></i>
            <i class="fas fa-spinner text-info" v-if="stepInfo[0].sta_text === 'In Progress' || stepInfo[0].sta_text === 'Assigned'"></i>
            <i class="fas fa-exclamation-triangle text-danger" v-if="stepInfo[0].sta_text === 'Failed' || stepInfo[0].sta_text === 'Rejected' || stepInfo[0].sta_text === 'Cancelled'"></i>
          </p>

          <p><strong>Description: </strong>{{stepInfo[0].description}}</p>
          <p><strong>Priority: </strong><span class="badge" :class="stepInfo[0].pri_badge">{{stepInfo[0].pri_text}}</span></p>
          <p><strong>Deadline: </strong>{{stepInfo[0].tsk_deadline}}</p>
          <p><strong>Estimated completion date: </strong>{{stepInfo[0].tsk_estimated_completion_date}}</p>

<p><strong>Created by: </strong>
  <ul class="list-unstyled">
    <li class="media mt-2">

      <img v-if='stepInfo[0].usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
      <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + stepInfo[0].usr_picture" />

      <div class="media-body">
        <div class="media-body">
              <h5 class="mt-0 mb-1">{{stepInfo[0].usr_creator_name}} {{stepInfo[0].usr_creator_surname}}</h5>
                {{stepInfo[0].usr_email}}
          </div>
          </div>

    </li>
  </ul>
</p>
          <p><strong>Time created: </strong>{{stepInfo[0].tsk_timecreated}}</p>
          <p><strong>Time spent: </strong>{{stepInfo[0].tsk_timespent}}</p>
          <p><strong>Working: </strong>
            <ul class="list-unstyled">
              <li class="media mt-2" v-for="(user,index) in stepInfo[0].usrworking" :key='index'>

                <img v-if='user.usr_picture === null' class="rounded-circle mr-3" height="50px" width="50px" src="@/assets/img/avatar.png" />
                <img v-else class="rounded-circle mr-3" height="50px" width="50px" :src="'data:image/jpeg;base64,' + user.usr_picture" />

                <div class="media-body">
                  <div class="media-body">
                        <h5 class="mt-0 mb-1">{{user.usr_name}}</h5>
                          {{user.usr_email}}
                    </div>
                    </div>

              </li>
            </ul>
          </p>


        </div>
      </div>
-->

      <!-- description:null
      pri_text:"Low"
      pro_id:146
      pro_name:"Autobuski prevoz"
      sta_text:"Assigned"
      taskname:"Treba zameniti sijalicu"
      tsk_deadline:"2018-06-26 11:48:03.0"
      tsk_estimated_completion_date:null
      tsk_id:64
      tsk_timecreated:null
      tsk_timespent:null
      tsk_title:"Dostava"
      usr_creator_name:"Dime"
      usr_creator_surname:"Dimic"
      usr_id_creator:64
      usrworking:Array[2] -->



    </template>
</div>


</template>


<script>
import {
  store
} from "@/store/index.js";
import axios from "axios";

import {
  mapGetters
} from "vuex";

// var now = moment();

export default {


  data() {
    return {
      taskInfo: [],
      showAllTags: false,
      showAllTagsID: undefined,
      stepInfo: [],
      stepShow: false
    };
  },

  methods: {


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
  } else if(this.stepInfo[i].sta_text === 'Failed' || this.stepInfo[i].sta_text === 'Rejected' || this.stepInfo[i].sta_text === 'Cancelled' ){
      this.stepInfo[i].background = 'bg-danger'
    }
    else{
      this.stepInfo[i].background = 'bg-success'
    }
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


    selectedItemID() {
      var a = store.getters.selectedItemID;
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


  },

  watch: {
    'selectedItemID': function(val, oldVal) {
      if (val !== 0) {
        this.getTaskInfo(val);
        this.getStepInfo(val)
      }
      // this.getCompanyInfo(val);
      // this.loadAdmins(val);
      // this.loadEmployees(val);
    }


  }
};
</script>


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
<<<<<<< HEAD

.slika {
  border: 1px solid #333;
}

</style>
h
=======
</style>
>>>>>>> a85279198141c8f4cc4e86f094727a43c3e36e52
