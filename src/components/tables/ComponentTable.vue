<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <slot name="header" />
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <slot name="body" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
//
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
