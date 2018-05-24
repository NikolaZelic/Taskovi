<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import "./assets/sidebar.css";
@import "./assets/StartPageWallpaper.jpg"
*, *::before, *::after {
	box-sizing: border-box;
}
#app {
  margin: 0;
  padding: 0;
  font-family: "Raleway" !important;
}
</style>
