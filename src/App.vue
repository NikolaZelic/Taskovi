<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo() {
    return {
      title: "Omni Tasker"
    };
  },
};
</script>

<style>
@import "./assets/css/CustomControls.css";
@import "./assets/css/SidebarTable.css";
@import "./assets/css/DarkTheme.css";
@import "./assets/css/CssVars.css";

@font-face {
  font-family: TitilliumWeb;
  src: url(~./assets/fonts/TitilliumWeb.ttf);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  outline: 0;
}

body {
  margin: 0;
  padding: 0;
  font-family: "TitilliumWeb" !important;
  overflow: hidden !important;
}
</style>
