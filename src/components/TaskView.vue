<template>
<div>

  <!-- Prikaz podataka pojedinacnog taska -->
  <!-- <div class="row task-view-section"> -->

    <!-- Kolona na sredini Bootstrap sirine md-4 -->
    <!-- <div class="col-md-8 offset-md-2 pad"> -->
      <div class="card">

        <!-- Prikaz imena parent taska -->
        <ul class="list-group list-group-flush lead"><li class="list-group-item">{{task["parenttask-tittle"]}}</li></ul>

        <!-- Prikaz imena datog taska -->
        <div class="card-header"><h1 class="display-4">{{task["task-tittle"]}}</h1></div>

        <!-- Prikaz podataka o datom tasku -->
        <ul class="list-group list-group-flush lead">

          <!-- Opis taska i eventualna URGENT labela u slucaju da postoji -->
          <li class="list-group-item"><span class="badge badge-danger">Urgent</span> {{task["task-description"]}}</li>

          <!-- Prikaz vremena kreiranja taksa i informacija o USER-u koji ga je napravio -->
          <li class="list-group-item"><strong>Created: </strong> {{task["time-created"]}} by {{task["user-created"]}}</li>

          <!-- Prikaz informacije kome je dati task dodeljen -->
          <li class="list-group-item"><strong>Assgned to: </strong>{{task["user-working"]}} {{task["group-working"]}}</li>

          <!-- Rok za zavrsavanje datog taska -->
          <li class="list-group-item"><strong>Deadline: </strong>{{task["task-deadline"]}}</li>

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
    </div>

  <!-- </div> -->
<!-- </div> -->
</template>

<script>
import { store } from "@/store/store.js";

export default {

  data() {
    return {

    };

  },

  computed: {
    task: function() {
      // console.log('Computed '+store.getters.getSelectedTask);
      return store.getters.getSelectedTask;
    },
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task-view-section {
  padding-top: 50px;
}
</style>
