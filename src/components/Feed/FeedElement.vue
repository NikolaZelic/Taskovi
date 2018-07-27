<template>
  <div class="feed" :class='{darkTheme: darkTheme}' v-show="showFeeds">
    <div class="search-inputs">
      <input @blur="textInputBlur" v-model="searchText" type='text' placeholder="Search Feed" class='search' />
      <form class='form-search'>
        <b-form-radio-group class='radio-group' v-model="searchType" :options="radioFilter"></b-form-radio-group>
        <b-form-checkbox v-model="searchImportant">Important</b-form-checkbox>
      </form>
    </div>

    <div class='flex-chat-body'>
      <b-list-group v-if='!global&&timestamps.length>0'>
        <b-list-group-item v-for='(timestamp, index) in timestamps' :key='index' :active='timestamp.selected' @click='stepCicked(timestamp)'
          :title='timestamp.fed_time'>
          {{timestamp.fed_text}}
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
      countNumber: 1,
      fInterval: null,
      feed: "",
      uploadProgress: 50,
      inProgress: false,
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
      firstLoad: true,
      searchType: "messages",
      radioFilter: [
        {
          text: "Messages",
          value: "messages"
        },
        {
          text: "Statuses",
          value: "statuses"
        },
        {
          text: "Files",
          value: "files"
        },
        {
          text: "All",
          value: "all"
        }
      ],
      timestamps: []
    };
  },
  computed: {
    ...mapState({
      messages: state => state.modulefeed.messages,
      darkTheme: state => state.darkTheme,
      // searchFeedsParams: state => state.modulefeed.searchFeedsParams,
      selectedStep: state => state.modulefeed.selectedStep,
      pro_id: state => state.sidebarItemSelection[0]
    }),
    ...mapGetters({
      taskid: "selectedItemID"
    }),
    searchOn() {
      if (this.searchType !== "all") return true;
      if (this.searchImportant) return true;
      if (this.searchText !== null && this.searchText.length > 0) return true;
      return false;
    }
    // timestamps(){
    //   return this.messages.filter( el => el.fed_islabel==1 );
    // },
  },
  watch: {
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
    changeSelectedTask() {
      // console.log('changeSelectedTask');
      store.commit("clearFeed");
      this.refreshSearchParams();
      this.dataFromBegining = 1;
      this.haveNewMessage = false;
      // this.readeSteps();
      this.readeTimestemps();
      this.readeFeeds();
      // store.commit("setSearchFeedParams", null);
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
      var time = this.selectedStep.fed_time;
      time = this.$moment(time).subtract(-1, "secounds");
      time.seconds(time.seconds() - 1);
      api
        .createTimestamps(
          this.taskid,
          time.format("YYYY-MM-DD HH:mm:ss"),
          this.newStep
        )
        .then(result => {
          // this.readeSteps();
          this.readeTimestemps();
          this.reload();
          store.commit("setSelectedStep", null);
        })
        .catch(() => {
          this.reload();
        });
      this.$refs.stepModal.hide();
    },
    stepCicked(step) {
      var time = step.fed_time;
      time = this.$moment(time);
      this.jumpToStepFeed(this.taskid, time.format("YYYY-MM-DD HH:mm:ss"));
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
      // store.commit("setSearchFeedParams", null);
    },
    refreshSearchParams() {
      this.searchType = "messages";
      this.searchText = "";
      this.searchImportant = false;
    },
    processKeyUp(event) {
      if (event.key == "Enter" && event.ctrlKey) {
        this.writeMessageFeed();
      }
    },
    readeTimestemps() {
      this.timestamps = [];
      api.readeTimestemps(this.taskid).then(result => {
        if (result.data.status != "OK") {
          alert("Eror happen while trying to get timestemps");
          return;
        }
        if (result.data.data !== undefined && result.data.data.length > 0) {
          this.timestamps = result.data.data;
          this.deselectTimestemps();
        }
      });
    },
    readeFeeds() {
      // console.log('Reade feeds');
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
          }
          this.processStepSelection();
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
      api.postMessage(this.taskid, text).then(result => {
        if (result.data.status != "OK") {
          alert("Problem durning sending the message");
          return;
        }
        this.addDown(true);
      });
      // setTimeout(() => {
      //   var a = document.querySelectorAll(".selector");
      //   a = a[a.length - 1];
      //   a.scrollIntoView(true);
      // }, 500);
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
      if (this.loadingData) return;
      if (this.taskid === -1) return;
      if (this.messages == null || this.messages.length == 0) return;

      // Dodato zbog hedera za stepove
      // var message = this.messages[0];
      // var i = 0;
      // while (message.fed_type == "header") {
      //   message = this.messages[i++];
      //   if (message === undefined || message === null)
      //     // Znaci da su sve poruke do kraja zapravo hederi
      //     return;
      // }
      var message = this.messages[0];

      this.loadingData = true;
      store
        .dispatch("readeFeeds", {
          taskid: this.taskid,
          fedid: message.fed_id,
          direction: "up",
          type: this.searchType,
          searchingstring: this.searchText,
          fed_important: this.searchImportant,
          fedtime: message.fed_time
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
            this.countNumber = 1;
            this.count = 0;
            var e = document.getElementById("all-messages");
            if (
              parseInt(e.offsetHeight) + parseInt(e.scrollTop) ==
              parseInt(e.scrollHeight)
            ) {
              this.addDown(true);
            } else {
              this.haveNewMessage = true;
            }
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    addDown(scrollDown) {
      // console.log('AddDown');
      if (this.loadingData) return;
      var message = this.messages[this.messages.length - 1];
      if (message === undefined || message === null) return;
      // console.log(message);
      api
        .readeFeeds(
          this.taskid,
          message.fed_id,
          "down",
          undefined,
          undefined,
          undefined,
          message.fed_time
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
            if (scrollDown === true) {
              setTimeout(() => {
                this.scrollToBegining();
              }, 50);
            }
          }
        })
        .catch(err => {
          this.loadingData = false;
        });
    },
    handleScroll(e) {
      if (!this.global) this.processStepSelection();
      if (
        parseInt(!this.dataFromBegining && e.target.offsetHeight) +
          parseInt(e.target.scrollTop) ==
        parseInt(e.target.scrollHeight)
      ) {
        this.addDown();
        return;
      }
      if (e.target.scrollTop === 0) {
        this.addUp();
      }
    },
    processStepSelection() {
      if (this.timestamps == null || this.timestamps.length === 0) return;
      var messages = document.querySelectorAll(".selector");
      if (messages === undefined || messages === null || messages.length === 0)
        return;
      for (var i in messages) {
        var message = messages[i];
        if (this.isInViewport(message)) {
          this.selectTimestemp(this.messages[i].fed_time);
          return;
        }
      }
      console.log("Nista nije selektovano");
    },
    selectTimestemp(time) {
      console.log("selectTimestemp");
      this.deselectTimestemps();
      time = this.$moment(time);
      var length = this.timestamps.length;
      for (var i = 0; i < length; i++) {
        var timestempTime = this.$moment(this.timestamps[i].fed_time);
        if (
          time >= timestempTime &&
          (i + 1 >= length ||
            time <= this.$moment(this.timestamps[i + 1].fed_time))
        ) {
          // taj step treba da se selektuje
          this.timestamps[i].selected = true;
          var timestamps = this.timestamps;
          this.timestamps = [];
          this.timestamps = timestamps;
          return;
        }
      }
    },
    deselectTimestemps() {
      for (var i in this.timestamps) {
        this.timestamps[i].selected = false;
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
      api
        .searchStepFeeds(tsk_id, stp_time_created, this.searchType)
        .then(result => {
          if (result.data.status != "OK") {
            alert("Failed to load data");
            return;
          }
          store.commit("addMessages", {
            direction: "start",
            data: result.data.data
          });
          this.scrollTOTop();
        });
    },
    isInViewport(el) {
      if (el == null) return;
      // if( !el.hasOwnProperty('getBoundingClientRect') ){
      //   console.log('Nema funkciju');
      //   return;
      // }

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
    if (!this.global) {
      this.readeTimestemps();
    }
    this.readeFeeds();

    // if (this.searchFeedsParams === null) {
    //   this.readeFeeds();
    // }
    // else {
    //   this.dataFromBegining = 0;
    //   var tsk_id = this.searchFeedsParams.tsk_id;
    //   var stp_time_created = this.searchFeedsParams.stp_time_created;
    //   this.jumpToStepFeed(tsk_id, stp_time_created);
    // }

    // ZX - POZIVA REFRESH NOTIFA
    // store.dispatch("getFeedCount");

    //poziva api svaki put kada je count deljiv sa countNumber
    if (this.global) return;
    this.fInterval = setInterval(() => {
      if (
        this.count % this.countNumber == 0 &&
        this.taskid != -1
        // && !this.searchOn
      ) {
        if (this.messages.length > 0) {
          this.newMessages();
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
    // store.commit("setSearchFeedParams", null);
    this.dataFromBegining = 1;
  }
};
</script>
<style scoped>
.step-err {
  border: 2px solid red;
}

.search-inputs {
  margin: 10px auto 0;
}

.message-notificaton {
  cursor: pointer;
  position: fixed;
  right: 30px;
  bottom: 50px;
}

.notification-on {
  display: block;
}

.search-inputs {
  margin: 10px 0 0;
  text-align: center;
}

.search-inputs * {
  padding: 5px;
}

.form-search {
  transform: scale(0.9);
}

.search-inputs input[type="text"] {
  max-width: 400px;
  width: 100%;
  border-radius: 5px;
}

.darkTheme .search {
  background-color: #232323 !important;
  border: 1px solid #d2d2d236;
  color: #eee;
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
  padding: 7px 15px;
}

.list-group-item:last-child {
  border: none;
}

.list-group-item:hover {
  background: #7777775c;
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
  background-color: var(--main-bg-color);
  color: var(--main-color);
}

.feed.darkTheme {
  background-color: var(--sec-bg-color);
  color: var(--sec-color);
}

.modal-body,
.modal-footer {
  background: #f4f4f4;
}

.modal-table {
  /* background-color: var(--main-bg-color); */
  color: var(--main-color);
}

.modal-table input {
  border: none;
  border-bottom: 1px solid #7777;
  background: white !important;
  color: var(--main-color) !important;
  padding: 4px 10px;
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
  margin-bottom: 10px;
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
  box-shadow: inset 0 3px 10px 0 #00000026;
  height: 60px;
  transition: height 0.2s;
  transition-timing-function: ease;
}

.input textarea:focus {
  height: 140px;
}

/* .attach:after {
  content: "";
  position: absolute;
  right: -11px;
  top: -10px;
  bottom: -10px;
  width: 1px;
  opacity: 0.5;
  background-color: rgba(212, 212, 212, 0);
  background-image: linear-gradient(
    to top,
    rgba(212, 212, 212, 0) 0,
    #d4d4d4 30%,
    #d4d4d4 70%,
    rgba(212, 212, 212, 0) 100%
  );
} */

.input .input button {
  position: relative;
  border-radius: 5px;
  width: 42px;
  height: 42px;
}

.input button:first-child {
  position: absolute;
  bottom: 10px;
  left: 15px;
  background: var(--ac-color);
  color: white;
}

.input button:last-child {
  position: absolute;
  bottom: 10px;
  right: 20px;
}

.input button:first-child:hover {
  box-shadow: 0 0 20px 1px rgba(19, 138, 255, 0.2);
}

.input button:last-child:hover {
  box-shadow: 0 0 20px 1px rgba(19, 255, 45, 0.2);
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

.radio-group {
  display: inline;
}
</style>
