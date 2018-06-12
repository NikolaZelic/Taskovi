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
      <input type="file" id="file" v-on:change="changeFile" style="display:none;" />
      <button class="btn attac" @click="uploadFile"><span class="fas fa-paperclip"></span></button>
      <!-- ATTACHMENT SYMBOL &#x1f4ce; -->
      <textarea v-model="feed" placeholder="New Message..." @keyup.13="writeMessageFeed"></textarea>
      <button class="btn btn-success send" v-on:click="writeMessageFeed"><span class="fas fa-paper-plane"></span></button>
    </div>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex';
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
      countNumber:10,
      fInterval: null,
      feed: "", //ovo je tekst koji jos nije poslat
      uploadProgress: 50,
      inProgress: false
    };
  },
  computed: {
    ...mapState({
    // arrow functions can make the code very succinct!
    messages: state => state.messages,
    }),
    taskid() {
      return store.getters.getTaskID;
    }
  },
  watch: {
    taskid(val) {
      // if(this.taskid != -1){
      store.dispatch("readeFeeds", { taskid: this.taskid, fedid: 0, direction: "start" });
      this.countNumber = 3;
      this.count = 1;
      // }
    },
    messages() {
      document.getElementById("all").scrollTop = document.getElementById("all").scrollHeight;
      this.countNumber = 3;
      this.count = 1;
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
      store.dispatch("sendAttach",{
        type:'file',
        file: f,
        taskid: this.taskid
      });
      // axios
      //   .post(
      //     "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/feeds",
      //     fd, {
      //       headers: {
      //         "content-type": "multipart/form-data"
      //       },
      //       onUploadProgress: progressEvent => {
      //         this.inProgress = true;
      //         this.uploadProgress = Math.round(
      //           progressEvent.loaded / progressEvent.total * 100
      //         );
      //       }
      //     }
      //   )
      //   .then(res => {
      //     this.inProgress = false;
      //     console.log(res);
      //     console.log("prikaz vracenog statusa");
      //     api
      //       .newFeed(
      //         this.taskId,
      //         this.messages[this.messages.length - 1].fed_id
      //       )
      //       .then(res1 => {
      //         this.messages = this.messages.concat(res1.data.data);
      //       });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
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
    startFeed() {
      //poziva api svaki put kada je count deljiv sa countNumber
      this.fInterval = setInterval(() => {
        if(this.count % this.countNumber == 0 && this.taskid != -1){
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
        }//kraj if unutar intervala

        if(this.count++ >=25){
          this.countNumber = 10;
          this.count = 1;
        }
      }, 1000);
    }
  },
  mounted() {
    this.startFeed();
  },
  destroyed(){
    clearInterval(this.fInterval);
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
  align-items: center;
}

.input > * {
  margin: 0 5px;
}

.input textarea {
  padding: 5px 40px 5px 10px;
  flex: 1;
  background-color: #f8f8f8;
  border-radius: 20px;
  font-size: 16px;
  resize: none;
}

.input button {
  position: relative;
  border-radius: 50%;
  width: 42px;
  height: 42px;
}

.input button:last-child {
  right: 60px;
}

.input button>span {
  font-size: 16px;
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

.messages {
  max-height: 350px;
}
</style>
