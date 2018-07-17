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
@import "./assets/css/CustomControls.css";
@import "./assets/css/SidebarTable.css";
@import "./assets/css/DarkTheme.css";
@import "./assets/css/CssVars.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: "TitilliumWeb";
}

@font-face {
  font-family: TitilliumWeb;
  src: url(~./assets/fonts/TitilliumWeb.ttf);
}
</style>
