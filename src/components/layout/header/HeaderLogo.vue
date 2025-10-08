<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden" src="/images/logo/logo.png" width="150" height="40" alt="Logo" />
    <img
      class="hidden dark:block"
      src="/images/logo/logo-dark.png"
      width="150"
      height="40"
      alt="Logo"
    />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
