<template>
<div class="right">

  <div id="all" v-on:scroll="handleScroll()" class="feed-back">
    <button class="load" v-on:click="addUp">Loading new feeds...</button>
    <message v-for="(mess,i) in messages" :key="i" v-on:messCreate="scrollDown" :mess="mess"></message>
  </div>
  <div class="progress" v-show="inProgress">
    <p>LOADING FILE {{uploadProgress}}</p>
    <div class="in-progress" :style="'width:'+uploadProgress+'%'"></div>
  </div>
  <div class="input">
    <button class="btn btn-warning attac" @click="uploadFile"><span class="fas fa-paperclip"></span></button>
    <!-- ATTACHMENT SYMBOL &#x1f4ce; -->
    <textarea v-model="feed" placeholder="New Message..." @keyup.13="writeMessageFeed"></textarea>
    <button class="btn btn-warning send" v-on:click="writeMessageFeed"><span class="fas fa-arrow-circle-right"></span></button>
    <input type="file" id="file" v-on:change="changeFile" style="display:none;"></input>
  </div>

</div>
</template>
<script>
import {api} from '@/api/index.js'
import axios from 'axios';
import Message from './Message';
export default {
  components: {
    'message': Message,

  },
  data: function() {
    return {
      messages: [],
      feed: "",//ovo je tekst koji jos nije poslat
      taskId: 1,
      my_fed_id: -1,//napravio sam ga privremeno, kasnije cu ga vuci sa servera
      uploadProgress:50,
      inProgress:false
    }
  },
  methods: {
    scrollDown: function() {
      var mess = this.messages;
      document.getElementById("all").scrollTop = document.getElementById("all").scrollHeight;
    },
    writeMessageFeed: function() {
      if (this.feed.trim() === "") {
        this.feed = "";
        return;
      }
      var text = this.feed;
      api.postMessage(taskId, text)
        .then(res => {

        });
      this.messages.push({ //treba srediti kao kod attachmenta
        fed_text: text,
        fed_time: date,
        fed_id: this.my_fed_id,
        right: true
      });
      this.my_fed_id--;
      this.feed = "";
    },
    uploadFile() {
      document.getElementById("file").click();
    },
    changeFile(e) {
      var f = e.target.files[0]
      var fd = new FormData();
      console.log(f);
      console.log("prikaz filea");
      fd.append("type", "file");
      fd.append("file", f);
      fd.append("tasid", 1);
      axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/feeds', fd, {
          headers: {
            'content-type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            this.inProgress = true;
            this.uploadProgress = Math.round(progressEvent.loaded / progressEvent.total * 100);
          }
        })
        .then((res) => {
          this.inProgress = false;
          console.log(res);
          console.log("prikaz vracenog statusa");
          api.newFeed(this.taskId, this.messages[this.messages.length - 1].fed_id)
            .then(res1 => {
              this.messages = this.messages.concat(res1.data.data);
            });
        })
        .catch((err) => {
          console.log(err);
        });

    },
    addUp: function() {

      var d = this.messages[0].fed_time;
      var apiUrl = "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/" + this.taskId + "/feeds"
      axios.get(apiUrl, {
          params: {
            fedid: this.messages[0].fed_id,
            pravac: "up"
          }
        })
        .then(res => {
          console.log(res.data.data);
          this.messages = res.data.data.concat(this.messages);
          document.getElementById("all").scrollTop = 22;

        })
        .catch();
    },
    handleScroll() {
      if (!document.getElementById("all").scrollTop) {

        this.addUp();

      }
    }
  },
  mounted: function() {
    var apiUrl = "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/" + this.taskId + "/feeds";
    axios.get(apiUrl, {
      params: {
        fedid: 0,
        pravac: "start"
      }
    }).then((res) => {
      // console.log(res.data.data);
      this.messages = res.data.data;

    });
  }

}
</script>
<style scoped>
.right {
  background: #ebedf1;
  border-radius: 4px;
  border: 2px solid #ccc;
  height: 100vh;
  width: 500px;


  display: flex;
  flex-flow: column;
  justify-content: flex-start;

}

.feed-back {
  overflow-y: auto;
  word-wrap: break-word;
  flex: 1;
}

.feed-back .load {
  margin: auto;
  display: block;
  border-radius: 8px;
}

.input {
  bottom: 0px;
  display: flex;
}

.input textarea {
  padding: 5px;
  -webkit-box-flex: 1;
  -ms-flex: 1 0 200px;
  flex: 1 0 200px;
  background-color: #f8f8f8;
  font-size: 16px;
  resize: none;
}

.btn {
  border-radius: 0;
}

.input button:hover {
  background-color: #c8c8c8;
}

.input button:active {
  background: linear-gradient(#f8f8f8, #c8c8c8 40%, #f8f8f8 90%)
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
