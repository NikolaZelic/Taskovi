<template>
<div v-bind:class="mojaPoruka()?'cont right-con':'cont left-con'" :id="mess.fed_id">
  <img :src="icon()" />
  <div class="message-body">
    <div class="message-body-header">
      <span class="name">{{mess.usr_name +' '+ mess.usr_surname}}</span>
      <span class='time-right'>{{mess.fed_time.substring(0,19)}}</span>
    </div>
    <p class="message">{{mess.fed_text}}</p>
    <div class="attachment"></div>
    <a target="_blank" :href='showFile()' class="attach show" v-if="mess.fed_type==='attachment'">Show file</a>
  </div>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
  computed:{
    ...mapState({
      scrollDownMess: state => state.modulefeed.scrollDownMess //vraca true ili false u zavisnosit da li treba spustiti scroll
    }),
    ...mapGetters({
      taskid: "selectedItemID"
    }),
    name(){return window.localStorage.name},
    surname(){return window.localStorage.surname}
  },
  methods: {
    mojaPoruka(){
       if(this.name == this.mess.usr_name && this.surname == this.mess.usr_surname)return true;
       else return false;

    },
    icon() {
      switch (this.mess.fed_type) {
        case 'attachment':
          return 'static\\img\\file-icon.png';
        case 'message':
          return "static/img/user.png";
        case 'status':
          return "static/img/status.png";
        default:
          return "";
        }


    },
    showFile() {
      return (
        "http://695u121.mars-t.mars-hosting.com/mngapi/tasks/"+
        this.taskid+ "/feeds/" +
        this.mess.fed_id+"?sid="+window.localStorage.sid
      );
    }
  },
  mounted() {
    if(this.scrollDownMess)
      document.getElementById("all").scrollTop = document.getElementById("all").scrollHeight;
  }
};
</script>

<style scoped>
.cont * {
  color: #eee;
}
.cont {
  /* background-color: #ddd; */
  padding: 5px 10px;
  margin: 7px;
  border-top: 1px solid #ffc10742;
}

.cont img {
  height: 40px;
  border-radius: 50%;
  margin: auto 0;
}

.cont .name {
  font-size: 12px;
  font-style: oblique;
 
  color:#ffb037;

}
.cont .attach{
  color:#139cbf;
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
.right-con .message-body-header{
  flex-direction: row-reverse;
  
}

.left-con {
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
