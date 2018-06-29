<template lang="html">
  <transition name="modal">
    <b-alert class='modal-notif' show :variant='statusVariant'>
      <p>{{modalStatus.message}}
        <span :class="statusIcon"></span>
      </p>
    </b-alert>
  </transition>
</template>

<script>
import { store } from "@/store/index.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      dismissSecs: 4,
      dismissCountDown: 0,
      showDismissibleAlert: false
    };
  },
  computed: {
    ...mapState({
      modalStatus: "modalStatus"
    }),
    statusIcon() {
      return this.modalStatus.ok
        ? "fas fa-check"
        : "fas fa-exclamation-triangle";
    },
    statusVariant() {
      return this.modalStatus.ok ? "success" : "danger";
    }
  }
};
</script>

<style scoped lang="css">
p {
  text-align: center;
}

.modal-notif {
  position: fixed;
  bottom: 20px;
  right: 20px;
  opacity: 0.9;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.19);
  transition: opacity 0.3s ease;
}

.alert-success {
  color: #11441d;
  background-color: #79e292;
  border-color: #37e05e;
}

p {
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
