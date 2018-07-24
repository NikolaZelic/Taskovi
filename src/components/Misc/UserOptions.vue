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
            <img :src="avatarUrl" class="picture" />
            <span class='fas fa-camera'></span>
            <input ref='avatarUpload' type="file" style="display: none;" @change='changeFile'>
          </div>

          <div class="op-edit">
            <table>
              <tr v-for='(t,index) in tableData' :key='index'>
                <td>{{t.name}}:</td>
                <td>
                  <input :type='inputType(t)' v-model.trim="t.value" :disabled="toEdit" />
                </td>
              </tr>
              <tr v-if='passNotMatched' style='color: red'>Passwords do not match.</tr>
              <tr><td colspan="2">
          <button @click='edit' class="op-btn btn btn-primary" :disabled='passNotMatched'>
            <i class="fas fa-pen"></i> {{toEdit?" Edit":" Save"}}</button></td></tr>
            </table>
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

export default {
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
      toEdit: true
    };
  },
  methods: {
    inputType(t) {
      return t.name.includes("Password") ? "password" : "text";
    },
    edit() {
      this.toEdit = !this.toEdit;
      if (this.toEdit === true) {
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
      }
    },
    changeAvatar() {
      this.$refs.avatarUpload.click();
    },
    changeFile(e) {
      var f = e.target.files[0];
      console.log(f.name);
    },
    closeModal(val) {
      if (val === "cm" || val.target.id === "cm") {
        this.$router.push("/");
      }
    },
    getAvatar() {
      let link = "auth/users/img";
      let localImg = "static/img/user.png";
      axios
        .get(link, {
          params: {
            sid: localStorage.sid
          }
        })
        .then(r => {
          if (r.data["unset key"] === null) {
            this.avatarUrl = localImg;
          } else this.avatarUrl = baseURL + link + "?sid=" + localStorage.sid;
        });
    }
  },
  computed: {
    ...mapState({
      user: state => state.userStorage
    }),
    passNotMatched() {
      let a = this.tableData[3].value;
      let b = this.tableData[4].value;
      let empty = a.length === 0 || b.length === 0;
      let match = a === b;
      return !empty && !match;
    }
  },
  created() {
    this.getAvatar();
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
  background: var(--primary);
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
  display: block;
  margin: auto;
  border-radius: 5px;
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
  padding: 4px 10px;
}

.op-btn {
  display: flex;
  margin: 10px 0 0 auto;
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
