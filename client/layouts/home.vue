<template>
  <div id="home-all">
    <sidenav></sidenav>
    <nuxt id="content"/>
  </div>
</template>

<script>
import Sidenav from "~/components/SideNav";
import moment from "moment"

moment.updateLocale('en', {
    relativeTime : {
        past: "%s",
        s: "just now",
        ss: "just now",
        m: "%dm",
        mm: "%dm",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd",
        w: "%dw",
        ww: "%dw",
        M: function(number) {
                return number*4+'w'
            },
        MM: function(number) {
                return number*4+'w'
            },
        y: "%dy",
        yy: "%dy"
    }
});
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