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
@import "./assets/css/TabsComponent.css";
@import "./assets/css/SidebarTable.css";
@import "./assets/css/DarkTheme.css";

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
