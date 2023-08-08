<template>
  <v-app id="wrapper">
    <guest v-if="!$root.logged"></guest>
    <authorized v-else></authorized>
    <notifications position="bottom right"/>
  </v-app>
</template>

<script>
import Authorized from './roots/Authorized.vue'
import Guest from './roots/Guest.vue'

export default {
  components: { 
    Guest,
    Authorized,
  },
}
</script>

<style>

</style>