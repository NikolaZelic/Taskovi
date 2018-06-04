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
body {
  margin: 0;
  padding: 0;
  font-family: "Titillium Web";
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
@font-face {
  /* font-family: Raleway;
  src: url(~./assets/fonts/Raleway.ttf); */
  font-family: TitilliumWeb;
  src: url(~./assets/fonts/TitilliumWeb.ttf);
}
</style>
