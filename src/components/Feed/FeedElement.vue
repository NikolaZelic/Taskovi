<template>
  <div class="feed" v-show="showFeeds">
    <div class="search-inputs" >
      <input @blur="searchFeeds" v-model="searchText" type='text' placeholder="Search Feed"/>
      <form >
        <span class='radio-wrapper'>
          <input type="radio" id="all" value="all" checked v-model='searchType'> <label for="all">All</label>
          <input type="radio" id="messages" value="messages" v-model='searchType'> <label for="messages">Messages</label>
          <input type="radio" id="statuses" value="statuses" v-model='searchType'> <label for="statuses">Statuses</label>  
          <input type="radio" id="files" value="files" v-model='searchType'> <label for="files">Files</label>  
        </span>
        <input type="checkbox" id='important' v-model='searchImportant'> <label for="important">Important</label>  
      </form> 
    </div>
    <div id="all" @scroll="handleScroll" class="feed-back">
      <div class="messages">
        <feed-message v-for="(mess,i) in messages" :key="i" :mess="mess" />
      </div>
    </div>
    <div class="progress" v-show="inProgress">
      <p>LOADING FILE {{uploadProgress}}</p>
      <div class="in-progress" :style="'width:'+uploadProgress+'%'"></div>
    </div>
    <div class="input">
      <button class="load btn btn-primary" @click="addUp">
        <span class="fas fa-sync-alt"></span>
      </button>
      <input type="file" id="file" @change="changeFile" style="display:none;" />
      <button class="btn attac" @click="uploadFile">
        <span class="fas fa-paperclip"></span>
      </button>
      <!-- ATTACHMENT SYMBOL &#x1f4ce; -->
      <textarea v-model="feed" placeholder="New Message..." @keyup='processKeyUp' ></textarea>
      <button class="btn btn-success send" v-on:click="writeMessageFeed">
        <span class="fas fa-paper-plane"></span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import FeedMessage from "./FeedMessage";
import { store } from "@/store/index.js";
import { api } from "@/api/index.js";

export default {
  components: {
    FeedMessage
  },
  data() {
    return {
      showFeeds: true,
      count: 0,
      countNumber: 10,
      fInterval: null,
      feed: "",
      uploadProgress: 50,
      inProgress: false,
      searchType: 'all',
      searchText: '',
      searchImportant: false,
    };
  },
  computed: {
    ...mapState({
      messages: state => state.modulefeed.messages
    }),
    ...mapGetters({
      taskid: "selectedItemID"
    }),
    searchOn(){
      if(this.searchType!=='all')
        return true;
      if(this.searchImportant)
        return true;
      if(this.searchText!==null&&this.searchText.length>0)
        return true;
      return false;
    },
  },
  watch: {
    taskid(val) {
      // if(this.taskid != -1){
      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: 0,
        direction: "start"
      });
      // }
    },
    messages() {
      this.countNumber = 5;
      this.count = 1;
    },
    searchType(){
      this.searchFeeds();
    },
    searchImportant(){
      this.searchFeeds();
    },
  },
  methods: {
    processKeyUp(event){
      if(event.key=='Enter'){
        if(event.shiftKey){
          this.feed += '\n';
        }
        else{
          this.writeMessageFeed();
        }
      }
    },
    searchFeeds(){
      store.commit('clearFeed');

      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: 0,
        direction: "start",
        type: this.searchType,
        searchingstring: this.searchText,
        fed_important: this.searchImportant,
      }).then( ()=>{
        var a = document.querySelectorAll(".selektor")[9];
        if(a!==undefined)
          a.scrollIntoView(false);
      });
    },
    writeMessageFeed() {
      if (this.taskid === -1) 
        return;
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
      store.dispatch("sendAttach", {
        type: "file",
        file: f,
        taskid: this.taskid
      });
    },
    addUp() {
      // console.log('add up');
      if (this.taskid === -1) 
        return;
      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: this.messages[0].fed_id,
        direction: "up",
        type: this.searchType,
        searchingstring: this.searchText,
        fed_important: this.searchImportant,
      }).then( response => {
        var a = document.querySelectorAll(".selektor")[10];
        // console.log(a);
        if(a!==undefined)
          a.scrollIntoView(true);
      } );
    },
    handleScroll(e) {
      // console.log(e.target.scrollTop);
      // console.log( document.getElementById("all").scrollY );
      if ( e.target.scrollTop===0 ) {
        this.addUp();
      }
    },
  },
  mounted() {
    store.dispatch("readeFeeds", {
      taskid: this.taskid,
      fedid: 0,
      direction: "start"
    }).then( ()=>{
      var a = document.querySelectorAll(".selektor")[9];
      if(a!==undefined)
        a.scrollIntoView(false);
    });

    // ZX - POZIVA REFRESH NOTIFA
    store.dispatch("getFeedCount");

    //poziva api svaki put kada je count deljiv sa countNumber
    this.fInterval = setInterval(() => {
      if (this.count % this.countNumber == 0 && this.taskid != -1 && !this.searchOn ) {
        var msg = this.messages;

        if (msg.length > 0) {
          store.dispatch("readeFeeds", {
            taskid: this.taskid,
            fedid: msg[msg.length - 1].fed_id,
            direction: "down"
          });
        } 
        // else {
        //   store.dispatch("readeFeeds", {
        //     taskid: this.taskid,
        //     fedid: 0,
        //     direction: "start"
        //   });
        // }
      }

      if (this.count++ >= 25) {
        this.countNumber = 10;
        this.count = 1;
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.fInterval);
    store.commit("clearFeed");
  }
};
</script>
<style scoped>
.radio-wrapper{
  border: 2px solid lightgray;
  border-radius: 5px;
}
.search-inputs{
  margin: 10px;
  text-align: center;
}
.search-inputs *{
  padding: 5px;
}
.search-inputs input[type="text"]{
  width: 400px;
}
.trans {
  flex: 0 0 30px;
}

.trans .btn {
  width: 100%;
  height: 100%;
}

.feed {
  flex: 1;
  border-left: 1px solid #ffc10742;
  border-top: 1px solid #ffb037;
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
  color: black;
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

.input button > span {
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
