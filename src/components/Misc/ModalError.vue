<template lang="html">
  <transition name="modal">
    <div class="modal-mask" @click="closeModal" id='cm'>
      <div class="modal-content">
        <p><i class="fas fa-exclamation-triangle" ></i> {{ message }}</p>
        <button class='btn btn-danger dismiss' id='cm'>Dismiss</button>
        </div>
    </div>
  </transition>
</template>

<script>
import { store } from "@/store/index.js";
import { mapState } from "vuex";
export default {
  methods: {
    closeModal(val) {
      let tar = val.target.id;
      if (tar === "cm") {
        store.commit("modalError", {
          active: false
        });
      }
    }
  },
  computed: {
    ...mapState({
      message: state => state.modalError.message
    })
  }
};
</script>

<style scoped lang="css">
p {
  text-align: center;
}

.modal-mask {
  position: fixed;
  z-index: 1;
  padding-top: 12%;
  left: 0;
  top: 0;
  margin: 0 !important;
  width: 100% !important;
  height: 100%;
  background-color: rgb(0, 0, 0) !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 40%;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.19);
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

.dismiss {
  margin: 0 auto;
  width: 50%;
  min-width: 100px;
}
</style>
