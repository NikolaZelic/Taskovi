<template lang="html">
  <div id="wrapper">
   <left-sidebar/>
   <div class="main-content"></div>
   <right-side/>
  </div>
</template>

<script>
import LeftSidebar from "@/components/LeftSidebar"
import RightSide from "@/components/RightSide"
export default {
  components: {
    LeftSidebar,
    RightSide,
  },
}
</script>

<style lang="css">
#wrapper{
  display: flex;
}
.main-content{
  flex: 1;
}
</style>
