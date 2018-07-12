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

      <label for="users">
        <span class='badge badge-warning'>{{project.users_count}}</span> Users
      </label>

      <b-btn v-b-modal.modal1 variant="primary">View and change users</b-btn>

      <b-modal id="modal1" title="Add or remove users from project" header-bg-variant="dark" header-text-variant="light" body-bg-variant="dark"
        body-text-variant="light" footer-bg-variant="dark" footer-text-variant="light" @shown="focusMyElement">

        <b-input-group>
          <b-form-input v-model="email" ref="focusThis" placeholder="Type email" />
          <b-input-group-append>
            <b-btn :disabled="isValidEmail" @click="submitEmail">Submit</b-btn>
          </b-input-group-append>
        </b-input-group>

        <b-table :dark=true :items='project.users' :field='usersField' responsive>

          <template slot="admin" slot-scope="row">
            <!-- In some circumstances you may need to use @click.native.stop instead -->
            <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
            <b-form-checkbox @click.native.stop @change="changeAdmin(row.index)" :checked="project.users[row.index].admin"></b-form-checkbox>
          </template>

          <template slot="delete" slot-scope="row">
            <!-- In some circumstances you may need to use @click.native.stop instead -->
            <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
            <b-form-checkbox @click.native.stop @change="changeDeleted(row.index)"></b-form-checkbox>
          </template>

        </b-table>
      </b-modal>

      <div class='usersModal'>

      </div>
      <!-- <multiselect id='users' v-model='project.users' :options="options" :preserveSearch="true" :multiple="true" :taggable="true"
        track-by='email' @tag="addTag" :close-on-select="false" :clear-on-select="false" :hide-selected="true" class="" :custom-label='CustomPersonLabel'
        placeholder="Enter email of people"></multiselect> -->

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
import Multiselect from "vue-multiselect";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/confetti.css");
export default {
  components: {
    flatPickr,
    Multiselect
  },
  data() {
    return {
      // nesto: false,
      deleteUserID: undefined,

      project: {
        title: undefined,
        description: undefined,
        users_count: undefined,
        deadline: undefined,
        users: []
      },
      config: {
        // wrap: true, // set wrap to true only when using 'input-group'
        enableTime: true,
        time_24hr: true,
        dateFormat: "Y-m-d H:i:S",
        altFormat: "j M, Y H:i",
        altInput: true
      },
      usersField: ["email", "name", "surname", "admin"],
      email: undefined,
      isAdmin: false
      // options: []
    };
  },
  watch: {
    itemEditButton(val) {
      if (val === undefined) {
        this.project.deadline = Date.now();
      } else {
        this.getProjectInfo();
      }
    }
  },
  methods: {
    // clickedRow(item, index, event){
    //   // console.log('index ' + item);
    //   // return item;
    //   // console.log('item ' + item.id);
    //   // console.log('index' + index);
    //   // console.log('event' + event);
    //   // this.deleteUserID = item.id;
    //   // return item.id;
    //   // console.log(this.deleteUserID);
    //   console.log('clicked row funkcija')
    // },

    changeDeleted(rowIndex) {
      this.project.users[rowIndex].delete = !this.project.users[rowIndex]
        .delete;
      // this.usersWorking;
    },

    changeAdmin(rowIndex) {
      this.project.users[rowIndex].admin = !this.project.users[rowIndex].admin;
      // this.usersWorking;
    },

    submitEmail() {
      let user = {
        email: this.email,
        admin: false
      };

      this.project.users.push(user);
    },
    setupInfo() {
      for (var i = 0; i < this.currentTabData.length; i++) {
        var ctd = this.currentTabData[i];
        if (this.itemEditButton === ctd.id) {
          // PASS BY VALUE, NOT BY REF - DON'T CHANGE
          this.project.title = ctd.title;
          this.project.deadline = ctd.pro_deadline;
          this.project.users_count = ctd.users_count;
        }
      }
    },
    getProjectInfo() {
      axios
        .get("projects/:proid", {
          params: {
            proid: store.getters.selectedItemID,
            sid: window.localStorage.sid
          }
        })
        .then(result => {
          if (result.data.status === "OK") {
            console.log("asdd");
            let moreInfo = result.data.data;

            for (var i = 0; i < moreInfo.users.length; i++) {
              moreInfo.users[i].delete = false;
              moreInfo.users[i].admin = moreInfo.users[i].admin === "true";
            }

            if (moreInfo.length !== 0) {
              this.project = moreInfo;
            }
            this.setupInfo();
          } else {
            store.commit("modalStatus", {
              ok: false,
              message: "Error: Couldn't get project info"
            });
          }
        });
    },
    projectCreate() {
      axios
        .post("projects", {
          name: this.project.title,
          description: this.project.description,
          deadline: this.project.deadline,
          usersarray: this.usersString,
          sid: window.localStorage.sid
        })
        .then(r => {
          if (r.data.status === "OK") {
            store.commit("modalStatus", {
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
          usersarray: this.usersWorking,
          proid: store.getters.selectedItemID,
          sid: window.localStorage.sid
        })
        .then(r => {
          if (r.data.status === "OK") {
            store.commit("modalStatus", {
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
    },
    CustomPersonLabel(option) {
      return `${option.email}`;
    },
    addTag(newTag) {
      const tag = {
        email: newTag
      };
      this.options.push(tag);
      this.project.users.push(tag);
      // this.usersString.push(tag);
    },
    focusMyElement(e) {
      this.$refs.focusThis.focus();
    }
  },
  computed: {
    usersWorking() {
      let nizUsera = [];

      if (this.project.users !== undefined) {
        for (var i = 0; i < this.project.users.length; i++) {
          if (this.project.users[i].delete === false) {
            let singleUser = {
              email: this.project.users[i].email,
              admin: "" + this.project.users[i].admin + ""
            };
            nizUsera.push(singleUser);
          }
        }

        if (this.email !== undefined) {
          let singleUser = {
            email: this.email,
            admin: "false"
          };
          nizUsera.push(singleUser);
        }
      }

      return JSON.stringify(nizUsera);
    },
    isValidEmail() {
      let email = this.email;
      if (email === undefined || email === "") return true;
      let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let check = email.match(pattern);
      return !check;
    },
    usersString: {
      get() {
        let users = this.project.users;
        if (users !== undefined) {
          let tempUsers = [];
          console.log(users.length + " KORISNIKA");
          for (let i = 0; i < users.length; i++) {
            // console.log('Nesto' + users[i].surname);
            // console.log("EMAIL KORISNIKA: "+ users[i].email);
            tempUsers.push({
              email: users[i].email,
              admin: "false"
            });
          }
          return JSON.stringify(tempUsers);
        }
        return undefined;
      },
      set(val) {
        // console.log(val);
        // let splitUsers = val.split(",");
        // this.project.users = splitUsers;
      }
    },
    ...mapGetters({
      currentTabData: "currentTabData"
    }),
    ...mapState({
      tabIndex: "currentTabIndex",
      itemEditButton: state => state.itemAction.edit
    })
  },
  mounted() {
    if (this.itemEditButton !== undefined) {
      this.getProjectInfo();
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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

#users {
  width: 100% !important;
}

.input-group {
  margin-bottom: 20px;
}

.btn-success {
  color: initial;
}
</style>
