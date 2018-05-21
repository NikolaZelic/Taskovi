<template>
  <div v-bind:class="mess.right?'cont right-con':'cont left-con'" :id="mess.fed_id">
    <img src="@/assets/user.png"/><span class="name">{{mess.usr_name +' '+ mess.usr_surname}}</span>
    <p class="message">{{mess.fed_text}}</p>
    <div class="attachment"></div>
    <div class="progress" v-if="mess.my"><p>LOADING FILE {{uploadProgress}}</p><div class="in-progress" :style="'width:'+uploadProgress+'%'"></div></div>
    <!-- samo za attachment -->
    <span class='time-right'>{{mess.fed_time.substring(0,19)}}</span>
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
      posalji(){
        var fd = new FormData();
        console.log(this.mess.my);
        fd.append("file",this.mess.my);//ili this.fileUpload.image umesto f
        fd.append("tskid",1);//ili this.fileUpload.image umesto f

        axios.post('http://671n121.mars-t.mars-hosting.com/mngapi/tasks/:tasid/feeds/:fedid/attachment', fd, {
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
      if(this.mess.my)this.posalji();
      if(this.mess.fed_id<0)this.$emit('messCreate');//ovo je samo privremeno dok ne dobijem ime korisnika vezano za feed id

    }

  }

</script>

<style scoped>
  .cont {
      border: 2px solid #dedede;
      background-color: #f1f1f1;
      border-radius: 5px;
      padding: 5px 10px;
      margin: 3px 2px;

  }
  .cont img{
      width: 7%;
      height: 30px;
      padding: 3px;
      float:left;

  }
  .cont .name{
      font-size: 12px;
      font-style: oblique;
      float:left;
      width:93%;

  }
  .cont .message{
      padding-left: 10px;
      color:black;
  }

  .right-con {
      border-color: #ccc;
      background-color: #ddd;
      text-align: right;
      margin-left: 10px;
  }
  .left-con {
    margin-right: 10px;



  }

  .cont::after {
      content: "";
      clear: both;
      display: table;
  }
  .time-right {
    float: right;
    color: #999;
    font-size: 12px;
    width:100%;
    text-align: right;


}
.left-con p{
  display: inline;
  text-align: left;
}



/* attachment */
.

.progress{
  margin:0 auto;
  position: relative;
  width:90%;
  height:20px;
  border: 2px solid #ccc;
    border-radius: 4px;
}
.progress p{
  position: absolute;
  text-align: center;
  width: 100%;
  font-size: 12px;
}
.progress .in-progress{
  background-color: #0a0;
  height: 100%;
  width: 0;
}




</style>
