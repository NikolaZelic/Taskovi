<template>
  <div>
  <template v-if="selectedItemID <= 0">
    <h1>Select task first...</h1>
  </template>
  <!-- Prikaz podataka pojedinacnog taska -->
    <template v-else>



      <div class="card">

        <!-- Prikaz imena parent taska -->
        <ul class="list-group list-group-flush lead"><li class="list-group-item">{{taskInfo["parenttask-tittle"]}}</li></ul>

        <!-- Prikaz imena datog taska -->
        <div class="card-header"><h1 class="display-4">{{taskInfo["task-tittle"]}}</h1></div>

        <!-- Prikaz podataka o datom tasku -->
        <ul class="list-group list-group-flush lead">

          <!-- Opis taska i eventualna URGENT labela u slucaju da postoji -->
          <li class="list-group-item">

            <span class="badge badge-warning" v-if="taskInfo.priority !== null">{{ taskInfo.priority }}</span>

            {{taskInfo["task-description"]}}</li>

          <!-- Prikaz vremena kreiranja taksa i informacija o USER-u koji ga je napravio -->
          <li class="list-group-item"><strong>Created: </strong> {{ createdDate }} by {{taskInfo["user-created"]}}</li>

          <!-- Prikaz informacije kome je dati task dodeljen -->
          <li class="list-group-item"><strong>Assigned to: </strong>{{taskInfo["user-working"]}} {{taskInfo["group-working"]}}</li>

          <!-- Rok za zavrsavanje datog taska -->
          <li class="list-group-item"><strong>Deadline: </strong>{{ deadlineDate }}</li>

          <!-- Red sa akcijama za task -->
          <li class="list-group-item text-center">
            <div class="row">

              <div class="col-md-6 text-left">
                <a href="#" class="btn btn-info">Edit</a>
                <a href="#" class="btn btn-danger">Remove</a>
                <a href="#" class="btn btn-warning">Reject</a>
              </div>

              <div class="col-md-6 input-group">
                <input type="number" class="form-control text-center" placeholder="Time spent [minutes]" required>
                <div class="input-group-append"><button class="btn btn-success" type="button">Submit</button></div>
              </div>

            </div>
          </li>

        </ul>

      </div>
    </template></div>
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
    getTaskInfo(taskID) {
      axios.get("http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid", {
          params: {
            tasid: taskID,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          if (response.data.data !== undefined)
            this.taskInfo = response.data.data[0];
            // console.log(response.data.data[0]);
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
</style>
