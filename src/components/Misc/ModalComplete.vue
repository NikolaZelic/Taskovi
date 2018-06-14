<template lang="html">
  <transition name="modal">
      <div class="modal-status" :class='statusClass'>
        <p> <i :class="statusIcon"></i></p><p> {{ modalStatus.message }}</p>
        </div>
  </transition>
</template>

<script>
import {
  store
} from "@/store/index.js";
import {
  mapState
} from "vuex";
export default {
  computed: {
    ...mapState({
      modalStatus: "modalStatus",
    }),
    statusIcon() {
      return this.modalStatus.ok ? 'fas fa-check' : 'fas fa-exclamation-triangle'
    },
    statusClass() {
      return this.modalStatus.ok ? 'ok' : 'err';
    }
  }
};
</script>

<style scoped lang="css">
p {
  text-align: center;
}
.modal-status {
    position: fixed;
    padding: 10px;
    bottom: 20px;
    width: 100px;
    height: 100px;
    right: 20px;
    border-radius: 50%;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.19);
    transition: opacity 0.3s ease;
}

.ok{
   background: #5bc55ac7;
   border: 2px solid #1f691d6b;
}
.err{
   background: #bb3838db;
   border: 2px solid #691d1d6b;
   color: #fff;
}

p{
  margin: 0;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: scale(1.1);
}
</style>
