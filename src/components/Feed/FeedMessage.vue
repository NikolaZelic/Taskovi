<template>
  <div class='cont selector left-con' :class="[{unseenFeed : (mess.fed_type!=='header' && global && mess.unseen==1)},'msg-'+this.mess.fed_type]"
    :id="mess.fed_id">
    <div class='new-step' v-if='!global&&mess.fed_islabel!==1' title='Create new bookmark' v-b-modal='"creating-step"' @click='selectStep'>
      <i class="fas fa-plus-circle"></i>
    </div>
    <div class='img-placeholder' v-if='mess.fed_islabel!==1'>

      <avatar v-if='this.mess.fed_type==="message"' :username="mess.usr_name +' '+ mess.usr_surname" :src="getAvatar" :rounded="false"
        :size="40" class='avatar'>
      </avatar>
      <i class="fas fa-paperclip" v-if='this.mess.fed_type==="attachment"'></i>
      <i class="fas fa-info-circle" v-if='this.mess.fed_type==="status"'></i>
    </div>

    <div class="message-body" :class='{"header-type": mess.fed_islabel==1}'>
      <div class="message-body-header">
        <span class="name" v-if='mess.fed_islabel!==1'>{{mess.usr_name +' '+ mess.usr_surname}}</span>
        <span class='time-right' v-if='global'>Project:&nbsp;{{mess.pro_name}}</span>
        <span class='time-right' v-if='global'>Task:&nbsp;{{mess.tsk_title}}</span>
        <span class='time-right' v-if='mess.fed_islabel!==1'>{{mess.fed_time.substring(0,19)}}</span>
      </div>
      <span class="message" width="100">
        <a target="_blank" :href='showFile()' v-if="mess.fed_type==='attachment'&&!isImage()" class="attach show">{{mess.fed_text}}</a>
        <span v-else class="image-title">{{mess.fed_text}}</span><!-- Naslov slike samo u globalnima -->
      </span>
      <img @click='openImage' id='attachment-image' v-if="mess.fed_type==='attachment'&&isImage()" :src="showFile()">
    </div>
    <i @click='importantFeed' class="fas fa-star" :class="{ important: isImportant }" v-if='mess.fed_islabel!=1'></i>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { baseURL } from "@/api/config.js";
import { store } from "@/store/index.js";
import { instance as axios } from "@/api/config.js";
import Avatar from "vue-avatar";

export default {
  components: {
    Avatar
  },
  props: {
    mess: {
      type: Object
    }
  },
  data() {
    return {
      uploadProgress: 0,
      global: false
    };
  },
  computed: {
    ...mapState({
      scrollDownMess: state => state.modulefeed.scrollDownMess, //vraca true ili false u zavisnosit da li treba spustiti scroll
      user: state => state.userStorage
    }),
    ...mapGetters({
      taskid: "selectedItemID"
    }),
    isImportant() {
      return this.mess.fed_important;
    },
    getAvatar() {
      let netIcon = "";
      if (this.mess.usrimg !== undefined && this.mess.usrimg !== null) {
        netIcon = baseURL + this.mess.usrimg + "?sid=" + localStorage.sid;
      }
      return netIcon;
    }
  },
  methods: {
    selectStep() {
      store.commit("setSelectedStep", this.mess);
    },
    importantFeed() {
      store.commit("changeImportant", {
        mess: this.mess
      });
    },
    openImage() {
      window.open(this.showFile());
    },
    isImage() {
      if (this.mess.fed_text === undefined || this.mess.fed_text == null)
        return false;
      var extension = this.mess.fed_text.replace(/.+([.].+)/i, "$1").toLowerCase();
      if (extension == ".jpg" || extension == ".png" || extension == ".gif")
        return true;
      return false;
    },
    mojaPoruka() {
      if (
        this.name == this.mess.usr_name &&
        this.surname == this.mess.usr_surname
      )
        return true;
      else return false;
    },
    showFile() {
      return (
        baseURL +
        "tasks/" +
        this.taskid +
        "/feeds/" +
        this.mess.fed_id +
        "?sid=" +
        localStorage.sid
      );
    }
  },
  mounted() {
    if (this.scrollDownMess) {
      var id = document.getElementById("all");
      if (id !== undefined && id !== null) id.scrollTop = id.scrollHeight;
    }
  }
};
</script>

<style scoped>
.message a{
  display: block;
}
.image-title{
  display: block;
}
.header-type {
  font-size: 200%;
  text-align: center;
}

.new-step {
  color: #007bff;
  cursor: pointer;
  margin: 15px;
  align-self: center;
}

.message {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 90%;
  /* font-family: "TitilliumWeb"; */
}

/* .darkTheme .message {
  color: var(--sec-color);
} */

.important {
  color: #199686 !important;
}

.cont .fa-star {
  color: lightgray;
  font-size: 110%;
  padding: 5px;
  cursor: pointer;
}

.cont {
  padding: 5px 10px;
  /* margin: 0 7px; */
}

.cont:not(:last-child) {
  border-bottom: 1px solid #1b62e72b;
}

.img-placeholder {
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 5px 0 0 0;
}

.img-placeholder i {
  font-size: 150%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto 0;
  padding: auto;
}

.img-placeholder i.fa-info-circle {
  color: var(--ac-color);
}

.img-placeholder i.fa-paperclip {
  color: #6c7284;
}

.cont .name {
  font-size: 12px;
  font-weight: bold;
  color: var(--ac-color-dark);
  flex: 1;
}

.cont .attach {
  color: #139cbf;
}

#attachment-image {
  height: initial;
  /* max-height: 250px; */
  max-width: 60%;
  border-radius: 5px;
  cursor: pointer;
}

.message-body {
  margin: 0 10px;
  flex: 1;
}

.message-body-header {
  display: flex;
  justify-content: space-between;
}

.right-con {
  margin: 0 10px;
  display: flex;
  /* flex-direction: row-reverse; */
}

.right-con .message-body-header {
  flex-direction: row-reverse;
}

.left-con {
  /* margin: 0 10px; */
  display: flex;
}

.cont::after {
  content: "";
  clear: both;
  display: table;
}

.time-right {
  color: #8a8a8a;
  font-size: 12px;
  flex: 1;
  text-align: left;
}

.left-con p {
  display: inline;
  text-align: left;
}

.progress {
  margin: 0 auto;
  position: relative;
  width: 90%;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
}

.progress p {
  position: absolute;
  text-align: center;
  width: 100%;
  font-size: 12px;
}

.progress .in-progress {
  background-color: #0a0;
  height: 100%;
  width: 0;
}

.unseenFeed {
  border-left: 6px solid #ecec14;
}

.msg-status .message {
  font-size: 75%;
}

.avatar {
  border-radius: 5px !important;
}
</style>
