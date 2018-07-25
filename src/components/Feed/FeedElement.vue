<template>
  <div class="feed" :class='{darkTheme: darkTheme}' v-show="showFeeds">
    <div class="search-inputs">
      <input @blur="textInputBlur" v-model="searchText" type='text' placeholder="Search Feed" class='search' />
      <form>
        <span class='radio-wrapper'>
          <input type="radio" id="all" value="all" checked v-model='searchType'>
          <label for="all">All</label>
          <input type="radio" id="messages" value="messages" v-model='searchType'>
          <label for="messages">Messages</label>
          <input type="radio" id="statuses" value="statuses" v-model='searchType'>
          <label for="statuses">Statuses</label>
          <input type="radio" id="files" value="files" v-model='searchType'>
          <label for="files">Files</label>
        </span>
        <input type="checkbox" id='important' v-model='searchImportant'>
        <label for="important">Important</label>
      </form>
    </div>

    <div class='flex-chat-body'>
      <b-list-group v-if='!global&&steps.length>0'>
        <b-list-group-item v-for='(step, index) in steps' :key='index' :active='step.selected' @click='stepCicked(step)' :title='step.tsk_timecreated'>
          {{step.tsk_title}}
        </b-list-group-item>
      </b-list-group>

      <div id="all-messages" @scroll="handleScroll" class="feed-back">
        <div id='all2' class="messages">
          <global-feed-message v-if='global' v-for="(mess,i) in messages" :key="i" :mess="mess" />
          <feed-message v-if='!global' v-for="(mess,i) in messages" :key="i" :mess="mess" />
        </div>
      </div>

    </div>
    <div class="progress" v-show="inProgress">
      <p>LOADING FILE {{uploadProgress}}</p>
      <div class="in-progress" :style="'width:'+uploadProgress+'%'"></div>
    </div>
    <div v-if='!global' class="input">
      <button class="btn attach " @click="uploadFile">
        <span class="fas fa-paperclip"></span>
      </button>
      <input type="file" id="file" @change="changeFile" style="display:none;" />
      <!-- ATTACHMENT SYMBOL &#x1f4ce; -->
      <!-- <div class='message-input'> -->
      <textarea v-model="feed" placeholder="New Message..." @keyup='processKeyUp'></textarea>
      <button class="btn btn-success send" v-on:click="writeMessageFeed">
        <span class="fas fa-paper-plane"></span>
      </button>
    </div>
    <b-alert variant="success" :show="haveNewMessage" class='message-notificaton'>
      <span @click='reload' style='display:flex'>You have a new message!</span>
    </b-alert>
    <b-modal ref='stepModal' id='creating-step' size="sm" @ok='createNewStep' @shown='clearStepCreateContent' title='Creating new step'>
      <table class='modal-table'>
        <tr v-if='selectedStep!=null'>
          <td>Time:</td>
          <td>
            {{$moment(selectedStep.fed_time).format('YYYY-MM-DD HH:mm')}}</td>
        </tr>
        <tr>
          <td>Title</td>
          <td>
            <input type='text' v-model='newStep' :class="{ 'step-err' : stepErr }" />
          </td>
        </tr>
      </table>
    </b-modal>
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
    GlobalFeedMessage
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
      searchType: "all",
      searchText: "",
      searchImportant: false,
      dataFromBegining: 1,
      numOfMessages: null,
      loadingData: false,
      test: true,
      steps: [],
      newStep: "",
      stepErr: false,
      haveNewMessage: false,
      firstLoad: true
    };
  },
  computed: {
    ...mapState({
      // messages: state => state.modulefeed.messages,
      darkTheme: state => state.darkTheme,
      searchFeedsParams: state => state.modulefeed.searchFeedsParams,
      selectedStep: state => state.modulefeed.selectedStep,
      pro_id: state => state.sidebarItemSelection[0]
    }),
    ...mapGetters({
      taskid: "selectedItemID",
    }),
    searchOn() {
      if (this.searchType !== "all") return true;
      if (this.searchImportant) return true;
      if (this.searchText !== null && this.searchText.length > 0) return true;
      return false;
    },
    messages(state){
      // console.log('messages computed');
      var messages = state.$store.state.modulefeed.messages
      var newArray = [];
      
      if(this.steps==null||this.steps.length==0){
        // console.log('Nema stepova');
        return messages;
      }
        
      
      // Set up steps
      var j=0;
      var step = this.steps[0];
      var stepTime = this.$moment(step.tsk_timecreated);
      var lastStep = null;

      var lastStepWritten = false;

      for(var i in messages){
        var message = messages[i];
        var messageTime = this.$moment(message.fed_time);
        // console.log(stepTime);
        // console.log(messageTime);
        // console.log(messageTime.isAfter(stepTime));
        if(messageTime < stepTime){  // Znaci da je poruka od prethodnog stepa ili od taska ukoliko je prvi step
          // console.log('if');
          if(j==0){
            message.stp_id = null;  // Znaci da je od taska
          }
          else{ // Znaci da je od prethodnog stepa
            message.stp_id = lastStep.tsk_id;
          }
        }
        else{ // Znaci da treba da pomerim step unapred
          // console.log('else');
          if( j<this.steps.length-1 ){  // Znaci nismo na poslednjem stepu
            // console.log('if');
            // Dodavanje hedera za step
            var heder = {
              fed_id: null,
              fed_important: 0,
              fed_text: step.tsk_title,
              fed_time: step.tsk_timecreated,
              fed_type: 'header',
              taskID: null,
              usr_name: "",
              usr_surname: "",
            };
            newArray.push(heder);
            message.stp_id = step.tsk_id;
            lastStep = step;
            step = this.steps[++j];
            stepTime = this.$moment(step.tsk_timecreated); 
          }
          else{ // Znaci da smo na poslednjem stepu
            if(!lastStepWritten){
              lastStepWritten = true;
              // Dodavanje hedera za step
              var heder = {
                fed_id: null,
                fed_important: 0,
                fed_text: step.tsk_title,
                fed_time: step.tsk_timecreated,
                fed_type: 'header',
                taskID: null,
                usr_name: "",
                usr_surname: "",
              };
              newArray.push(heder);
            }
            // console.log('else');
            message.stp_id = step.tsk_id;
          }
          
        }
        newArray.push(message);
      }

      return newArray;
    }
  },
  watch: {
    taskid(val) {
      if (val === "") return;
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
    },
    searchType() {
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeFeeds();
    },
    searchImportant() {
      this.readeFeeds();
    },
    newStep(newVal, old) {
      if (this.stepErr && newVal.length > 0) this.stepErr = false;
    }
  },
  methods: {
    changeSelectedTask(){
      store.commit("clearFeed");
      this.refreshSearchParams();
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeSteps();
      this.readeFeeds();
      store.commit("setSearchFeedParams", null);
    },
    clearStepCreateContent() {
      this.newStep = "";
      this.stepErr = false;
    },
    createNewStep(evt) {
      evt.preventDefault();
      if (this.newStep.length == 0) {
        this.stepErr = true;
        return;
      }
      var time = this.selectedStep.fed_time.replace(".0", "");
      api
        .createStepFromFeed(this.taskid, time, this.newStep, null)
        .then(result => {
          this.readeSteps();
          this.reload();
          store.commit("setSelectedStep", null);
        })
        .catch(() => {
          this.reload();
        });
      this.$refs.stepModal.hide();
    },
    stepCicked(step) {
      this.jumpToStepFeed(this.taskid, step.tsk_timecreated);
    },
    textInputBlur() {
      if (this.searchText == null || this.searchText.length == 0) return;
      this.readeFeeds();
    },
    reload() {
      store.commit("clearFeed");
      this.refreshSearchParams();
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      this.readeFeeds();
      store.commit("setSearchFeedParams", null);
    },
    refreshSearchParams() {
      this.searchType = "all";
      this.searchText = "";
      this.searchImportant = false;
    },
    processKeyUp(event) {
      if (event.key == "Enter" && event.ctrlKey) {
        this.writeMessageFeed();
      }
    },
    readeFeeds() {
      store.commit("clearFeed");
      this.loadingData = true;
      store
        .dispatch("readeFeeds", {
          taskid: this.taskid,
          fedid: 0,
          direction: "start",
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant
        })
        .then(() => {
          this.scrollToBegining();
          this.numOfMessages = this.messages.length;
          this.loadingData = false;
          if (this.firstLoad) {
            this.firstLoad = false;
            store.dispatch("getFeedCount");
            // console.log('Zeljkovi poziv');
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
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
      setTimeout(() => {
        var a = document.querySelectorAll(".selector");
        a = a[a.length - 1];
        a.scrollIntoView(true);
      }, 500);
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
      // console.log('Add up');
      if (this.loadingData) return;
      if (this.taskid === -1) return;
      if (this.messages == null || this.messages.length == 0) return;

      // Dodato zbog hedera za stepove
      var message = this.messages[0];
      var i = 0;
      while(message.fed_type=='header'){
        message = this.messages[i++];
        if(message===undefined||message===null) // Znaci da su sve poruke do kraja zapravo hederi
          return;
      }
      
      this.loadingData = true;
      store
        .dispatch("readeFeeds", {
          taskid: this.taskid,
          fedid: message.fed_id,
          direction: "up",
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant
        })
        .then(response => {
          if (
            response.data.data !== undefined &&
            response.data.data.length > 0
          ) {
            this.scrollAfterUp(response.data.data.length);
          }
          this.loadingData = false;
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    newMessages() {
      if (this.loadingData) return;
      api
        .checkNewwMessages(this.taskid)
        .then(result => {
          this.loadingData = false;
          if (result.data.status != "OK") {
            return;
          }
          if (result.data.data > 0) {
            var e = document.getElementById("all-messages");
            if (
              parseInt(e.offsetHeight) + parseInt(e.scrollTop) ==
              parseInt(e.scrollHeight)
            ) {
              this.addDown();
            } else {
              this.haveNewMessage = true;
            }
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    addDown() {
      if (this.loadingData) return;
      api
        .readeFeeds(
          this.taskid,
          this.messages[this.messages.length - 1].fed_id,
          "down"
        )
        .then(result => {
          this.loadingData = false;
          if (result.data.status != "OK") {
            return;
          }
          if (result.data.data.length > 0) {
            store.commit("addMessages", {
              direction: "down",
              data: result.data.data
            });
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    handleScroll(e) {
      if(!this.global)
        this.processStepSelection();
      if (
        parseInt(!this.dataFromBegining && e.target.offsetHeight) +
          parseInt(e.target.scrollTop) ==
        parseInt(e.target.scrollHeight)
      ) {
        // console.log('add down from scroll');
        this.addDown();
        return;
      }
      if (e.target.scrollTop === 0) {
        this.addUp();
      }
    },
    processStepSelection(){
      // var messages = document.querySelectorAll(".selector");
      // if(messages===undefined||messages===null||messages.length===0)
      //   return;
      // for (var i in messages) {
      //   var message = messages[i];
      //   if (this.isInViewport(message)) {
      //     var selectedMessage = this.messages[i];
      //     var time = selectedMessage.fed_time;
      //     this.selectStep(time);
      //     break;
      //   }
      var messages = document.querySelectorAll(".selector");
      if (messages === undefined || messages === null || messages.length === 0)
        return;
      for (var i in messages) {
        if(this.messages[i].fed_type=='header')
          continue;
        var message = messages[i];
        if (this.isInViewport(message)) {
          var selectedMessage = this.messages[i];
          var time = selectedMessage.fed_time;
          this.selectStep(time);
          break;
        }
      }
    },
    selectStep(time) {
      this.deselectSteps();
      time = this.$moment(time);
      var length = this.steps.length;
      for (var i = 0; i < length; i++) {
        var stepTime = this.$moment(this.steps[i].tsk_timecreated);
        if (
          time >= stepTime &&
          (i + 1 >= length ||
            time <= this.$moment(this.steps[i + 1].tsk_timecreated))
        ) {
          // taj step treba da se selektuje
          this.steps[i].selected = true;
          var steps = this.steps;
          this.steps = [];
          this.steps = steps;
          return;
        }
      }
    },
    deselectSteps() {
      for (var i in this.steps) {
        this.steps[i].selected = false;
      }
    },
    scrollTOTop() {
      var a = document.querySelectorAll(".selector");
      if (a === undefined || a === null || a.length == 0) return;
      a = a[0];
      if (a !== undefined) a.scrollIntoView(true);
    },
    scrollToBegining() {
      var a = document.querySelectorAll(".selector");
      if (a === undefined || a === null || a.length == 0) return;
      if (a.length == 0) a = a[0];
      else {
        a = a[a.length - 1];
      }
      if (a !== undefined) a.scrollIntoView(true);
    },
    scrollAfterUp(responseLength) {
      var a = document.querySelectorAll(".selector");
      a = a[responseLength];
      a.scrollIntoView(true);
    },
    jumpToStepFeed(tsk_id, stp_time_created) {
      api.searchStepFeeds(tsk_id, stp_time_created).then(result => {
        if (result.data.status != "OK") {
          alert("Faild to load data");
          return;
        }
        store.commit("addMessages", {
          direction: "start",
          data: result.data.data
        });
        if (this.firstLoad) {
          this.firstLoad = false;
          store.dispatch("getFeedCount");
          // console.log('Zeljkovi poziv');
        }
        setTimeout(() => {
          this.scrollTOTop();
          this.processStepSelection();
          this.addUp();
        }, 5);
      });
    },
    readeSteps() {
      // console.log('readeSteps');
      api.getTaskInfo(this.taskid).then(result => {
        if (result.data.status != "OK") {
          alert(
            "Error happen while trying to get steps info. Reload the page."
          );
          return;
        }
        this.steps = result.data.data;
        this.deselectSteps();
      });
    },
    isInViewport(el) {
      if (el == null) return;
      const rect = el.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      var wrapperTop = document.getElementById("all2").offsetTop + 50;
      const vertInView =
        rect.top <= windowHeight &&
        rect.top + rect.height >= 0 &&
        rect.top >= wrapperTop;
      return vertInView;
    }
  },
  mounted() {
    console.log('Mounted is obicnog');
    // var time1 = this.$moment('2018-07-25 14:04:39');
    // var time2 = this.$moment('2018-07-25 14:04:45');
    // console.log( time2>time1 );

    if (!this.global) {
      this.readeSteps();
    }
    if (this.searchFeedsParams === null) {
      this.readeFeeds();
    } else {
      this.dataFromBegining = 0;
      var tsk_id = this.searchFeedsParams.tsk_id;
      var stp_time_created = this.searchFeedsParams.stp_time_created;
      this.jumpToStepFeed(tsk_id, stp_time_created);
    }

    // ZX - POZIVA REFRESH NOTIFA
    // store.dispatch("getFeedCount");

    //poziva api svaki put kada je count deljiv sa countNumber
    if (this.global) 
      return;
    this.fInterval = setInterval(() => {
      if (
        this.count % this.countNumber == 0 &&
        this.taskid != -1 &&
        !this.searchOn
      ) {
        if (this.messages.length > 0) {
          // this.newMessages();
        }
      }
      this.count++;
      if (this.count == 10) {
        this.countNumber = 5;
      } else if (this.count == 60) {
        this.countNumber = 30;
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.fInterval);
    store.commit("clearFeed");
    store.commit("setSearchFeedParams", null);
    this.dataFromBegining = 1;
  }
};
</script>
<style scoped>
.step-err {
  border: 2px solid red;
}

#all-messages {
  /* height: 500px; */
}

.search-inputs {
  margin: 10px auto 0;
}

.message-notificaton {
  cursor: pointer;
  background-color: green;
  position: fixed;
  right: 20px;
  bottom: 20px;
}

.notification-on {
  display: block;
}

.search-inputs {
  margin: 10px;
  text-align: center;
}

.search-inputs * {
  padding: 5px;
}

.search-inputs input[type="text"] {
  width: 400px;
  border-radius: 5px;
}

.darkTheme .search {
  background-color: #232323 !important;
  border: 1px solid #d2d2d236;
}

.search {
  background-color: #fff;
  border: 1px solid #d2d2d2b3;
}

.list-group {
  height: 100%;
  overflow-x: auto;
  border-right: 1px solid #8a888866;
}

.list-group-item {
  border: none;
  cursor: pointer;
}

.darkTheme .list-group-item {
  background: var(--dark);
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}

.flex-chat-body {
  display: flex;
  margin-bottom: 10px;
  height: 0;
  flex: 1;
  border: 1px solid #8a888866;
  border-radius: 5px;
  background: #fff;
}

.feed-back {
  overflow-y: auto;
  word-wrap: break-word;
  flex: 1;
  display: flex;
  background: #fff;
}

/* .darkTheme .feed-back,
.darkTheme .flex-chat-body {
  background: var(--sec-bg-color);
} */

.feed-back .load {
  margin: auto;
  display: block;
  line-height: 0.5;
}

.input {
  bottom: 0px;
  display: flex;
  align-items: center;
  position: relative;
}

/* .input > * {
  margin: 0 0 0 5px;
} */

.input textarea {
  color: black;
  padding: 5px 65px 5px;
  flex: 1;
  background-color: #fff;
  border-color: #8a888866;
  font-size: 16px;
  resize: none;
  border-radius: 5px;
}

.input button {
  position: relative;
  border-radius: 5px;
  width: 42px;
  height: 42px;
}

.input button:first-child {
  position: absolute;
  left: 15px;
  background: #5da6f5f0;
}

.input button:last-child {
  position: absolute;
  right: 15px;
}

.input button > span {
  font-size: 16px;
}

.message-input {
  position: relative;
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

.messages {
  flex: 1;
}

.modal-table td:first-child {
  color: #adadad;
}

.modal-table td {
  padding: 0 20px 10px 0;
}
</style>
