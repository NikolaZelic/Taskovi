<template>
  <!-- <transition name="modal"> -->
    <div class="modal" >
      <div class="modal-content">
      <b-modal id="modal1" size="lg" title="Add or remove users from project" header-bg-variant="dark" header-text-variant="light" body-bg-variant="dark"
        body-text-variant="light" footer-bg-variant="dark" footer-text-variant="light" @shown="focusMyElement">

        <b-input-group>
          <b-form-input v-model="email" class="emailDark" ref="focusThis" placeholder="Type email" />
          <b-input-group-append>
            <b-btn :disabled="isValidEmail" @click="submitEmail">Submit</b-btn>
          </b-input-group-append>
        </b-input-group>

        <b-table :dark=true :items='project.users' :fields='usersField' responsive>

          <template slot="admin" slot-scope="row">
            <!-- In some circumstances you may need to use @click.native.stop instead -->
            <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
            <b-form-checkbox @click.native.stop @change="changeAdmin(row.index)" :checked="project.users[row.index].admin"
           
            ></b-form-checkbox>
             <!-- :disabled="!project.users[row.index].disabled" -->
              <!-- v-if="(project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') || (project.youAreAdmin === 'true' && project.users[row.index].admin === false && project.users[row.index].isyou === 'false')" -->


          <!-- (project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') || (project.youAreAdmin === 'true' && project.users[row.index].admin === 'true') -->
            <!-- (project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') -->
            <!-- project.users[row.index].isyou === 'false' -->
          </template>

          <template slot="delete" slot-scope="row">
            <!-- In some circumstances you may need to use @click.native.stop instead -->
            <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
            <!-- <b-form-checkbox @click.native.stop @change="changeDeleted(row.index)"></b-form-checkbox> -->

            <button type="button" class="btn btn-danger btn-sm"  @click="changeDeleted(row.index)"
            v-if="project.users[row.index].isyou === 'false' && (project.youAreCreator === 'true' || project.users[row.index].canEdit === true)">Remove</button>
            <!-- v-if="(project.youAreCreator === 'true' && project.users[row.index].isyou === 'false') || (project.youAreAdmin === 'true' && project.users[row.index].admin === false && project.users[row.index].isyou === 'false')" -->
          </template>

        </b-table>
      </b-modal>
     </div></div>
  <!--</transition> -->
</template>
<script>
export default {
  data() {
    return {
      email: undefined,
      project: {
        title: undefined,
        description: undefined,
        users_count: undefined,
        deadline: undefined,
        users: []
      },
      usersField: ["email", "name", "surname", "admin", "delete"]
    };
  },
  methods: {
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
        admin: false
      };

      this.project.users.push(user);
      this.email = "";
    },
    focusMyElement(e) {
      this.$refs.focusThis.focus();
    }
  },
  computed: {
    isValidEmail() {
      let email = this.email;
      if (email === undefined || email === "") return true;
      let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let check = email.match(pattern);
      return !check;
    }
  }
};
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 1;
  padding-top: 12%;
  left: 0;
  top: 0;
  margin: 0 !important;
  width: 100% !important;
  height: 100%;
  /* overflow: auto; */
  background-color: rgb(0, 0, 0) !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
  transition: opacity 0.3s ease;
}
</style>
