<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@import "./assets/css/bootstrap.min.css";
@import "./assets/css/CustomToggles.css";
@import "./assets/css/tabsComponent.css";
body {
  margin: 0;
  padding: 0;
  font-family: "TitilliumWeb";
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
@font-face {
  font-family: TitilliumWeb;
  src: url(~./assets/fonts/TitilliumWeb.ttf);
}
</style>
