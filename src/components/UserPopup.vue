<template lang="html">
  <div class="popup">
    <p>User: {{ lsSurname }} {{ lsName }}</p>
    <p>Company: {{ companyName }}</p>
  </div>
</template>

<script>
import {
  store
} from "@/store/index.js";
export default {
  data: {
    // name: undefined,
    // surname: undefined,
    // company: undefined,
  },
  computed: {
    lsName() {
      return localStorage.name;
    },
    lsSurname() {
      return localStorage.surname;
    },
    companyName() {
      return store.getters.getCompanyID;
    }
  }
}
</script>

<style scoped>
.popup {
  position: relative;
  left: 66px;
  border-radius: 20px;
  top: 60px;
  display: inline-block;
  background: #2b363e;
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
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
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
