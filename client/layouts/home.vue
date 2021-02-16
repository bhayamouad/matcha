<template>
  <div id="home-all">
    <sidenav></sidenav>
    <nuxt id="content"/>
  </div>
</template>

<script>
import Sidenav from "~/components/SideNav";
export default {
  middleware: 'inauth',
  components: {Sidenav},
  head() {
  return {
    title: "Matcha",
  };
  }
}
</script>

<style src="@/style/home.css">

</style>