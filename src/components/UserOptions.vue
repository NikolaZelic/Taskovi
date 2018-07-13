<template>
  <div class='modal-mask'>
    <transition name='fade'>
      <div class="user-modal">
        <div class="header">
          <span>
            <strong>Change User Options</strong>
          </span>
          <i class="fa fa-times" @click='closeModal'></i>
        </div>
        <div class="body">

          <div class='op-avatar' title='Click to change Avatar' @click='changeAvatar'>
            <img src="@/assets/img/user.png" class="picture" />
            <span class='fas fa-camera'></span>
            <input ref='avatarUpload' type="file" style="display: none;" @change='changeFile'>
          </div>

          <div class="op-edit">
            <table>
              <tr v-for='(t,index) in tableData' :key='index'>
                <td>{{t.name}}:</td>
                <td>
                  <input type="text" v-model.trim="t.value" :disabled="editMode" />
                </td>
              </tr>
            </table>
          </div>

          <button @click='edit' class="op-btn btn btn-warning">
            <i class="fas fa-pen"></i> {{editMode?"Edit":"Save"}}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { store } from "@/store/index.js";
import { instance as axios } from "@/api/config.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      tableData: [
        {
          name: "Name",
          value: ""
        },
        {
          name: "Surname",
          value: ""
        },
        {
          name: "Email",
          value: ""
        },
        {
          name: "Password",
          value: ""
        }
      ],
      editMode: true
    };
  },
  methods: {
    edit() {
      this.editMode = !this.editMode;
      if (this.editMode === true) {
        axios
          .put("auth/users", {
            name: this.tableData[0].value,
            surname: this.tableData[1].value,
            email: this.tableData[2].value,
            pass: this.tableData[3].value,
            sid: localStorage.sid
          })
          .then(r => {
            if (r.data.status === "OK") {
              store.commit("modalStatus", {
                message: "Success"
              });
              store.commit("localStorage", {
                name: this.tableData[0].value,
                surname: this.tableData[1].value,
                email: this.tableData[2].value
              });
            } else {
              store.commit("modalStatus", {
                ok: false,
                message: "Error"
              });
            }
          })
          .catch(e => {
            console.log("e " + e);
          });
      }
    },
    changeAvatar() {
      this.$refs.avatarUpload.click();
    },
    changeFile(e) {
      var f = e.target.files[0];
      console.log(f.name);
    },
    closeModal() {
      this.$router.push("/");
    }
  },
  computed: {
    ...mapState({
      user: state => state.userStorage
    })
  },
  created() {
    this.tableData[0].value = this.user.name;
    this.tableData[1].value = this.user.surname;
    this.tableData[2].value = this.user.email;
  }
};
</script>

<style scoped>
.modal-mask {
  height: 100%;
  width: 100%;
  background: #101010c2;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-modal {
  display: flex;
  flex-direction: column;
}

.user-modal .header {
  background: var(--warning);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px 10px 0 0;
}

.user-modal .header i {
  cursor: pointer;
}

.user-modal .body {
  position: relative;
  background: #f4f4f4;
  border: 1px solid #777;
  padding: 10px;
  display: flex;
  flex-direction: row;
  min-width: 500px;
  border-radius: 0 0 10px 10px;
}

.op-avatar {
  position: relative;
  cursor: pointer;
  margin: auto 20px;
}

.op-avatar span {
  position: absolute;
  opacity: 0;
  font-size: 35px;
  top: 50%;
  left: 50%;
  transition: 0.5s ease;
  transform: translate(-50%, -50%);
}

.op-avatar img {
  height: 120px;
  border-radius: 40px;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.op-avatar:hover img {
  opacity: 0.3;
}

.op-avatar:hover span {
  opacity: 1;
  color: #444;
  font-size: 40px;
}

.op-edit {
  align-self: center;
}

.op-edit input {
  border: 1px solid #7777;
  border-radius: 2px;
  padding: 4px 10px;
}

.op-btn {
  height: 50px;
  align-self: center;
  margin: 0 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
