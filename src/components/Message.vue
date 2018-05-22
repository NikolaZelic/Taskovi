<template>
<div v-bind:class="mess.right?'cont right-con':'cont left-con'" :id="mess.fed_id">
  <img src="@/assets/user.png" />
  <div class="message-body">
    <div class="message-body-header">
      <span class="name">{{mess.usr_name +' '+ mess.usr_surname}}</span>
      <span class='time-right'>{{mess.fed_time.substring(0,19)}}</span>
    </div>
    <p class="message">{{mess.fed_text}}</p>
    <div class="attachment"></div>
    <a target="_blank" :href='showFile()' class="attach show" v-if="mess.fed_type==='attachment'">Show file</a>
    <!-- samo za attachment -->

  </div>
</div>
</template>

<script>
import axios from 'axios';
  export default{
    props:{
      mess:{
        type:Object

      }
    },
    data:function(){
      return {
        uploadProgress:0
      }
    },
    methods:{
      showFile(){
        return "http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/feeds/"+this.mess.fed_id+"/attachment";
      },
      posalji(){
        var fd = new FormData();
        console.log(this.mess.my);
        console.log("prikaz filea");
        fd.append("file",this.mess.my);//ili this.fileUpload.image umesto f
        fd.append("tasid",1);//ili this.fileUpload.image umesto f

        axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/feeds/insertattachment', fd, {
                    // headers: { 'content-type': 'multipart/form-data' },
                    onUploadProgress: progressEvent => {this.uploadProgress=Math.round(progressEvent.loaded/progressEvent.total*100)}
        })
        .then((res)=>{
          console.log("Ovo je nazad");
          console.log(res);
        })
        .catch((err)=>{
          console.log("Eror");
        });
      }
    },
    mounted: function(){
      

    }

  }
</script>

<style scoped>
.cont {
  background-color: #ddd;
  padding: 5px 10px;
  margin: 7px;
}

.cont img {
  /* width: 7%; */
  height: 30px;
  /* padding: 3px; */
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
  /* text-align: right; */
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



/* attachment */

. .progress {
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
