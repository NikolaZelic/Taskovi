<template>
  <!-- <div> -->
    <div class='pro-edit'>
      <div class='header' :class='{"back-primary":itemEditButton!==undefined}'>
        <button class='btn btn-dark' @click='confirmation()'>
          <span class='fas fa-arrow-left'></span> BACK</button>
        <h4 v-if='itemEditButton!==undefined'>Edit project:</h4>
        <h4 v-else>Adding project:</h4>
      </div>

      <label for="name" class="mt-3">Project name</label>
      <input type="text" id="name" name="projectname" v-model="project.title" placeholder="Enter new project name" class="form-control mb-3">

      <label for="description">Description</label>
      <textarea id="description" rows="3" name="description" v-model='project.description' placeholder="Enter new project description..."
        class="form-control mb-3" spellcheck="false"></textarea>

      <label for="date">Deadline</label>
      <flat-pickr ref='datepicker' name="date" v-model="project.deadline" :config="config" id='flatPickrId' class="deadline form-control mb-3"
        placeholder="Pick a deadline (optional)">
      </flat-pickr>

        <div id="users">
          <label for="users">Manage users on this project</label>

        <b-input-group>
          <b-form-input v-model="email" ref="focusThis" placeholder="Type email to add new user" />
          <b-input-group-append>
            <b-btn :disabled="isValidEmail" @click="submitEmail">Submit</b-btn>
          </b-input-group-append>
        </b-input-group>

        <b-table :items='project.users' :fields='usersField' responsive v-if="this.project.users.length > 0">

<template slot="email" slot-scope="row">
  <span class="badge badge-warning" v-if="project.users[row.index].new === true">New</span>
  {{project.users[row.index].email}}

