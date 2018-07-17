<template>
<div class='cont selektor' v-bind:class="mojaPoruka()?'right-con':'left-con'" :id="mess.fed_id">
  <img :src="icon()" />
  <div class="message-body">
    <div class="message-body-header">
      <span class="name">{{mess.usr_name +' '+ mess.usr_surname}}</span>
      <span class='time-right'>{{mess.fed_time.substring(0,19)}}</span>
    </div>
    <p class="message">{{mess.fed_text}}</p>
    <div class="attachment"></div>
    <a target="_blank" :href='showFile()' class="attach show" v-if="mess.fed_type==='attachment&&!isImage()'">Show file</a>
    <img @click='openImage' id='attachment-image' v-if="mess.fed_type==='attachment'&&isImage()" :src="showFile()"  height="600px">
  </div>
</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  baseURL as baseURL
} from '@/api/config.js';
export default {
  props: {
    mess: {
      type: Object
    }
  },
  data() {
    return {
      uploadProgress: 0
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
    name() {
      return this.user.name;
    },
    surname() {
      return this.user.surname;
    }
  },
  methods: {
    openImage(){
      window.open(this.showFile());
    },
    isImage(){
      var extension = this.mess.fed_text.replace( /.+([.].+)/i, '$1' );
      // console.log(this.mess.fed_text);
      // console.log(extension);
      if(extension=='.jpg'||extension=='.png'||extension=='.gif')
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
    icon() {
      switch (this.mess.fed_type) {
        case "attachment":
          return "static\\img\\file-icon.png";
        case "message":
          return "static/img/user.png";
        case "status":
          return "static/img/status.png";
        default:
          return "";
      }
    },
    showFile() {
      return (
        baseURL+"tasks/" +
        this.taskid +
        "/feeds/" +
        this.mess.fed_id +
        "?sid=" +
        localStorage.sid
      );
    }
  },
  mounted() {
    if (this.scrollDownMess)
      document.getElementById("all").scrollTop = document.getElementById(
        "all"
      ).scrollHeight;
  }
};
</script>

<style scoped>
.cont {
  padding: 5px 10px;
  margin: 7px;
  border-top: 1px solid var(--ac-color-dark);
}

.cont img {
  height: 40px;
  border-radius: 50%;
  margin: auto 0;
}

.cont .name {
  font-size: 12px;
  font-style: oblique;
  color: var(--ac-color-dark);
}
.cont .attach {
  color: #139cbf;
}
#attachment-image{
  height: initial;
  /* max-height: 250px; */
  width: 90%;
  border-radius: 0;
  cursor: pointer;
}
.message-body {
  margin-left: 10px;
  flex: 1;
}

.message-body-header {
  display: flex;
  justify-content: space-between;
}

.right-con {
  border-top: 1px solid #ffc10742;

  margin-left: 20px;
  display: flex;
  flex-direction: row-reverse;
}
.right-con .message-body-header {
  flex-direction: row-reverse;
}

.left-con {
  font-size: 80%;
  margin-right: 20px;
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

  text-align: right;
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
  border-radius: 4px;
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
</style>
