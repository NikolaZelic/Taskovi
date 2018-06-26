<template>
<div>
  <template v-if="selectedItemID <= 0">
    <h1>Select task first...</h1>
  </template>
  <!-- Prikaz podataka pojedinacnog taska -->
  <template v-else>


      <div class="card">
        <div class="card-header task-header">
          {{ taskInfo[0].taskname }}
        </div>
        <div class="card-body">
          <table class="table table-borderless text-center text-dark table-hover">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Deadline</th>
                <th scope="col">Tags</th>
                <th scope="col">Priority</th>
                <th scope="col">Working</th>
              </tr>
            </thead>
            <tbody>

              <tr v-for="(task, index) in taskInfo"> <!--@click="getStepInfo(task.tsk_id)"-->
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


<!-- modal start -->
<!-- <div class="modal fade text-dark" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">

    <div class="modal-content">

      <div class="modal-body tab-content">
        <div id="info" class="tab-pane fade show active" role="tabpanel">


          <p><strong>Title: </strong>Nabavljanje sijalice za ucionicu 23</p>

          <p><strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p><strong>Deadline:</strong> 25/08/2018 16:45</p>
          <p><strong>Tags:</strong>
            <span class="badge badge-success">Front</span>
            <span class="badge badge-success">MARS</span>
            <span class="badge badge-success">Header</span>
            <span class="badge badge-success">MARS</span>
            <span class="badge badge-success">Header</span>
          </p>
          <p><strong>Priority:</strong> <span class="badge badge-danger">High</span></p>
          <p><strong>Working:</strong>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdV43WHdqn0ahVKE3Xna3LUtEi31preFUEqiQFhKw4E27X7JAHnA" class="rounded-circle" width="30px">

            <img src="http://www.programmerfish.com//wp-content/uploads/2009/08/image44.png" class="rounded-circle" width="30px">
            <img src="http://irdom.ru/wp-content/uploads/2017/06/user_avatar_mykehurley_artwork.jpg" class="rounded-circle" width="30px"> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdV43WHdqn0ahVKE3Xna3LUtEi31preFUEqiQFhKw4E27X7JAHnA"
              class="rounded-circle" width="30px">

            <img src="http://www.programmerfish.com//wp-content/uploads/2009/08/image44.png" class="rounded-circle" width="30px">
            <img src="http://irdom.ru/wp-content/uploads/2017/06/user_avatar_mykehurley_artwork.jpg" class="rounded-circle" width="30px">
          </p>
          <p><strong>Status:</strong> In progress</p>



        </div>







      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div> -->
<!-- modal end -->









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
      showAllTagsID: undefined
    };
  },

  methods: {
    // getStepInfo(stepID){
    //   console.log(stepID);
    // },

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
</style>
