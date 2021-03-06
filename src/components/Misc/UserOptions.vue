<template>
  <div class='modal-mask' @click="closeModal" id='cm'>
    <transition name='fade'>
      <div class="user-modal">
        <div class="header">
          Change User Options
          <i class="fa fa-times" id='cm'></i>
        </div>
        <div class="body">
          <div class='op-avatar' title='Click to change Avatar' @click='changeAvatar'>
            <avatar :username="username" :src="avatarUrl" :rounded="false" :size="120" class="picture"></avatar>
            <span class='fas fa-camera'></span>
            <input ref='avatarUpload' type="file" accept="image/*" style="display: none;" @change='changeFile'>
          </div>

          <div class="op-edit">
            <table>
              <tbody>
                <tr v-for='(t,index) in tableData' :key='index'>
                  <td>{{t.name}}:</td>
                  <td>
                    <input :type='inputType(t)' v-model.trim="t.value" />
                  </td>
                </tr>
                <tr :style='{visibility:!passNotMatched?"hidden":"visible"}' style='color: red'>Passwords do not match.</tr>
              </tbody>
            </table>

            <span class='op-action'>
              <span class='theme-changer' @click='changeTheme' :class='{darkTheme : darkTheme}'></span>
              <button @click='edit' class="btn btn-primary" :disabled='passNotMatched'>
                <i class="fas fa-pen"></i> Save</button>
            </span>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { store } from "@/store/index.js";
import { instance as axios } from "@/api/config.js";
import { mapState } from "vuex";
import { baseURL } from "@/api/config.js";
import Avatar from "vue-avatar";

export default {
  components: {
    Avatar
  },
  props: ["userOptionsVisible"],
  data() {
    return {
      avatarUrl: "",
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
        },
        {
          name: "Confirm Password",
          value: ""
        }
      ],
      avatarData: undefined,
      avatarHeader: {
        "content-type": "multipart/form-data"
      }
    };
  },
  methods: {
    inputType(t) {
      return t.name.includes("Password") ? "password" : "text";
    },
    edit() {
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
          console.log("e: " + e);
        });
      this.closeModal("cm");
    },
    changeAvatar() {
      this.$refs.avatarUpload.click();
    },
    changeFile(e) {
      var f = e.target.files[0];
      this.avatarUpload(f);
    },
    avatarUpload(file) {
      let fd = new FormData();
      fd.append("img", file);
      axios
        .put("auth/users/img?sid=" + window.localStorage.sid, fd, {
          headers: {
            "content-type": "multipart/form-data"
          }
        })
        .then(r => {
          if (r.data.status === "OK") {
            this.getAvatar();
          } 
          // else {
          //   store.commit("modalError", {
          //     message: "Avatar not uploaded properly"
          //   });
          // }
        });
        // .catch(e => {
        //   store.commit("modalError", {
        //     message: "" + e
        //   });
        // });
    },
    closeModal(val) {
      if (val === "cm" || val.target.id === "cm") {
        this.$emit("userOptionsVisible", false);
      }
    },
    getAvatar() {
      let link = "auth/users/img";
      axios
        .get(link, {
          params: {
            sid: localStorage.sid
          }
        })
        .then(r => {
          if (r.data["unset key"] === null) {
            this.avatarUrl = "";
          } else {
            this.avatarUrl =
              baseURL +
              link +
              "?sid=" +
              localStorage.sid +
              "&crypt=" +
              Date.now();
          }
        });
    },
    changeTheme() {
      localStorage.dark = !this.darkTheme;
      store.commit("darkTheme", !this.darkTheme);
    }
  },
  computed: {
    ...mapState({
      darkTheme: "darkTheme",
      userStorage: "userStorage",
      lastLink: "lastLink"
    }),
    avatarUploadUrl() {
      return baseURL + "auth/users/img?sid=" + window.localStorage.sid;
    },
    passNotMatched() {
      let a = this.tableData[3].value;
      let b = this.tableData[4].value;
      let empty = a.length === 0 || b.length === 0;
      let match = a === b;
      return !empty && !match;
    },
    username() {
      return this.userStorage.name + " " + this.userStorage.surname;
    }
  },
  created() {
    this.getAvatar();
    this.tableData[0].value = this.userStorage.name;
    this.tableData[1].value = this.userStorage.surname;
    this.tableData[2].value = this.userStorage.email;
  }
};
</script>

<style scoped>
.modal-mask {
  background: #101010c2;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-modal {
  display: flex;
  flex-direction: column;
}

.user-modal .header {
  color: white;
  background: var(--ac-color);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  border-radius: 5px 5px 0 0;
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
  border-radius: 0 0 5px 5px;
}

.op-avatar {
  position: relative;
  cursor: pointer;
  margin: auto 20px;
  width: 120px;
}

.op-avatar .fa-camera {
  position: absolute;
  opacity: 0;
  font-size: 35px;
  top: 50%;
  left: 50%;
  transition: 0.5s ease;
  transform: translate(-50%, -50%);
}

.op-avatar .picture {
  height: 120px;
  display: flex;
  margin: auto;
  border-radius: 5px !important;
  transition: 0.5s ease;
  backface-visibility: hidden;
  width: 120px;
}

.op-avatar:hover .picture {
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

.op-edit tr {
  margin-bottom: 5px;
}

.op-edit td {
  padding-bottom: 7px;
}

.op-edit input {
  border: none;
  border-bottom: 1px solid #7777;
  background: #f4f4f4;
  padding: 4px 10px;
}

.op-edit input:disabled {
  user-select: none;
}

.op-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.theme-changer.darkTheme {
  background: var(--main-bg-color);
}

.theme-changer.darkTheme:hover {
  background: rgba(228, 228, 228, 0.7);
}

.theme-changer {
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #2b7bd899;
  box-shadow: 0 0 2px #2b7bd899;
  background: var(--sec-bg-color);
  margin-right: 15px;
  width: 30px !important;
  height: 30px;
}

.fa-pen {
  margin: 5px 10px 5px 0;
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
