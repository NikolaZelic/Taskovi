<template>
<div v-bind:class="mess.right?'cont right-con':'cont left-con'" :id="mess.fed_id">
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
export default {
  props: {
    mess: {
      type: Object
    }
  },
  data() {
    return {
      uploadProgress: 0
    }
  },
  methods: {
    icon(){
      if(this.mess.fed_type==='attachment'){
        return 'static\\file-icon.png';
      }else{
        return 'static\\user.png';
      }
    },
    showFile() {
      return (
        "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/feeds/" +
        this.mess.fed_id +
        "/attachment"
      );
    }
  },
  mounted() {
    document.getElementById("all").scrollTop = document.getElementById("all").scrollHeight; //Uvek spusta na dno ekrana
  }
};
</script>

<style scoped>
.cont {
  background-color: #ddd;
  padding: 5px 10px;
  margin: 7px;
}

.cont img {
  height: 30px;
  border-radius: 50%;
  margin: auto 0;
}

.cont .name {
  font-size: 12px;
  font-style: oblique;
  width: 93%;
}

.cont .message {
  color: black;
}

.message-body {
  margin-left: 10px;
  flex: 1;
}

.message-body-header {
  display: flex;
}

.right-con {
  border-color: #ccc;
  background-color: #e6e5bb;
  margin-left: 20px;
  display: flex;
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
  width: 100%;
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
