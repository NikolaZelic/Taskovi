<template>
  <div class="feed" :class='{darkTheme: darkTheme}' v-show="showFeeds">
    <div class="search-inputs" >
      <input @blur="readeFeeds" v-model="searchText" type='text' placeholder="Search Feed"/>
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
        <global-feed-message v-if='global' v-for="(mess,i) in messages" :key="i" :mess="mess" />
        <feed-message v-if='!global' v-for="(mess,i) in messages" :key="i" :mess="mess" />
      </div>
    </div>
    <div class="progress" v-show="inProgress">
      <p>LOADING FILE {{uploadProgress}}</p>
      <div class="in-progress" :style="'width:'+uploadProgress+'%'"></div>
    </div>
    <div v-if='!global' class="input">
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
import GlobalFeedMessage from "./GlobalFeedMessage";
import { store } from "@/store/index.js";
import { api } from "@/api/index.js";

export default {
  components: {
    FeedMessage,
    GlobalFeedMessage,
  },
  data() {
    return {
      global: false,
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
      messages: state => state.modulefeed.messages,
      darkTheme: state => state.darkTheme,
      searchFeedsParams : state => state.modulefeed.searchFeedsParams,
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
    messages(newVal, oldVal) {
      this.countNumber = 1;
      this.count = 0;
      // console.log('Poziv na sekundu');
      // setTimeout( ()=>{this.scrollToBegining();}, 50 );
    },
    searchType(){
      this.readeFeeds();
    },
    searchImportant(){
      this.readeFeeds();
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
    readeFeeds(){
      store.commit('clearFeed');

      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: 0,
        direction: "start",
        type: this.searchType,
        searchingstring: this.searchText,
        fed_important: this.searchImportant,
      }).then( ()=>{
        this.scrollToBegining();
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
      setTimeout( ()=>{ 
          var a = document.querySelectorAll(".selektor");
          a = a[a.length-1];
          a.scrollIntoView(true);
        } , 500 
        );
      this.feed = "";
    },
    uploadFile() {
      if (this.taskid == -1) 
        return -1;
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
      if (this.taskid === -1) 
        return;
      if(this.messages==null||this.messages.length==0)
        return;
      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: this.messages[0].fed_id,
        direction: "up",
        type: this.searchType,
        searchingstring: this.searchText,
        fed_important: this.searchImportant,
      }).then( response => {
        if(response.data.data!==undefined&&response.data.data.length>0)
          this.scrollToBegining();
      } );
    },
    addDown(){
      store.dispatch("readeFeeds", {
        taskid: this.taskid,
        fedid: this.messages[this.messages.length - 1].fed_id,
        direction: "down"
      });
    },
    handleScroll(e) {
      // console.log(e.target.scrollTop);
      // console.log( document.getElementById("all").scrollY );
      if ( e.target.scrollTop===0 ) {
        this.addUp();
      }
    },
    scrollToBegining(){
      var a = document.querySelectorAll(".selektor");
      if(a===undefined||a===null||a.length==0)
        return;
      if(a.length==0)
        a = a[0];
      else{
        if(a.length<=10)
          a = a[a.length-1];
        else
          a = a[11];
      }
      if(a!==undefined)
        a.scrollIntoView(true);
    },
    jumpToStepFeed(){
      var tsk_id = this.searchFeedsParams.tsk_id;
      var stp_time_created = this.searchFeedsParams.stp_time_created;
      api.searchStepFeeds(tsk_id, stp_time_created).then( result => {
        console.log(result);
        if(result.data.status!='OK'){
          alert('Faild to load data');
          return;
        }
        store.commit('addMessages', {direction: 'start', data:result.data.data } );
      });
    },
  },
  mounted() {
    if(this.searchFeedsParams===null){
      this.readeFeeds();
    }
    else{
      this.jumpToStepFeed();
    }

    // ZX - POZIVA REFRESH NOTIFA
    store.dispatch("getFeedCount");

    //poziva api svaki put kada je count deljiv sa countNumber
    this.fInterval = setInterval(() => {
      if (this.count % this.countNumber == 0 && this.taskid != -1 && !this.searchOn ) {
        if ( this.messages.length > 0) {
          this.addDown();
        } 
      }
      this.count++;
      if( this.count==10 ){
        this.countNumber = 5;
        // console.log('Poziv na 5 sekundi');
      }
      else if( this.count==60 ){
        this.countNumber = 30;
        // console.log('Poziv na 30 sekundi');
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
