<template>
<div class="chat">
  <div class="feed-all" v-show="showFeeds">
    <div id="all" v-on:scroll="handleScroll()" class="feed-back">
      <div class="messages">
        <chat-message v-for="(mess,i) in messages" :key="i" :mess="mess" />
      </div>
    </div>
    <div class="progress" v-show="inProgress">
      <p>LOADING FILE {{uploadProgress}}</p>
      <div class="in-progress" :style="'width:'+uploadProgress+'%'"></div>
    </div>
    <div class="input">
      <button class="load btn btn-primary" v-on:click="addUp"><span class="fas fa-sync-alt"></span></button>
      <button class="btn btn-warning attac" @click="uploadFile"><span class="fas fa-paperclip"></span></button>
      <!-- ATTACHMENT SYMBOL &#x1f4ce; -->
      <textarea v-model="feed" placeholder="New Message..." @keyup.13="writeMessageFeed"></textarea>
      <button class="btn btn-warning send" v-on:click="writeMessageFeed"><span class="fas fa-arrow-circle-right"></span></button>
      <input type="file" id="file" v-on:change="changeFile" style="display:none;" />
    </div>
  </div>
</div>
</template>
<script>
import ChatMessage from "./ChatMessage";
import {
  store
} from "@/store/index.js";
import {
  api
} from "@/api/index.js";

export default {
  components: {
    ChatMessage
  },
  data() {
    return {
      showFeeds: true,
      count: 0,
      fInterval: null,
      feed: "", //ovo je tekst koji jos nije poslat
      uploadProgress: 50,
      inProgress: false
    };
  },
  computed: {
    messages() {
      return store.getters.getMessages;
    },

    taskid() {
      var id = store.getters.selectedTaskID;
      if (id === -1) {
        this.hideRightSide();
      }
      // console.log('Iz RightSide '+id);
      return id;
    }
  },
  watch: {
    taskid(val) {
      if (this.fInterval) {
        clearInterval(this.fInterval);
      }
      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        direction: "start"
      });
      this.resetInterval(2000);
      console.log("Ovo je taks id: " + this.taskid);
    },
    messages() {
      this.resetInterval(2000);
    }
  },
  methods: {
    writeMessageFeed() {
      if (this.taskid === -1) return;
      var text = this.feed.trim();
      if (text === "") {
        this.feed = "";
        return;
      }
      store.dispatch("postMessage", {
        taskid: this.taskid,
        text: text
      });
      this.feed = "";
    },
    uploadFile() {
      if (this.taskid == -1) return -1;
      document.getElementById("file").click();
    },
    changeFile(e) {
      var f = e.target.files[0];
      var fd = new FormData();
      console.log(f);
      console.log("prikaz filea");
      fd.append("type", "file");
      fd.append("file", f);
      fd.append("tasid", 1);
      axios
        .post(
          "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/feeds",
          fd, {
            headers: {
              "content-type": "multipart/form-data"
            },
            onUploadProgress: progressEvent => {
              this.inProgress = true;
              this.uploadProgress = Math.round(
                progressEvent.loaded / progressEvent.total * 100
              );
            }
          }
        )
        .then(res => {
          this.inProgress = false;
          console.log(res);
          console.log("prikaz vracenog statusa");
          api
            .newFeed(
              this.taskId,
              this.messages[this.messages.length - 1].fed_id
            )
            .then(res1 => {
              this.messages = this.messages.concat(res1.data.data);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    addUp() {
      if (this.taskid === -1) return;
      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: this.messages[0].fed_id,
        direction: "up"
      });
    },
    handleScroll() {
      if (!document.getElementById("all").scrollTop) {
        this.addUp();
      }
    },
    startFeed(time) {
      if (this.taskid === -1) return;
      this.fInterval = setInterval(() => {
        var msg = store.state.messages;
        if (msg.length > 0) {
          store.dispatch("readeFeeds", {
            taskid: this.taskid,
            fedid: msg[msg.length - 1].fed_id,
            direction: "down"
          });
        } else {
          store.dispatch("readeFeeds", {
            taskid: this.taskid,
            fedid: 0,
            direction: "start"
          });
        }
        console.log(this.count);
        this.count++;
        if (this.count > 20) {
          this.count = 0;
          this.resetInterval(10000);
        }
      }, time);
    },
    resetInterval(time) {
      clearInterval(this.fInterval);
      this.startFeed(time);
    },
    hideRightSide() {
      // Sveto ovde ti uleces !
    }
  },
  mounted() {
    this.startFeed(2000);
  }
};
</script>
<style scoped>
.chat {
  display: flex;
  flex: 1;
}

.trans {
  flex: 0 0 30px;
}

.trans .btn {
  width: 100%;
  height: 100%;
}

.feed-all {
  background: #ebedf1;
  border: 1px solid #ccc;
  width: 100%;
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
  line-height: 0.5;
}

.input {
  bottom: 0px;
  display: flex;
}

.input textarea {
  padding: 5px;
  flex: 1;
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
  background: linear-gradient(#f8f8f8, #c8c8c8 40%, #f8f8f8 90%);
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

.fade-enter-active,
.fade-leave-active {
  transition: width 0.5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */

  {
  width: 0;
}

.messages {
  max-height: 350px;
}
</style>
