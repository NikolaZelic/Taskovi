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
              <tr>
                <td>Name:</td>
                <td>
                  <input type="text" :value="name" :disabled="editable" />
                </td>
              </tr>
              <tr>
                <td>Surname:</td>
                <td>
                  <input type="text" :value="surname" :disabled="editable" />
                </td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>
                  <input type="text" v-model="email" :disabled="editable" />
                </td>
              </tr>
            </table>
          </div>

          <button @click='edit' class="op-btn btn btn-warning">
          <i class="fas fa-pen"></i> {{editable?"Edit":"Save"}}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { store } from "@/store/index.js";

export default {
  data() {
    // email = localStorage.email;
    return {
      email: undefined,
      name: undefined,
      surname: undefined,
      editable: true
    };
  },
  methods: {
    edit() {
      this.editable = !this.editable;
    },
    changeAvatar() {
      this.$refs.avatarUpload.click();
    },
    changeFile(e) {
      var f = e.target.files[0];
      console.log(f)
      // store.dispatch("sendAttach", {
      //   type: "file",
      //   file: f,
      //   taskid: this.taskid
      // });
    },
    closeModal() {
      this.$router.push("/");
    }
  },
  created() {
    this.email = localStorage.email;
    this.name = localStorage.name;
    this.surname = localStorage.surname;
  }
};
</script>

<style scoped>
.modal-mask {
  height: 100%;
  width: 100%;
  background: #101010c2;
  position: absolute;
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
