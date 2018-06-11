<template lang="html">
<div class="modal-error" >
  <!-- BROKEN FOR DIV @click="closeModal" -->
  <div class="modal-content">
   <span class="close" @click="closeModal">&times;</span>
    <p>Internet not detected or error requesting data.</p>
     <p>{{ message }}</p>
  </div>
</div>
</template>

<script>
import {
  store
} from "@/store/index.js";
import {
  mapState
} from 'vuex';
export default {
  methods: {
    closeModal() {
      store.commit("modalError", {
        active: false
      });
    }
  },
  computed: {
    ...mapState({
      message: state => state.modalError.message,
    }),
  }
}
</script>

<style scoped lang="css">


.modal-error{
position: fixed;
z-index: 1;
padding-top: 30%;
left: 0;
top: 0;
margin: 0 !important;
width: 100% !important;
height: 100%;
overflow: auto;
background-color: rgb(0,0,0) !important;
background-color: rgba(0,0,0,0.4) !important;
}
  .modal-content{
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
        width: 40%;
     box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
  }
/* The Close Button */
.close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
}
</style>
