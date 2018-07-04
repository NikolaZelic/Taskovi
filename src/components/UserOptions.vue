<template>
<div class='modal-mask'>
    <div class="tail">
        <div class='image-container' title='Click to change Avatar' @click='changeAvatar'>
        <img src="@/assets/img/user.png" class="picture"  />
        <span class='fas fa-camera'></span></div>
      <div class="right-side">
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
              <input type="text" value="aaa@bbb.com" :disabled="editable" />
            </td>
          </tr>

          <tr class="edit">
            <td colspan="2">
              <button v-on:click="edit">{{editable?"Edit":"Save"}}</button>
            </td>
          </tr>
        </table>
      </div>
    </div></div>
</template>

<script>
import { store } from "@/store/index.js";

export default {
  data() {
    return {
      editable: true
    };
  },
  computed: {
    name() {
      return localStorage.name;
    },
    surname() {
      return localStorage.surname;
    },
    fullname() {
      return " " + this.name + " " + this.surname;
    }
  },
  methods: {
    edit() {
      this.editable = !this.editable;
    },
    changeAvatar() {
      console.log('change avatar clicked')
    }
  }
};
</script>

<style scoped>
.modal-mask {
  height: 100%;
  width: 100%;
  background: #333333aa;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tail {
  position: relative;
  background: #f4f4f4;
  border: 1px solid #777;
  border-radius: 10px;
  display: flex;
  width: 500px;
}

.image-container {
  position: absolute;
  cursor: pointer;
  left: 20px;
  top: 20px;
  width: 120px;
}

.image-container span {
  position: absolute;
  opacity: 0;
  font-size: 30px;
  top: 50%;
  left: 50%;
  transition: 0.5s ease;
  transform: translate(-50%, -50%);
}

.image-container img {
  height: 120px;
  border-radius: 40px;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.image-container:hover img {
  opacity: 0.3;
}

.image-container:hover span {
  opacity: 1;
  color: #444;
  font-size: 40px;
}

.tail .right-side {
  background-color: #333;
  border-radius: 2px;
  background-color: white;
  border: 1px solid #777;
  margin: 10px;
  display: flex;
  flex-flow: column;
}

.tail .right-side table {
  border-radius: 2px;
  display: block;
  margin: 40px;
  font-size: 20px;
}

.tail .right-side tr,
td {
  margin: 20px;
  border-collapse: collapse;
  border: 1px solid #aaa;
}

.tail .right-side table input {
  width: 100%;
  height: 100%;
  padding: 15px;
}

table .edit {
  text-align: right;
}

.tail .right-side tr td:first-child {
  padding: 15px;
}

.tail .left-side .picture {
  width: 100%;
}

.tail .left-side .change-pic {
  background-color: #42cbf4;
  color: black;

  text-decoration: none;
  font-size: 16px;
  text-align: center;
  padding: 10px;
}
</style>
