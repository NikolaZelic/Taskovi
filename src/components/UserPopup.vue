<template lang="html">
  <div class="popup">
    <table>
      <tr>
        <td>User: </td><td>{{ lsSurname }} {{ lsName }}</td>
      </tr>
        <tr>
          <td>Company: </td><td>{{ companyName }}</td>
        </tr>
          <tr>
            <td>Tasks working on: </td><td><span class="badge badge-warning">3</span></td>
          </tr>
            <tr>
              <td>Unread Messages: </td><td><span class="badge badge-danger">0</span></td>
            </tr>
    </table>
  </div>
</template>

<script>
import {
  store
} from "@/store/index.js";
import {
  mapState
} from 'vuex'
export default {
  data: {},
  computed: {
    lsName() {
      return localStorage.name;
    },
    lsSurname() {
      return localStorage.surname;
    },
    ...mapState({
      companyName: 'companyID',
    }),
  }
}
</script>

<style scoped>
.popup {
  position: relative;
  left: 66px;
  border-radius: 20px;
  border: 1px solid #5555;
  top: 60px;
  display: inline-block;
  background: #040201f4;
  box-shadow: 0px 0px 20px 5px rgba(154, 79, 79, 0.2);
  width: 300px;
  height: 200px;
  user-select: none;
  padding: 20px;
}

/* The actual popup */

.popup .popuptext {
  visibility: hidden;
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -80px;
}

/* Popup arrow */

.popup .popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

/* Toggle this class - hide and show the popup */

.popup .show {
  visibility: visible;
  animation: fadeIn 1s;
}

td {
  padding: 5px 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
