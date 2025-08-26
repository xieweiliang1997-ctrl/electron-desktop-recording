<script setup >

import { darkTheme } from 'naive-ui'

</script>

<template>
  <div id="app">
    <n-config-provider :theme="darkTheme">
    <router-view></router-view>
  </n-config-provider>
  </div>
</template>

<style  scope>
  /* #app{
    background:#101014
  } */
</style>
