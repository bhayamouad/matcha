<template>
  <profile></profile>
</template>

<script>
import Profile from "@/components/Profile.vue";
export default {
    middleware: 'redirect',
    layout: 'home',
   components: {
    profile: Profile
  },
}
</script>

<style>

</style>