</template>



          <template slot="admin" slot-scope="row">
            <!-- In some circumstances you may need to use @click.native.stop instead -->
            <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
            <b-form-checkbox @click.native.stop @change="changeAdmin(row.index)" :checked="project.users[row.index].admin"
            :disabled="!project.users[row.index].disabled"></b-form-checkbox>
              <!-- v-if="(project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') || (project.youAreAdmin === 'true' && project.users[row.index].admin === false && project.users[row.index].isyou === 'false')" -->


          <!-- (project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') || (project.youAreAdmin === 'true' && project.users[row.index].admin === 'true') -->
            <!-- (project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') -->
            <!-- project.users[row.index].isyou === 'false' -->
          </template>

          <template slot="remove" slot-scope="row">
            <!-- In some circumstances you may need to use @click.native.stop instead -->
            <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
            <!-- <b-form-checkbox @click.native.stop @change="changeDeleted(row.index)"></b-form-checkbox> -->

            <button type="button" class="btn btn-danger btn-sm"  @click="changeDeleted(row.index)"
            v-if="project.users[row.index].isyou === 'false' && (project.youAreCreator === 'true' || project.users[row.index].canEdit === true)">Remove</button>
            <!-- v-if="(project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') || (project.youAreAdmin === 'true' && project.users[row.index].admin === false && project.users[row.index].isyou === 'false')" -->
          </template>

          <!-- <template slot="new" slot-scope="row">
            <span class="badge badge-warning" v-if="project.users[row.index].new === true">New</span> -->
            <!-- v-if="(project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') || (project.youAreAdmin === 'true' && project.users[row.index].admin === false && project.users[row.index].isyou === 'false')" -->
          <!-- </template> -->


        </b-table>

      </div>
      <!-- </b-modal> -->

      <div class='usersModal'>

      </div>
      <!-- <multiselect id='users' v-model='project.users' :options="options" :preserveSearch="true" :multiple="true" :taggable="true"
        track-by='email' @tag="addTag" :close-on-select="false" :clear-on-select="false" :hide-selected="true" class="" :custom-label='CustomPersonLabel'
        placeholder="Enter email of people"></multiselect> -->


      <div v-if='itemEditButton!==undefined' class='d-block'>
        <!-- <button @click="projectCancel" class="btn btn-danger">Cancel changes</button> -->
        <button @click="projectEdit" class="btn btn-primary btn-block"><span class="fas fa-save"></span> Save changes</button>
      </div>
      <button v-else @click="projectCreate" class="btn btn-success"><span class="fas fa-plus-square"></span> Create project</button>
    </div>
  <!-- </div> -->
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { instance as axios } from "@/api/config.js";
import { store } from "@/store/index.js";
import { mapGetters, mapState } from "vuex";
// import Multiselect from "vue-multiselect";
const flatpickr = require("flatpickr");
require("flatpickr/dist/themes/material_blue.css");
export default {
  components: {
    flatPickr
    // Multiselect
  },
  data() {
    return {
      // nesto: false,
      UserID: undefined,
      editProjectData: [],

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
        altInput: true,
        minDate: "today"
      },
      usersField: ["email", "name", "surname", "admin", "remove"],
      email: undefined,
      isAdmin: false
      // options: []
    };
  },
  watch: {
    itemEditButton(val) {
      if (val === undefined) {
        this.project.title = undefined;
        this.project.description = undefined;
        this.project.deadline = undefined;
        this.project.users = [];
      } else {
        this.getProjectInfo();
      }
    }
  },
  methods: {
    confirmation() {
      // if(this.editProjectData.title !== this.project.title || this.editProjectData.description !== this.project.description || this.editProjectData.deadline !== this.project.deadline){
        if (confirm("Are you sure? You might have unsaved changes!")) {
          this.resetProjectView();
        }
      // }else{
      //   this.resetProjectView();
      // }
    },
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
      this.project.users.splice(rowIndex, 1);
    },

    changeAdmin(rowIndex) {
      this.project.users[rowIndex].admin = !this.project.users[rowIndex].admin;
      // this.usersWorking;
    },

    submitEmail() {
      let user = {
        email: this.email,
        admin: false,
        new: true,
        disabled: true,
        canEdit: true,
        isyou: "false",
        delete: false
      };

      this.project.users.push(user);
      this.email = "";
    },
    setupInfo() {
      for (var i = 0; i < this.currentTabData.length; i++) {
        var ctd = this.currentTabData[i];
        if (this.itemEditButton === ctd.id) {
          // PASS BY VALUE, NOT BY REF - DON'T CHANGE
          this.project.title = ctd.title;
          this.project.deadline = ctd.deadline;
          this.project.users_count = ctd.users_count;
        }
      }
    },
    getProjectInfo() {
      axios
        .get("projects/:proid", {
          params: {
            proid: store.getters.selectedItemID,
            sid: localStorage.sid
          }
        })
        .then(result => {
          if (result.data.status === "OK") {
            let moreInfo = result.data.data;

            for (var i = 0; i < moreInfo.users.length; i++) {
              // console.log(moreInfo.users[i].disabled);

              moreInfo.users[i].delete = false;
              moreInfo.users[i].admin = moreInfo.users[i].admin === "true";

              if (moreInfo.users[i].admin === false) {
                moreInfo.users[i].canEdit = true;
              }

              if (
                moreInfo.users[i].isyou === "false" &&
                (moreInfo.youAreCreator === "true" ||
                  moreInfo.users[i].canEdit === true)
              ) {
                moreInfo.users[i].disabled = true;
              }

              // if(moreInfo.users[i].admin === "true"){
              //   moreInfo.users[i].canEdit = false;
              // }
            }

            if (moreInfo.length !== 0) {
              this.project = moreInfo;
              this.editProjectData = moreInfo;
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
          sid: localStorage.sid
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
          usersarray: this.usersString, //usersWorking,
          proid: store.getters.selectedItemID,
          sid: localStorage.sid
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
              admin: "" + this.project.users[i].admin + "",
              delete: "false"
            };
            nizUsera.push(singleUser);
          }
        }

        if (this.email !== undefined) {
          let singleUser = {
            email: this.email,
            admin: "false",
            delete: "false"
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
          // console.log(users.length + " KORISNIKA");
          for (let i = 0; i < users.length; i++) {
            // console.log('Nesto' + users[i].surname);
            // console.log("EMAIL KORISNIKA: "+ users[i].email);
            tempUsers.push({
              email: users[i].email,
              admin: "" + this.project.users[i].admin + ""
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

<style scoped>
.pro-edit {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.emailDark {
  background: #2d3436;
  color: #fff;
}

.header {
  background: var(--success);
  border-radius: 5px;
  display: flex;
  padding: 10px 20px;
  justify-content: space-between;
  color: initial;
}

.header.back-primary {
  background: var(--primary);
}

.header * {
  margin: 0;
}

#users {
  width: 100% !important;
  /* border: 1px solid #aaaaaa; */
  /* box-shadow: 5px auto #888888; */
  /* padding: 30px; */
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.btn-success {
  color: initial;
}
</style>
