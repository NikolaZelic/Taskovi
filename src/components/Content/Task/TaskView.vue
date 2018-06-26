<template>
  <div>
  <template v-if="selectedItemID <= 0">
    <h1>Select task first...</h1>
  </template>
  <!-- Prikaz podataka pojedinacnog taska -->
    <template v-else>

      <div class="card">
        <div class="card-header task-header">
          {{ $store.getters.currentTabData }}
        </div>
        <div class="card-body">
          <table class="table table-borderless text-center text-dark table-hover">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <!-- <th scope="col">Description</th> -->
                <th scope="col">Deadline</th>
                <th scope="col">Tags</th>
                <th scope="col">Priority</th>
                <th scope="col">Working</th>
              </tr>
            </thead>
            <tbody>
              <!-- ovedddd -->
              <tr data-toggle="modal" data-target="#exampleModal">
                <td>Kupovina monitora</td>
                <!-- <td>Otto</td> -->
                <td>
                  25/08/2018 16:30
                </td>
                <td>
                  <!-- <span class="badge badge-success">Front</span> -->
                  <span class="badge badge-success">MARS</span>
                  <span class="badge badge-success">Header</span>
                </td>
                <td>
                  <span class="badge badge-danger">High</span>
                </td>
                <td>
                  <img src="http://www.programmerfish.com//wp-content/uploads/2009/08/image44.png" class="rounded-circle" width="30px">
                  <img src="http://irdom.ru/wp-content/uploads/2017/06/user_avatar_mykehurley_artwork.jpg" class="rounded-circle" width="30px">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdV43WHdqn0ahVKE3Xna3LUtEi31preFUEqiQFhKw4E27X7JAHnA" class="rounded-circle" width="30px"> +3
                </td>
              </tr>
              <tr data-toggle="modal" data-target="#exampleModal">
                <td>Kupovina sijalice</td>
                <!-- <td>Thornton</td> -->
                <td> 09/03/2018 16:30
                </td>
                <td>
                  <span class="badge badge-success">Back</span>
                  <span class="badge badge-success">MARS</span>
                  <span class="badge badge-success">API</span> +4
                </td>
                <td>
                  <span class="badge badge-warning">Medium</span>
                </td>
                <td>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdV43WHdqn0ahVKE3Xna3LUtEi31preFUEqiQFhKw4E27X7JAHnA" class="rounded-circle" width="30px">

                  <img src="http://www.programmerfish.com//wp-content/uploads/2009/08/image44.png" class="rounded-circle" width="30px">
                  <img src="http://irdom.ru/wp-content/uploads/2017/06/user_avatar_mykehurley_artwork.jpg" class="rounded-circle" width="30px"> +11
                </td>
              </tr>
              <tr data-toggle="modal" data-target="#exampleModal">
                <td>Neki naslov</td>
                <!-- <td>the Bird</td> -->
                <td> 11/03/2018 19:30
                </td>
                <td><span class="badge badge-success">MARS</span>
                  <!-- <span class="badge badge-success">Header</span></td> -->
                  <td>
                    <span class="badge badge-info">Low</span>
                  </td>
                  <td>
                    <img src="http://www.programmerfish.com//wp-content/uploads/2009/08/image44.png" class="rounded-circle" width="30px">
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
import { store } from "@/store/index.js";
import axios from "axios";

import { mapGetters } from "vuex";

// var now = moment();

export default {
  data() {
    return {
      taskInfo: []
    };
  },

  methods: {
    getTaskInfo() {
      axios.get("http://682b121.mars1.mars-hosting.com/mngapi/tasks/:tasid/steps", {
          params: {
            tasid: 61,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          if (response.data.data !== undefined)
            this.taskInfo = response.data.data;
            console.log(response.data.data);
        });
    }
  },

  computed: {

    selectedItemID() {
      var a = store.getters.selectedItemID;
      if (a === undefined) return 0;
      else return a;
    },

    deadlineDate(){
      return moment(this.taskInfo.deadline, 'YYYY-MM-DD HH:mm:ss.S').format('DD/MM/YYYY (HH:mm)'); //moment(this.taskInfo.deadline, "YYYY");
    },

    createdDate(){
      return moment(this.taskInfo.createdDate, 'YYYY-MM-DD HH:mm:ss.S').format('DD/MM/YYYY (HH:mm)'); //moment(this.taskInfo.deadline, "YYYY");
    }

  },

  mounted(){
      if(this.selectedItemID !== 0){
        this.getTaskInfo(this.selectedItemID);
      }


  },

  watch: {
    'selectedItemID': function(val, oldVal) {
      if(val!==0){
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
h1{
  text-align: left;
}

.task-header{
  color: #333 !important;
}
</style>
