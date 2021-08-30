<template>
  <div id="app" class="border container rounded bg-light">
    <!-- <SingSong msg="Welcome to Your Vue.js App"/> -->
    <guessMovie msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import guessMovie from "./components/guessMovie.vue";

export default {
  name: "App",
  components: {
    guessMovie,
  },
  method: {

  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
