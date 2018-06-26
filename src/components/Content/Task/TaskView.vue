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

              <tr v-for="(task, index) in taskInfo">
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
