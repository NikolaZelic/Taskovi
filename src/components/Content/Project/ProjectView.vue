<template>
<div>

  <!-- U slucaju da nije selektovana niti jedna konkretna kompanija prikazuje se ovo jer se ne salje axios zahtev -->
  <template v-if="selectedProjectID <= 0">
      <h1>Select project first...</h1>
    </template>

  <!-- Ako je konretna kompanija selektovana onda se prikazuje ovo -->
  <template v-else>

    <!-- Osnovni podaci o kompaniji   -->
    <h1>{{projectInfo.title}}</h1>
    <span>{{projectInfo.description}}</span >

      <div class="row mt-5">
        <div class="col-md-6">
          <ul class="list-group list-group-flush">

            <!-- Lista admina -->
            <li class="list-group-item" v-for="ptask in parentTasks" @click="tasks(ptask.par_id); subTaskShow = !subTaskShow">
              <h4>{{ ptask.par_title }}</h4>
              <p>{{ ptask.par_description }}</p>
              <span class="badge badge-secondary">Deadline: {{ ptask.par_duedate }}</span>
            </li>

          </ul>
        </div>
        <div class="col-md-6">

          <span v-if='!subTaskShow'>Select certain task to see everything that came after...</span>
          <div v-else>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="task in tasksList">
                    <h4>{{ task.title }}</h4>
                    <p>{{ task.description }}</p>
                    <span class="badge badge-secondary">Deadline: {{ task.duedate }}</span>
                  </li>
                </ul>
          </div>

        </div>
      </div>







      <!-- <ul class="list-group list-group-flush mt-5">

        <li class="list-group-item" v-for="ptask in parentTasks" @click="tasks(ptask.par_id)">
          <h4>{{ ptask.par_title }}</h4>
          <p>{{ ptask.par_description }}</p>
          <span class="badge badge-secondary">Deadline: {{ ptask.par_duedate }}</span>
        </li>

      </ul> -->


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

export default {
  data() {
    return {
      projectInfo: [],
      parentTasks: [],
      ptask: 0,
      tasksList: [],
      subTaskShow: false
    };
  },

  methods: {
    getProjectInfo(proID) {
      axios
        .get("http://671n121.mars-t.mars-hosting.com/mngapi/project/:proid", {
          params: {
            proid: proID,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          this.projectInfo = response.data.data[0];
          // console.log(response.data.data);
        });
    },

    getParentTasks(proID) {
      axios
        .get(
          "http://671n121.mars-t.mars-hosting.com/mngapi/project/:proid/parenttasks", {
            params: {
              proid: proID,
              sid: window.localStorage.getItem("sid")
            }
          }
        )
        .then(response => {
          this.parentTasks = response.data.data;
          // console.log(response.data.data);
        });
    },



    tasks(ptaskID) {
      // console.log(ptaskID);

      axios.get("http://671n121.mars-t.mars-hosting.com/mngapi/parenttask/:ptasid/tasks", {
          params: {
            parid: ptaskID,
            sid: window.localStorage.getItem("sid")
          }
        })
        .then(response => {
          this.tasksList = response.data.data;
          // console.log(response.data.data);
        });
    }

    // loadAdmins(compID) {
    //   axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/admins', {
    //     params: {
    //       comid: compID,
    //       sid: window.localStorage.getItem('sid')
    //     }
    //   }).then(response => {
    //     this.admins = response.data.data;
    //   })
    // },
    //
    // loadEmployees(compID) {
    //   axios.get('http://671n121.mars-t.mars-hosting.com/mngapi/companies/:comid/users', {
    //     params: {
    //       comid: compID,
    //       sid: window.localStorage.getItem('sid')
    //     }
    //   }).then(response => {
    //     this.employees = response.data.data;
    //   })
    // }
  },

  computed: {
    selectedProjectID() {
      var a = store.getters.selectedItemID;
      if (a === undefined) return 0;
      else return a;
    }
  },

  // mounted(){
  //   this.tasks(1);
  // },

  watch: {
    selectedProjectID: function(val, oldVal) {
      this.getProjectInfo(val);
      this.getParentTasks(val);
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
</style>
