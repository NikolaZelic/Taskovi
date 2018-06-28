<template>
<div>
  <template v-if="selectedItemID <= 0">
    <h1>Select task first...</h1>
  </template>
  <!-- Prikaz podataka pojedinacnog taska -->
  <template v-else>









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

              <tr v-for="(task, index) in taskInfo" @click='getStepInfo(task.tsk_id)'> <!--@click="getStepInfo(task.tsk_id)"-->
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
                    <span class="badge badge-success" v-for="tag in task.tags">{{ tag.tag_text }}</span>
                    <span class="badge badge-default pointer" @click='showAllTags= !showAllTags; showAllTagsID = index' v-if="task.tags.length > 3">Show less</span>
                  </div>

                  <div v-else>
                    <span class="badge badge-success" v-for="tag in task.tags.slice(0, 3)">{{ tag.tag_text }}</span>
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





      <div class="card mt-5 col-md-6 offset-md-3 pad-0" v-if="stepInfo.length > 0">
        <div class="card-header task-header">
          {{ stepInfo[0].tsk_title }}
        </div>
        <div class="card-body">
          <p><strong>Project: </strong>{{stepInfo[0].pro_name}}</p>
          <p><strong>Task: </strong>{{stepInfo[0].taskname}}</p>
          <p><strong>Status: </strong>{{stepInfo[0].sta_text}}</p> <!--dodati badge alert -->
          <p><strong>Description: </strong>{{stepInfo[0].description}}</p>
          <p><strong>Priority: </strong>{{stepInfo[0].pri_text}}</p> <!--dodati badge alert -->
          <p><strong>Deadline: </strong>{{stepInfo[0].tsk_deadline}}</p>
          <p><strong>Estimated completion date: </strong>{{stepInfo[0].tsk_estimated_completion_date}}</p>


          <p><strong>Created by: </strong>{{stepInfo[0].usr_creator_name}} {{stepInfo[0].usr_creator_surname}}</p>
          <p><strong>Time created: </strong>{{stepInfo[0].tsk_timecreated}}</p>
          <p><strong>Time spent: </strong>{{stepInfo[0].tsk_timespent}}</p>
          <p><strong>Working: </strong>
            <ul>
              <li v-for="user in stepInfo[0].usrworking">
                {{user.usr_name}} -- {{user.usr_email}}
                <img :src=" 'data:image/jpeg;base64,' + user.usr_picture" />
              </li>
            </ul>
          </p>


        </div>
      </div>


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
          }
        });
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
      if(this.selectedItemID === 0){
        this.stepShow = false;
        return;
      }else {
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

.badge {
  margin: 0.125rem;
}

.pointer {
  cursor: pointer;
}

.pad-0{
  padding: 0;
}
</style>
