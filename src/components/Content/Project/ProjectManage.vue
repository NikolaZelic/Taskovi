<template>
  <div>
    <div class='pro-edit'>
      <div class='header' :class='{"back-warning":itemEditButton!==undefined}'>
        <h4 v-if='itemEditButton!==undefined'>Edit project:</h4>
        <h4 v-else>Adding project:</h4>
        <button class='btn btn-dark' @click='resetProjectView'>
          <span class='fas fa-arrow-left'></span> BACK</button>
      </div>

      <label for="name" class="mt-3">Project name</label>
      <input type="text" id="name" name="projectname" v-model="project.title" placeholder="Enter new project name" class="form-control mb-3">

      <label for="description">Description</label>
      <textarea id="description" rows="3" name="description" v-model='project.description' placeholder="Enter new project description..."
        class="form-control mb-3" spellcheck="false"></textarea>

      <label for="users">Users</label>
      <input type="text" id='users' v-model.lazy='usersString' placeholder="Enter email of people you want to add to the project"
        class="form-control mb-3">

      <label for="date">Deadline</label>
      <flat-pickr ref='datepicker' name="date" v-model="project.deadline" :config="config" id='flatPickrId' class="deadline form-control mb-3"
        placeholder="Pick a deadline (optional)">
      </flat-pickr>

      <div v-if='itemEditButton!==undefined' class='d-block'>
        <!-- <button @click="projectCancel" class="btn btn-danger">Cancel changes</button> -->
        <button @click="projectEdit" class="btn btn-warning btn-block">Save changes</button>
      </div>
      <button v-else @click="projectCreate" class="btn btn-success">Create project</button>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { instance as axios } from "@/api/config.js";
import { store } from "@/store/index.js";
import { mapGetters, mapState } from "vuex";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/confetti.css");
export default {
  components: {
    flatPickr
  },
  data() {
    return {
      // usersString: undefined,
      project: {
        title: undefined,
        description: undefined,
        users: undefined,
        deadline: undefined
      },
      config: {
        // wrap: true, // set wrap to true only when using 'input-group'
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i:S",
        altFormat: "j M, Y H:i",
        altInput: true
      }
    };
  },
  watch: {
    itemEditButton(val) {
      if (val === undefined) {
        this.project.deadline = Date.now();
      } else {
        this.projectInfo();
        this.getProjectUsers();
      }
    }
  },
  methods: {
    projectInfo() {
      for (var i = 0; i < this.currentTabData.length; i++) {
        var ctd = this.currentTabData[i];
        if (this.itemEditButton === ctd.id) {
          // PASS BY VALUE, NOT BY REF - DON'T CHANGE
          this.project.title = ctd.title;
          this.project.description = ctd.pro_description;
          this.project.deadline = ctd.pro_deadline;
        }
      }
    },
    getProjectUsers() {
      axios
        .get("projects/:proid/users", {
          params: {
            proid: store.getters.selectedItemID,
            sid: window.localStorage.sid
          }
        })
        .then(result => {
          if ((result.status = "OK")) {
            let users = result.data.data;
            if (users.length !== 0) {
              this.project.users = users;
            }
          }
        });
    },
    //     setProjectUsers(){
    // axios.put
    //     },
    projectCreate() {
      axios
        .post("projects", {
          name: this.project.title,
          description: this.project.description,
          deadline: this.project.deadline,
          sid: window.localStorage.sid
        })
        .then(r => {
          if (r.data.status === "OK") {
            store.commit("modalStatus", {
              active: true,
              ok: true,
              message:
                "Project '" +
                this.project.title +
                "' has been created succesfully"
            });
            store.dispatch("getProjects", {
              index: this.tabIndex
            });
          } else {
            store.commit("modalStatus", {
              active: true,
              ok: false,
              message: "Error: Couldn't create project '" + this.project.title
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    projectEdit() {
      axios
        .put("projects/:proid", {
          name: this.project.title,
          description: this.project.description,
          deadline: this.project.deadline,
          usersarray: this.project.users,
          proid: store.getters.selectedItemID,
          sid: window.localStorage.sid
        })
        .then(r => {
          if (r.data.status === "OK") {
            store.commit("modalStatus", {
              active: true,
              message:
                "Project '" +
                this.project.title +
                "' has been edited succesfully"
            });
            store.dispatch("getProjects", {
              index: this.tabIndex
            });
          } else {
            store.commit("modalStatus", {
              active: true,
              ok: false,
              message:
                "Error: Couldn't edit project '" + this.project.title + "'"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    projectCancel() {
      // this.project = this.backupProject;
    },
    resetProjectView() {
      store.commit("itemActionReset");
    }
  },
  computed: {
    ...mapGetters({
      currentTabData: "currentTabData"
    }),
    ...mapState({
      tabIndex: "currentTabIndex",
      itemEditButton: state => state.itemAction.edit
    }),
    usersString: {
      get() {
        let users = this.project.users;
        if (users !== undefined) {
          let tempUsers = [];
          console.log(users.length + " KORISNIKA");
          for (let i = 0; i < users.length; i++) {
            tempUsers.push(users[i].email);
          }
          return tempUsers.join();
        }
        return undefined;
      },
      set(val) {
        // console.log(val);
        let splitUsers = val.split(",");
        this.project.users = splitUsers;
      }
    }
  },
  mounted() {
    if (this.itemEditButton !== undefined) {
      this.projectInfo();
      this.getProjectUsers();
    }
  }
};
</script>

<style scoped>
.pro-edit {
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--success);
  border-radius: 4px;
  display: flex;
  padding: 10px 20px;
  justify-content: space-between;
  color: initial;
}

.header.back-warning {
  background: var(--warning);
}

.header * {
  margin: 0;
}

.btn-success {
  color: initial;
}
</style>
